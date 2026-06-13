"""Documentation for backend/apps/delivery/serializers.py."""

from rest_framework import serializers
from .models import DeliveryArea


class DeliveryAreaSerializer(serializers.ModelSerializer):
    """Represents the DeliveryAreaSerializer class in this module."""
    class Meta:
        """Represents the Meta class in this module."""
        model = DeliveryArea
        fields = ['id', 'name', 'description', 'is_active', 'delivery_fee',
                  'estimated_days', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
