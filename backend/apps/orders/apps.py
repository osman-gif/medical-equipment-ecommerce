"""Application configuration for the orders module."""

from django.apps import AppConfig


class OrdersConfig(AppConfig):
    """Registers the orders app with Django."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.orders'
