"""Documentation for backend/apps/users/models.py."""

from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """Custom user model for medical equipment store"""
    phone = models.CharField(max_length=50, blank=True, null=True)
    address_1 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, default='Sudan')
    
    groups = models.ManyToManyField(
        'auth.Group',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='users_groups',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='users_permissions',
        verbose_name='user permissions',
    )
    
    class Meta:
        """Represents the Meta class in this module."""
        verbose_name = 'user'
        verbose_name_plural = 'users'
    
    def __str__(self):
        """Handles the __str__ behavior for this module."""
        return self.email or self.username


class Address(models.Model):
    """Customer addresses"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    delivery_area_id = models.IntegerField(null=True, blank=True)
    line1 = models.CharField(max_length=255)
    line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, default='Sudan')
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        """Represents the Meta class in this module."""
        verbose_name_plural = 'addresses'
        ordering = ['-created_at']
    
    def __str__(self):
        """Handles the __str__ behavior for this module."""
        return f"Address for {self.user.email}"
