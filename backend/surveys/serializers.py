from rest_framework import serializers
from .models import Survey, Question, Choice, Response, Answer, AnswerChoice
from django.db import transaction


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ("id", "text", "order")


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = ("id", "text", "question_type", "required", "order", "choices")


class SurveySerializer(serializers.ModelSerializer):
    # Use Count() annotation in the view to populate this field efficiently
    responses_count = serializers.IntegerField(read_only=True)
    questions = QuestionSerializer(many=True, required=False)

    class Meta:
        model = Survey
        fields = ("id", "title", "description", "is_active", "created_at", "updated_at", "questions", "responses_count")

    def create(self, validated_data):
        questions_data = validated_data.pop("questions", [])
        with transaction.atomic():
            survey = Survey.objects.create(**validated_data)
            for q_data in questions_data:
                choices_data = q_data.pop("choices", [])
                question = Question.objects.create(survey=survey, **q_data)
                # Bulk create choices for efficiency
                Choice.objects.bulk_create([
                    Choice(question=question, **c_data) for c_data in choices_data
                ])
        return survey

    def update(self, instance, validated_data):
        questions_data = validated_data.pop("questions", None)

        # Basic update for the Survey instance fields
        instance = super().update(instance, validated_data)

        # NOTE: A truly robust nested update is complex.
        # For a production application, consider:
        # 1. Deleting all existing nested objects and recreating the full set (simplest but destructive).
        # 2. Using drf-writable-nested.
        # 3. Implementing logic to identify objects for update/create/delete based on IDs.

        if questions_data is not None:
            # OPTION 1: Simple but destructive nested update
            # Delete old questions/choices and recreate
            with transaction.atomic():
                instance.questions.all().delete()
                for q_data in questions_data:
                    choices_data = q_data.pop("choices", [])
                    question = Question.objects.create(survey=instance, **q_data)
                    Choice.objects.bulk_create([
                        Choice(question=question, **c_data) for c_data in choices_data
                    ])

        return instance

class AnswerChoiceReadSerializer(serializers.ModelSerializer):
    # Serializes the Choice object itself for display in Multiple-Choice Answers
    choice = ChoiceSerializer(read_only=True)

    class Meta:
        model = AnswerChoice
        fields = ("id", "choice")


class AnswerReadSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(read_only=True)
    selected_choice = ChoiceSerializer(read_only=True)
    answer_choices = AnswerChoiceReadSerializer(many=True, read_only=True)

    class Meta:
        model = Answer
        fields = ("id", "question", "text", "selected_choice", "answer_choices")


class ResponseReadSerializer(serializers.ModelSerializer):
    answers = AnswerReadSerializer(many=True, read_only=True)
    survey = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Response
        fields = ("id", "survey", "submitted_at", "answers")


class AnswerCreateSerializer(serializers.Serializer):
    question = serializers.IntegerField(help_text="ID of the Question being answered.")
    text = serializers.CharField(allow_blank=True, required=False, help_text="For Text Input questions.")
    selected_choice = serializers.IntegerField(required=False,
                                               help_text="ID of the selected Choice for Single Choice questions.")
    selected_choices = serializers.ListField(child=serializers.IntegerField(), required=False,
                                             help_text="List of Choice IDs for Multiple Choice questions.")


class ResponseCreateSerializer(serializers.Serializer):
    answers = AnswerCreateSerializer(many=True)

    def validate(self, data):
        survey = self.context.get("survey")
        if not survey:
            raise serializers.ValidationError("Survey context is missing.")

        questions = {q.id: q for q in survey.questions.all()}
        answered_q_ids = set()

        for idx, a_data in enumerate(data.get("answers", [])):
            q_id = a_data.get("question")
            if q_id not in questions:
                raise serializers.ValidationError(
                    f"Question ID {q_id} in answer index {idx} does not belong to survey {survey.id}."
                )
            answered_q_ids.add(q_id)

        # Check required questions
        for q in questions.values():
            if q.required and q.id not in answered_q_ids:
                raise serializers.ValidationError(f"Question {q.id} ('{q.text[:20]}...') is required.")

        return data

    def create(self, validated_data):
        survey = self.context["survey"]
        answers_data = validated_data.pop("answers", [])

        with transaction.atomic():
            response = Response.objects.create(survey=survey, **validated_data)

            # Pre-fetch questions and choices once for efficiency
            q_map = {q.pk: q for q in survey.questions.all().prefetch_related('choices')}

            answers_to_create = []
            answer_choices_to_create = []

            for a in answers_data:
                q_id = a["question"]
                q = q_map.get(q_id)

                # Validation already performed, but safe to check
                if not q: continue

                if q.question_type == q.TEXT:
                    # Create Answer with text
                    answers_to_create.append(
                        Answer(response=response, question=q, text=a.get("text", ""))
                    )

                elif q.question_type == q.SINGLE:
                    choice_id = a["selected_choice"]
                    try:
                        choice = q.choices.get(pk=choice_id)
                    except Choice.DoesNotExist:
                        # Validation should have caught this, but re-raise for transaction rollback
                        raise serializers.ValidationError(f"Choice ID {choice_id} does not belong to Question {q_id}.")

                    # Create Answer with selected_choice FK
                    answers_to_create.append(
                        Answer(response=response, question=q, selected_choice=choice)
                    )

                elif q.question_type == q.MULTIPLE:
                    # An Answer object is created first for the set of choices
                    answer_obj = Answer(response=response, question=q)
                    answers_to_create.append(answer_obj)  # Append to be created

                    choice_ids = a.get("selected_choices", [])
                    valid_choices = q.choices.filter(pk__in=choice_ids)

                    # Validation: check for invalid choice IDs
                    if valid_choices.count() != len(choice_ids):
                        invalid_ids = set(choice_ids) - set(valid_choices.values_list('pk', flat=True))
                        # Re-raise for transaction rollback
                        raise serializers.ValidationError(
                            f"Choice IDs {list(invalid_ids)} do not belong to Question {q.id}.")

                    # AnswerChoice objects will be created in the next step
                    # We store the data here, and associate with the correct Answer object later

                else:
                    raise serializers.ValidationError(f"Unsupported question type: {q.question_type}")

            # Bulk create all Answer objects
            created_answers = Answer.objects.bulk_create(answers_to_create)

            created_answer_map = {}
            for answer in created_answers:
                created_answer_map[answer.question_id] = answer.pk

            for a in answers_data:
                q_id = a["question"]
                q = q_map.get(q_id)

                if q.question_type == q.MULTIPLE:
                    answer_id = created_answer_map[q_id]  # Get the primary key of the created Answer

                    choice_ids = a.get("selected_choices", [])
                    valid_choices = q.choices.filter(pk__in=choice_ids)

                    answer_choices_to_create.extend([
                        AnswerChoice(answer_id=answer_id, choice=choice)
                        for choice in valid_choices
                    ])

            if answer_choices_to_create:
                AnswerChoice.objects.bulk_create(answer_choices_to_create)

        return response