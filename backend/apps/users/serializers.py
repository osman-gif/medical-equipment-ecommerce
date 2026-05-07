from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'line1', 'line2', 'city', 'state', 'postal_code',
                  'country', 'delivery_area_id', 'is_default']
        read_only_fields = ['id']


class UserSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'phone', 'country', 'is_staff', 'addresses']
        read_only_fields = ['id', 'is_staff']


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 
                  'password', 'password_confirm', 'phone']
    
    def validate(self, attrs):
        if attrs.get('password') != attrs.pop('password_confirm'):
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserDetailSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'phone', 'address_1', 'city', 'state', 'postal_code',
                  'country', 'is_staff', 'addresses', 'date_joined']
        read_only_fields = ['id', 'is_staff', 'date_joined']
