"""Documentation for backend/apps/delivery/models.py."""

from django.db import models


class DeliveryArea(models.Model):
    """Delivery areas where the store operates"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estimated_days = models.IntegerField(default=3)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        """Represents the Meta class in this module."""
        ordering = ['name']
    
    def __str__(self):
        """Handles the __str__ behavior for this module."""
        return self.name
