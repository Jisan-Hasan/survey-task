from django.db import models


class Survey(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    # Custom manager for active surveys (optional but useful)
    class ActiveManager(models.Manager):
        def get_queryset(self):
            return super().get_queryset().filter(is_active=True)

    objects = models.Manager() # Default manager
    active = ActiveManager()   # Custom active manager


class Question(models.Model):
    TEXT = "text"
    SINGLE = "single"
    MULTIPLE = "multiple"
    QUESTION_TYPES = [
        (TEXT, "Text Input"),
        (SINGLE, "Single Choice"),
        (MULTIPLE, "Multiple Choice"),
    ]

    survey = models.ForeignKey(Survey, related_name="questions", on_delete=models.CASCADE)
    text = models.CharField(max_length=1000)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    required = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order",)
        unique_together = ('survey', 'order') # Best practice for ordered items

    def __str__(self):
        return f"Q{self.order}: {self.text[:50]}"


class Choice(models.Model):
    question = models.ForeignKey(Question, related_name="choices", on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order",)
        unique_together = ('question', 'order') # Best practice for ordered items

    def __str__(self):
        return f"C{self.order}: {self.text[:50]}"


class Response(models.Model):
    survey = models.ForeignKey(Survey, related_name="responses", on_delete=models.CASCADE)
    # respondent_meta = models.JSONField(default=dict, blank=True) # Optional: if needed later
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response {self.id} for Survey {self.survey_id}"


class Answer(models.Model):
    response = models.ForeignKey(Response, related_name="answers", on_delete=models.CASCADE)
    # CHANGED: Use a descriptive related_name instead of "+"
    question = models.ForeignKey(Question, related_name="answers_by_question", on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True)  # for text answers

    # For single-choice answers
    selected_choice = models.ForeignKey(Choice, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Answer {self.id} (Q: {self.question_id})"


class AnswerChoice(models.Model):
    # for multiple choice answers, links an Answer to multiple Choices
    answer = models.ForeignKey(Answer, related_name="answer_choices", on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('answer', 'choice') # A choice can only be selected once per answer

    def __str__(self):
        return f"AnswerChoice {self.id} (A: {self.answer_id}, C: {self.choice_id})"