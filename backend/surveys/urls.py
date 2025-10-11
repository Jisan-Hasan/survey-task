from django.urls import path, include
from rest_framework.routers import DefaultRouter

from surveys.views import AdminSurveyViewSet, SurveyPublicRetrieveAPIView, SurveySubmitAPIView, PublicSurveyView

router = DefaultRouter()
router.register(r'', AdminSurveyViewSet, basename='surveys')


urlpatterns = [

    path('public-list/', PublicSurveyView.as_view(), name='public-survey'),
    path('details/<int:pk>/', SurveyPublicRetrieveAPIView.as_view(), name='survey-public-retrieve'),
    path('<int:pk>/answers/', SurveySubmitAPIView.as_view(), name='survey-answers'),
    path('', include(router.urls)),
]