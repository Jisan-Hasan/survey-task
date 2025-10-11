from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AdminSurveyCreateAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="admin@example.com",
            password="admin123",
            role="admin",
            is_staff=True
        )

        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

        self.client = APIClient()
        self.url = reverse("surveys-list")  # ViewSet list route

        self.valid_payload = {
            "title": "Survey 1",
            "description": "Test Description",
            "is_active": True,
            "questions": [
                {
                    "question_type": "text",
                    "text": "What is your Name?",
                    "order": 1,
                    "required": True
                },
                {
                    "question_type": "single",
                    "text": "Are you married?",
                    "order": 2,
                    "required": True,
                    "choices": [
                        {"text": "Yes", "order": 1},
                        {"text": "No", "order": 2}
                    ]
                },
                {
                    "question_type": "multiple",
                    "text": "What is your favorite Color?",
                    "order": 3,
                    "required": True,
                    "choices": [
                        {"text": "Red", "order": 1},
                        {"text": "Blue", "order": 2},
                        {"text": "Yellow", "order": 3}
                    ]
                }
            ]
        }

    def test_create_survey_unauthenticated(self):
        """❌ Unauthorized users should get 403/401"""
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.assertIn("detail", response.data)
        self.assertEqual(response.data["detail"], "Authentication credentials were not provided.")

    def test_create_survey_success(self):
        """✅ Admin can create a survey successfully"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data

        # Survey fields
        for field in ["id", "title", "description", "is_active", "created_at", "updated_at", "questions"]:
            self.assertIn(field, data)

        self.assertEqual(data["title"], self.valid_payload["title"])
        self.assertEqual(data["description"], self.valid_payload["description"])
        self.assertTrue(data["is_active"])

        # Questions and choices
        self.assertEqual(len(data["questions"]), 3)

        text_question = data["questions"][0]
        self.assertEqual(text_question["question_type"], "text")
        self.assertEqual(text_question["text"], "What is your Name?")
        self.assertEqual(text_question["choices"], [])

        single_question = data["questions"][1]
        self.assertEqual(single_question["question_type"], "single")
        self.assertEqual(len(single_question["choices"]), 2)

        multiple_question = data["questions"][2]
        self.assertEqual(multiple_question["question_type"], "multiple")
        self.assertEqual(len(multiple_question["choices"]), 3)

    def test_create_survey_missing_title(self):
        """❌ Missing title should return 400"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        payload = self.valid_payload.copy()
        payload.pop("title")  # remove title

        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertEqual(response.data["title"][0], "This field is required.")


    def test_create_survey_invalid_question_choice(self):
        """❌ Invalid choice format should fail"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        payload = self.valid_payload.copy()
        payload["questions"][1]["choices"] = [{"text": "", "order": 1}]  # invalid

        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("questions", response.data)
