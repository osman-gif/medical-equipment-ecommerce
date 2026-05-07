import pytest
from django.test import TestCase
from decimal import Decimal
from apps.delivery.models import DeliveryArea


class DeliveryAreaModelTest(TestCase):
    """Test cases for DeliveryArea model"""

    def test_create_delivery_area(self):
        """Test delivery area creation"""
        area = DeliveryArea.objects.create(
            name='Khartoum Central',
            description='Central Khartoum delivery area',
            is_active=True,
            delivery_fee=25.00,
            estimated_days=2
        )
        self.assertEqual(area.name, 'Khartoum Central')
        self.assertEqual(area.description, 'Central Khartoum delivery area')
        self.assertTrue(area.is_active)
        self.assertEqual(area.delivery_fee, Decimal('25.00'))
        self.assertEqual(area.estimated_days, 2)
        self.assertIsNotNone(area.created_at)
        self.assertIsNotNone(area.updated_at)

    def test_delivery_area_str_method(self):
        """Test delivery area string representation"""
        area = DeliveryArea.objects.create(name='Test Area')
        self.assertEqual(str(area), 'Test Area')

    def test_delivery_area_unique_name(self):
        """Test delivery area name uniqueness"""
        DeliveryArea.objects.create(name='Unique Area')
        with self.assertRaises(Exception):  # Should raise IntegrityError
            DeliveryArea.objects.create(name='Unique Area')

    def test_delivery_area_default_values(self):
        """Test delivery area default values"""
        area = DeliveryArea.objects.create(name='Default Area')
        self.assertTrue(area.is_active)
        self.assertEqual(area.delivery_fee, Decimal('0.00'))
        self.assertEqual(area.estimated_days, 3)

    def test_delivery_area_ordering(self):
        """Test delivery area ordering by name"""
        area_z = DeliveryArea.objects.create(name='Z Area')
        area_a = DeliveryArea.objects.create(name='A Area')
        areas = list(DeliveryArea.objects.all())
        self.assertEqual(areas[0], area_a)
        self.assertEqual(areas[1], area_z)