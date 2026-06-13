"""URL routing for the orders API endpoints."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet

# Create a router so the order viewset can expose REST endpoints automatically.
router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]
