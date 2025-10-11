# surveys/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Survey, Response as SurveyResponse, Question
from .serializers import SurveySerializer, ResponseCreateSerializer, ResponseReadSerializer
from rest_framework.generics import RetrieveAPIView, CreateAPIView, get_object_or_404, ListAPIView
from django.db.models import Count
from django.db import transaction


class AdminSurveyViewSet(viewsets.ModelViewSet):
    # Annotate responses_count for the SurveySerializer
    queryset = Survey.objects.all().annotate(
        responses_count=Count('responses')
    ).prefetch_related('questions__choices')  # Efficiently load nested objects

    serializer_class = SurveySerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def responses(self, request, pk=None):
        survey = self.get_object()

        # Pre-fetch deeply for efficient nested read serialization
        qs = survey.responses.all().prefetch_related(
            'answers',
            'answers__selected_choice',
            'answers__answer_choices',
            'answers__answer_choices__choice'
        ).select_related('survey')

        serializer = ResponseReadSerializer(qs, many=True)
        return Response(serializer.data)


class PublicSurveyView(ListAPIView):
    queryset = Survey.objects.all().annotate(
        responses_count=Count('responses')
    ).prefetch_related('questions__choices')

    serializer_class = SurveySerializer
    permission_classes = [AllowAny]
    authentication_classes = []



class SurveyPublicRetrieveAPIView(RetrieveAPIView):
    # Use the custom active manager
    queryset = Survey.active.all().prefetch_related('questions__choices')
    lookup_field = "pk"
    serializer_class = SurveySerializer
    permission_classes = [AllowAny]


class SurveySubmitAPIView(CreateAPIView):
    serializer_class = ResponseCreateSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        # Use Survey.active.get_queryset() for public access checks
        # Select related is good, prefetch_related is needed for QuestionSerializer validation
        survey_qs = Survey.active.all().prefetch_related('questions__choices')
        ctx["survey"] = get_object_or_404(survey_qs, pk=self.kwargs["pk"])
        return ctx

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = serializer.save()

        # Fetch the created response with necessary relations for the read serializer
        response = SurveyResponse.objects.prefetch_related(
            'answers',
            'answers__selected_choice',
            'answers__answer_choices__choice'
        ).get(pk=response.pk)

        read_serializer = ResponseReadSerializer(response)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)