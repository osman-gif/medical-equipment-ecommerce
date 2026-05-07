import pytest
from django.test import TestCase
from django.utils import timezone
from decimal import Decimal
from apps.users.models import User, Address
from apps.products.models import Category, Product
from apps.orders.models import Order, OrderItem


class OrderModelTest(TestCase):
    """Test cases for Order model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.address = Address.objects.create(
            user=self.user,
            line1='123 Main St',
            city='Khartoum',
            country='Sudan'
        )

    def test_create_order(self):
        """Test order creation"""
        order = Order.objects.create(
            user=self.user,
            address=self.address,
            status='pending',
            total=250.00,
            notes='Urgent delivery needed'
        )
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.address, self.address)
        self.assertEqual(order.status, 'pending')
        self.assertEqual(order.total, Decimal('250.00'))
        self.assertEqual(order.notes, 'Urgent delivery needed')
        self.assertIsNotNone(order.created_at)
        self.assertIsNotNone(order.updated_at)

    def test_order_default_status(self):
        """Test order default status"""
        order = Order.objects.create(
            user=self.user,
            address=self.address,
            total=100.00
        )
        self.assertEqual(order.status, 'pending')

    def test_order_str_method(self):
        """Test order string representation"""
        order = Order.objects.create(
            user=self.user,
            address=self.address,
            total=100.00
        )
        expected_str = f"Order #{order.id} - {self.user.email}"
        self.assertEqual(str(order), expected_str)

    def test_order_status_choices(self):
        """Test order status choices"""
        valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        for status in valid_statuses:
            order = Order.objects.create(
                user=self.user,
                address=self.address,
                status=status,
                total=100.00
            )
            self.assertEqual(order.status, status)


class OrderItemModelTest(TestCase):
    """Test cases for OrderItem model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.address = Address.objects.create(
            user=self.user,
            line1='123 Main St',
            city='Khartoum'
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
        self.order = Order.objects.create(
            user=self.user,
            address=self.address,
            total=100.00
        )

    def test_create_order_item(self):
        """Test order item creation"""
        order_item = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=2,
            price_at_order=50.00
        )
        self.assertEqual(order_item.order, self.order)
        self.assertEqual(order_item.product, self.product)
        self.assertEqual(order_item.quantity, 2)
        self.assertEqual(order_item.price_at_order, Decimal('50.00'))

    def test_order_item_str_method(self):
        """Test order item string representation"""
        order_item = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=3,
            price_at_order=50.00
        )
        expected_str = f"{self.product.name} x {order_item.quantity}"
        self.assertEqual(str(order_item), expected_str)

    def test_order_item_unique_together(self):
        """Test unique together constraint for order and product"""
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=1,
            price_at_order=50.00
        )
        with self.assertRaises(Exception):  # Should raise IntegrityError
            OrderItem.objects.create(
                order=self.order,
                product=self.product,
                quantity=2,
                price_at_order=50.00
            )