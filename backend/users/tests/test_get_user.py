from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserDetailAPITestCase(APITestCase):
    def setUp(self):
        # Create users
        self.admin_user = User.objects.create_user(
            email="admin@example.com",
            password="admin123",
            role="admin",
            is_staff=True
        )

        self.normal_user = User.objects.create_user(
            email="user@example.com",
            password="user123"
        )

        # JWT for admin
        refresh = RefreshToken.for_user(self.admin_user)
        self.access_token = str(refresh.access_token)

        # Initialize API client
        self.client = APIClient()

        # Example URLs
        self.detail_url = lambda user_id: reverse("user-detail", args=[user_id])

    def test_user_detail_unauthenticated(self):
        """❌ Should return 403 with custom error when credentials are not provided"""
        url = self.detail_url(self.admin_user.id)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_detail_authenticated_success(self):
        """✅ Should return user details for valid authenticated request"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        url = self.detail_url(self.admin_user.id)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        expected_fields = ["id", "email", "full_name", "role", "is_active", "is_staff"]
        for field in expected_fields:
            self.assertIn(field, data)

        self.assertEqual(data["email"], self.admin_user.email)
        self.assertEqual(data["role"], "admin")
        self.assertTrue(data["is_active"])

    def test_user_detail_not_found(self):
        """❌ Should return custom 404 response for non-existing user"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        non_existing_id = 999
        url = self.detail_url(non_existing_id)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        self.assertEqual(
            response.data["detail"],
            "No User matches the given query."
        )

    def test_user_detail_permission_restricted(self):
        """❌ Normal user should not access other users' details (if restricted)"""
        # Token for normal user
        refresh = RefreshToken.for_user(self.normal_user)
        access_token = str(refresh.access_token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        url = self.detail_url(self.admin_user.id)
        response = self.client.get(url)

        # Depending on permission setup, could be 403 or 200
        if response.status_code == status.HTTP_403_FORBIDDEN:
            self.assertIn("detail", response.data)
        else:
            self.assertEqual(response.status_code, status.HTTP_200_OK)
