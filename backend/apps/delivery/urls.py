from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeliveryAreaViewSet

router = DefaultRouter()
router.register(r'areas', DeliveryAreaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
