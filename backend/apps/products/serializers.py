"""Documentation for backend/apps/products/serializers.py."""

from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    """Represents the CategorySerializer class in this module."""
    class Meta:
        """Represents the Meta class in this module."""
        model = Category
        fields = ['id', 'name', 'description']


class ProductSerializer(serializers.ModelSerializer):
    """Represents the ProductSerializer class in this module."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        """Represents the Meta class in this module."""
        model = Product
        fields = ['id', 'sku', 'name', 'description', 'price', 'stock',
                  'available', 'image', 'category', 'category_name',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductDetailSerializer(serializers.ModelSerializer):
    """Represents the ProductDetailSerializer class in this module."""
    category = CategorySerializer(read_only=True)
    
    class Meta:
        """Represents the Meta class in this module."""
        model = Product
        fields = ['id', 'sku', 'name', 'description', 'price', 'stock',
                  'available', 'image', 'category', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
