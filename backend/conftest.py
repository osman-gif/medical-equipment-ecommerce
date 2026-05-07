import pytest
from django.contrib.auth import get_user_model
from apps.users.models import Address
from apps.products.models import Category, Product
from apps.orders.models import Order, OrderItem
from apps.delivery.models import DeliveryArea

User = get_user_model()


@pytest.fixture
def user():
    """Create a test user"""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123',
        phone='+249123456789'
    )


@pytest.fixture
def admin_user():
    """Create a test admin user"""
    return User.objects.create_user(
        username='admin',
        email='admin@example.com',
        password='admin123',
        is_staff=True,
        is_superuser=True
    )


@pytest.fixture
def address(user):
    """Create a test address"""
    return Address.objects.create(
        user=user,
        line1='123 Main St',
        city='Khartoum',
        country='Sudan'
    )


@pytest.fixture
def category():
    """Create a test category"""
    return Category.objects.create(
        name='Medical Equipment',
        description='Medical supplies and equipment'
    )


@pytest.fixture
def product(category):
    """Create a test product"""
    return Product.objects.create(
        category=category,
        sku='MED001',
        name='Blood Pressure Monitor',
        description='Digital blood pressure monitor',
        price=150.00,
        stock=50,
        available=True
    )


@pytest.fixture
def delivery_area():
    """Create a test delivery area"""
    return DeliveryArea.objects.create(
        name='Khartoum Central',
        delivery_fee=25.00,
        estimated_days=2
    )


@pytest.fixture
def order(user, address):
    """Create a test order"""
    return Order.objects.create(
        user=user,
        address=address,
        total=300.00,
        status='pending'
    )


@pytest.fixture
def order_item(order, product):
    """Create a test order item"""
    return OrderItem.objects.create(
        order=order,
        product=product,
        quantity=2,
        price_at_order=150.00
    )