from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class AuthLoginAPITestCase(APITestCase):
    def setUp(self):
        self.login_url = reverse('login')
        self.user = User.objects.create_user(
            email='jisan@gmail.com',
            password='test1234',
            is_active=True
        )

    def test_login_success(self):
        """✅ User can log in with correct credentials"""
        payload = {"email": "jisan@gmail.com", "password": "test1234"}
        response = self.client.post(self.login_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_invalid_password(self):
        """❌ Invalid password should fail"""
        payload = {"email": "jisan@gmail.com", "password": "wrongpass"}
        response = self.client.post(self.login_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)
        self.assertEqual(
            response.data["detail"],
            "No active account found with the given credentials"
        )

    def test_login_non_existent_user(self):
        """❌ Non-existent user login attempt"""
        payload = {"email": "notfound@gmail.com", "password": "test1234"}
        response = self.client.post(self.login_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)

    def test_login_inactive_user(self):
        """❌ Inactive user cannot log in"""
        user = User.objects.create_user(email="inactive@gmail.com", password="test1234", is_active=False)
        payload = {"email": "inactive@gmail.com", "password": "test1234"}
        response = self.client.post(self.login_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)
        self.assertEqual(
            response.data["detail"],
            "No active account found with the given credentials"
        )

    def test_login_missing_email(self):
        """❌ Missing email should return validation error"""
        payload = {"password": "test1234"}
        response = self.client.post(self.login_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_login_missing_password(self):
        """❌ Missing password should return validation error"""
        payload = {"email": "jisan@gmail.com"}
        response = self.client.post(self.login_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_login_empty_fields(self):
        """❌ Empty email or password"""
        payload = {"email": "", "password": ""}
        response = self.client.post(self.login_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertIn("password", response.data)

    def test_login_invalid_email_format(self):
        """❌ Invalid email format"""
        payload = {"email": "not-an-email", "password": "test1234"}
        response = self.client.post(self.login_url, payload, format='json')

        # SimpleJWT may not validate format, but if you use DRF serializer, it should
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED])

    def test_login_method_not_allowed(self):
        """❌ Only POST should be allowed"""
        response = self.client.get(self.login_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
