from rest_framework import serializers
from .models import DeliveryArea


class DeliveryAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryArea
        fields = ['id', 'name', 'description', 'is_active', 'delivery_fee',
                  'estimated_days', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
