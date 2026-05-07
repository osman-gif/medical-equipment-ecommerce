from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import DeliveryArea
from .serializers import DeliveryAreaSerializer


class DeliveryAreaViewSet(viewsets.ModelViewSet):
    """Delivery areas management"""
    queryset = DeliveryArea.objects.all()
    serializer_class = DeliveryAreaSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active delivery areas"""
        areas = DeliveryArea.objects.filter(is_active=True)
        serializer = DeliveryAreaSerializer(areas, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def check_availability(self, request, pk=None):
        """Check if area is available for delivery"""
        try:
            area = DeliveryArea.objects.get(id=pk)
            return Response({
                'id': area.id,
                'name': area.name,
                'available': area.is_active,
                'delivery_fee': str(area.delivery_fee),
                'estimated_days': area.estimated_days
            })
        except DeliveryArea.DoesNotExist:
            return Response(
                {'error': 'Delivery area not found'},
                status=status.HTTP_404_NOT_FOUND
            )
