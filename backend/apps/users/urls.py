"""Documentation for backend/apps/users/urls.py."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AddressViewSet

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('register/', UserViewSet.as_view({'post': 'register'}), name='user-register'),
    path('login/', UserViewSet.as_view({'post': 'login'}), name='user-login'),
    path('profile/', UserViewSet.as_view({'get': 'profile'}), name='user-profile'),
    path('profile/update/', UserViewSet.as_view({'put': 'update_profile'}), name='user-update-profile'),
    path('', include(router.urls)),
]
