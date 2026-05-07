from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'sku', 'name', 'description', 'price', 'stock',
                  'available', 'image', 'category', 'category_name',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'sku', 'name', 'description', 'price', 'stock',
                  'available', 'image', 'category', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
