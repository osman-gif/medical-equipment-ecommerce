"""Database models that represent customer orders and their items."""

from django.db import models
from apps.users.models import User, Address
from apps.products.models import Product


class Order(models.Model):
    """Stores a customer order, its address, status, total, and notes."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        """Meta options for ordering and indexing orders efficiently."""

        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        """Return a readable label for the order in admin and logs."""

        return f"Order #{self.id} - {self.user.email}"


class OrderItem(models.Model):
    """Represents a single product entry inside an order."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField()
    price_at_order = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        """Ensure one product is not added twice to the same order."""

        unique_together = ('order', 'product')

    def __str__(self):
        """Return a concise summary of the ordered item."""

        return f"{self.product.name} x {self.quantity}"
