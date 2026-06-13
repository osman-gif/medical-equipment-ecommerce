"""Documentation for backend/apps/users/tests.py."""

import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.users.models import User, Address

User = get_user_model()


class UserModelTest(TestCase):
    """Test cases for User model"""

    def setUp(self):
        """Handles the setUp behavior for this module."""
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'phone': '+249123456789',
            'address_1': '123 Main St',
            'city': 'Khartoum',
            'country': 'Sudan'
        }

    def test_create_user(self):
        """Test user creation with custom fields"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.phone, '+249123456789')
        self.assertEqual(user.address_1, '123 Main St')
        self.assertEqual(user.city, 'Khartoum')
        self.assertEqual(user.country, 'Sudan')
        self.assertTrue(user.check_password('testpass123'))

    def test_user_str_method(self):
        """Test user string representation"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(str(user), 'test@example.com')

    def test_user_str_method_username_fallback(self):
        """Test user string representation falls back to username"""
        user_data = self.user_data.copy()
        user_data['email'] = ''
        user = User.objects.create_user(**user_data)
        self.assertEqual(str(user), 'testuser')


class AddressModelTest(TestCase):
    """Test cases for Address model"""

    def setUp(self):
        """Handles the setUp behavior for this module."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_create_address(self):
        """Test address creation"""
        address = Address.objects.create(
            user=self.user,
            delivery_area_id=1,
            line1='123 Main St',
            line2='Apt 4B',
            city='Khartoum',
            state='Khartoum',
            postal_code='11111',
            country='Sudan',
            is_default=True
        )
        self.assertEqual(address.user, self.user)
        self.assertEqual(address.line1, '123 Main St')
        self.assertEqual(address.line2, 'Apt 4B')
        self.assertEqual(address.city, 'Khartoum')
        self.assertEqual(address.is_default, True)
        self.assertIsNotNone(address.created_at)
        self.assertIsNotNone(address.updated_at)

    def test_address_str_method(self):
        """Test address string representation"""
        address = Address.objects.create(
            user=self.user,
            line1='123 Main St',
            city='Khartoum'
        )
        expected_str = f"Address for {self.user.email}"
        self.assertEqual(str(address), expected_str)
