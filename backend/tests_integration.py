import pytest
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from apps.users.models import User, Address
from apps.products.models import Category, Product
from apps.orders.models import Order, OrderItem
from apps.delivery.models import DeliveryArea

User = get_user_model()


class UserAPITest(APITestCase):
    """Integration tests for User API endpoints"""

    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'phone': '+249123456789'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_user_registration(self):
        """Test user registration endpoint"""
        url = reverse('user-register')
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123',
            'phone': '+249987654321'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)

    def test_user_login(self):
        """Test user login endpoint"""
        url = reverse('token_obtain_pair')
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)


class ProductAPITest(APITestCase):
    """Integration tests for Product API endpoints"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123',
            is_staff=True
        )
        self.category = Category.objects.create(
            name='Medical Equipment',
            description='Medical supplies'
        )
        self.product = Product.objects.create(
            category=self.category,
            sku='MED001',
            name='Test Product',
            description='Test description',
            price=100.00,
            stock=50
        )
        self.client.force_authenticate(user=self.user)

    def test_get_products_list(self):
        """Test retrieving products list"""
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_get_product_detail(self):
        """Test retrieving single product"""
        url = reverse('product-detail', kwargs={'pk': self.product.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Product')

    def test_create_product(self):
        """Test creating new product"""
        url = reverse('product-list')
        data = {
            'category': self.category.id,
            'sku': 'MED002',
            'name': 'New Product',
            'description': 'New product description',
            'price': '75.50',
            'stock': 25
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Product')


class OrderAPITest(APITestCase):
    """Integration tests for Order API endpoints"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='customer',
            email='customer@example.com',
            password='customer123'
        )
        self.address = Address.objects.create(
            user=self.user,
            line1='123 Main St',
            city='Khartoum',
            country='Sudan'
        )
        self.category = Category.objects.create(name='Medical Equipment')
        self.product = Product.objects.create(
            category=self.category,
            sku='MED001',
            name='Test Product',
            description='Test description',
            price=50.00,
            stock=100
        )
        self.client.force_authenticate(user=self.user)

    def test_create_order(self):
        """Test creating new order"""
        url = reverse('order-list')
        data = {
            'address': self.address.id,
            'items': [
                {
                    'product': self.product.id,
                    'quantity': 2
                }
            ],
            'notes': 'Test order'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'pending')
        self.assertEqual(len(response.data['items']), 1)

    def test_get_user_orders(self):
        """Test retrieving user's orders"""
        # Create an order first
        order = Order.objects.create(
            user=self.user,
            address=self.address,
            total=100.00
        )
        OrderItem.objects.create(
            order=order,
            product=self.product,
            quantity=2,
            price_at_order=50.00
        )

        url = reverse('order-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)


class DeliveryAreaAPITest(APITestCase):
    """Integration tests for DeliveryArea API endpoints"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123',
            is_staff=True
        )
        self.delivery_area = DeliveryArea.objects.create(
            name='Khartoum Central',
            delivery_fee=25.00,
            estimated_days=2
        )
        self.client.force_authenticate(user=self.user)

    def test_get_delivery_areas(self):
        """Test retrieving delivery areas"""
        url = reverse('deliveryarea-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_create_delivery_area(self):
        """Test creating new delivery area"""
        url = reverse('deliveryarea-list')
        data = {
            'name': 'Omdurman',
            'description': 'Omdurman delivery area',
            'delivery_fee': '30.00',
            'estimated_days': 3
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Omdurman')