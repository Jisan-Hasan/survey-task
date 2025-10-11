from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserCreateAPITestCase(APITestCase):
    def setUp(self):
        self.url = reverse("user-list-create")

        self.admin_user = User.objects.create_user(
            email="admin@example.com",
            password="admin123",
            role="admin",
            is_staff=True
        )

        refresh = RefreshToken.for_user(self.admin_user)
        self.access_token = str(refresh.access_token)

        self.client = APIClient()

        self.valid_payload = {
            "email": "jisan@gmail.com",
            "password": "test@1234",
            "role": "admin",
        }

    def test_create_user_unauthenticated(self):
        """❌ Should return 403 when authentication credentials not provided"""
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.assertIn("detail", response.data)
        self.assertEqual(
            response.data["detail"],
            "Authentication credentials were not provided."
        )

    def test_create_user_success(self):
        """✅ Should create user successfully with valid data"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("email", response.data)
        self.assertIn("role", response.data)

        self.assertEqual(response.data["email"], self.valid_payload["email"])
        self.assertEqual(response.data["role"], self.valid_payload["role"])

        # Ensure user is created in DB
        self.assertTrue(User.objects.filter(email=self.valid_payload["email"]).exists())

    def test_create_user_invalid_email(self):
        """❌ Should return 400 for invalid email format"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        invalid_payload = {
            "email": "not-an-email",
            "password": "test@1234",
            "role": "admin",
        }
        response = self.client.post(self.url, invalid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertEqual(response.data["email"][0], "Enter a valid email address.")

    def test_create_user_missing_fields(self):
        """❌ Should return 400 if required fields are missing"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        payload = {"email": "test@gmail.com"}  # missing password, role
        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)
        self.assertIn("role", response.data)

    def test_create_user_duplicate_email(self):
        """❌ Should fail if email already exists"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        User.objects.create_user(
            email="duplicate@gmail.com",
            password="somepass",
            role="admin"
        )

        payload = {
            "email": "duplicate@gmail.com",
            "password": "newpass",
            "role": "admin",
        }
        response = self.client.post(self.url, payload, format="json")

        # DRF automatically raises uniqueness validation
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertTrue(any("already exists" in msg for msg in response.data["email"]))
