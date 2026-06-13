"""Serializers used to validate and format order-related API data."""

from rest_framework import serializers
from apps.products.models import Product
from apps.products.serializers import ProductSerializer
from apps.users.models import Address
from apps.users.serializers import AddressSerializer
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializes the product line item inside an order."""
    product_details = ProductSerializer(source='product', read_only=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    
    class Meta:
        """Represents the Meta class in this module."""
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'quantity', 'price_at_order']
        read_only_fields = ['id', 'price_at_order']


class OrderCreateSerializer(serializers.ModelSerializer):
    """Creates a new order and its related order items from API input."""

    items = OrderItemSerializer(many=True, write_only=True)
    address = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all())
    
    class Meta:
        """Represents the Meta class in this module."""
        model = Order
        fields = ['address', 'items', 'notes']
    
    def validate_address(self, value):
        """Reject addresses that do not belong to the current authenticated user."""
        request = self.context.get('request')
        if request and value.user != request.user:
            raise serializers.ValidationError("Address does not belong to you")
        return value
    def create(self, validated_data):
        """Create the order, validate each item, and calculate the total amount."""

        print(f"[OrderCreateSerializer.create] Starting order creation")
        print(f"[OrderCreateSerializer.create] Validated data: {validated_data}")
        
        items_data = validated_data.pop('items')
        print(f"[OrderCreateSerializer.create] Items data: {items_data}")
        print(f"[OrderCreateSerializer.create] Items count: {len(items_data)}")
        
        if not items_data:
            raise serializers.ValidationError("Order must contain at least one item")
        
        try:
            order = Order.objects.create(**validated_data)
            print(f"[OrderCreateSerializer.create] Order created: {order.id}")
        except Exception as e:
            print(f"[OrderCreateSerializer.create] Error creating order: {str(e)}")
            raise serializers.ValidationError(f"Error creating order: {str(e)}")
        
        total = 0
        try:
            for idx, item_data in enumerate(items_data):
                print(f"[OrderCreateSerializer.create] Processing item {idx}: {item_data}")
                
                product = item_data.get('product')
                quantity = item_data.get('quantity')
                
                print(f"[OrderCreateSerializer.create] Product: {product}, Quantity: {quantity}")
                
                if not product:
                    order.delete()
                    raise serializers.ValidationError(f"Item {idx}: Missing product")
                if not quantity:
                    order.delete()
                    raise serializers.ValidationError(f"Item {idx}: Missing or invalid quantity")
                if quantity <= 0:
                    order.delete()
                    raise serializers.ValidationError(f"Item {idx}: Quantity must be greater than 0")
                
                try:
                    price = product.price
                    print(f"[OrderCreateSerializer.create] Product price: {price}")
                except AttributeError:
                    order.delete()
                    raise serializers.ValidationError(f"Item {idx}: Product not found or has no price")
                
                try:
                    order_item = OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price_at_order=price
                    )
                    print(f"[OrderCreateSerializer.create] OrderItem created: {order_item.id}")
                    total += float(price) * int(quantity)
                except Exception as e:
                    order.delete()
                    print(f"[OrderCreateSerializer.create] Error creating order item: {str(e)}")
                    raise serializers.ValidationError(f"Item {idx}: Error creating order item: {str(e)}")
            
            order.total = total
            order.save()
            print(f"[OrderCreateSerializer.create] Order total set to: {total}")
        except serializers.ValidationError:
            raise
        except Exception as e:
            order.delete()
            print(f"[OrderCreateSerializer.create] Unexpected error: {str(e)}")
            raise serializers.ValidationError(f"Error creating order items: {str(e)}")
        
        order.refresh_from_db()
        print(f"[OrderCreateSerializer.create] Order creation complete: {order.id}")
        return order


class OrderDetailSerializer(serializers.ModelSerializer):
    """Returns the full order details used in order detail views."""

    items = OrderItemSerializer(many=True, read_only=True)
    address = AddressSerializer(read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        """Represents the Meta class in this module."""
        model = Order
        fields = ['id', 'user_email', 'address', 'status', 'total', 'notes',
                  'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user_email', 'total', 'created_at', 'updated_at']


class OrderListSerializer(serializers.ModelSerializer):
    """Returns a compact list view of orders for dashboards and history pages."""

    user_email = serializers.CharField(source='user.email', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    address = AddressSerializer(read_only=True)
    
    class Meta:
        """Represents the Meta class in this module."""
        model = Order
        fields = ['id', 'user_email', 'status', 'total', 'created_at', 'updated_at', 
                  'items', 'address', 'notes']
        read_only_fields = ['id', 'user_email', 'total', 'created_at', 'updated_at']


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    """Allows admins to update only the status field of an order."""

    class Meta:
        """Represents the Meta class in this module."""
        model = Order
        fields = ['status']
