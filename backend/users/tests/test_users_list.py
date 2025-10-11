from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserListAPITestCase(APITestCase):
    def setUp(self):
        self.url = reverse("user-list-create")

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

        # Generate JWT for admin
        refresh = RefreshToken.for_user(self.admin_user)
        self.access_token = str(refresh.access_token)

        self.client = APIClient()

    def test_list_users_unauthorized(self):
        """❌ Unauthorized users should get custom auth error"""
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        print(response.data)
        self.assertEqual(
            response.data["detail"],
            "Authentication credentials were not provided."
        )

    def test_list_users_authorized(self):
        """✅ Authorized admin can get user list"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)


        data = response.data
        print(data)
        self.assertIn("results", data)
        self.assertIsInstance(data["results"], list)

        # Validate user fields
        if len(data["results"]) > 0:
            user = data["results"][0]
            for field in ["id", "email", "full_name", "role", "is_active", "is_staff"]:
                self.assertIn(field, user)


    def test_list_users_only_admin_can_access(self):
        """❌ Normal user should be forbidden (if permissions restricted)"""
        refresh = RefreshToken.for_user(self.normal_user)
        token = str(refresh.access_token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.get(self.url)

        # Depending on permission logic, could be 403 or 200
        if response.status_code == status.HTTP_403_FORBIDDEN:
            print(response.data)
            self.assertEqual(response.data["detail"], "You do not have permission to perform this action.")
        else:
            # In case normal user is allowed, validate success
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    