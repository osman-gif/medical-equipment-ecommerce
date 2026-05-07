#!/usr/bin/env python3
"""
Debug script to check orders in the database
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, '/home/ajang/Desktop/CCST_ONLINE/Graduation-Project/backend')

django.setup()

from apps.orders.models import Order, OrderItem
from apps.users.models import User

print("=" * 60)
print("DEBUG: Orders Database Check")
print("=" * 60)

# Check total orders
total_orders = Order.objects.count()
print(f"\n✓ Total Orders in Database: {total_orders}")

# List all orders
print("\nAll Orders:")
if total_orders == 0:
    print("  (No orders found)")
else:
    for order in Order.objects.all().order_by('-created_at'):
        print(f"  - Order #{order.id}")
        print(f"    User: {order.user.email}")
        print(f"    Status: {order.status}")
        print(f"    Total: ${order.total}")
        print(f"    Items: {order.items.count()}")
        print(f"    Created: {order.created_at}")
        print()

# Check orders by user
print("\nOrders by User:")
for user in User.objects.filter(orders__isnull=False).distinct():
    user_orders = Order.objects.filter(user=user)
    print(f"  {user.email}: {user_orders.count()} orders")
    for order in user_orders:
        print(f"    - Order #{order.id}")

# Check for any users at all
all_users = User.objects.count()
print(f"\n✓ Total Users in Database: {all_users}")

print("\n" + "=" * 60)
