"""Documentation for backend/apps/products/views.py."""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer, ProductDetailSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Product categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    """Medical equipment products"""
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'available']
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'stock']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Return all products for admin, only available for regular users"""
        if self.request.user.is_staff:
            return Product.objects.all()
        return Product.objects.filter(available=True)
    
    def get_permissions(self):
        """Allow read operations for anyone, write operations for admin only"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def get_serializer_class(self):
        """Handles the get_serializer_class behavior for this module."""
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def by_category(self, request):
        """Get products by category"""
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response({'error': 'category_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            products = Product.objects.filter(category_id=category_id, available=True)
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def low_stock(self, request):
        """Get products with low stock"""
        threshold = request.query_params.get('threshold', 10)
        try:
            products = Product.objects.filter(stock__lte=int(threshold), available=True)
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response({'error': 'Invalid threshold value'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def update_stock(self, request):
        """Update product stock (admin only)"""
        product = self.get_object()
        quantity = request.data.get('quantity')
        
        if quantity is None:
            return Response({'error': 'quantity parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product.stock += int(quantity)
            product.save()
            return Response(self.get_serializer(product).data, status=status.HTTP_200_OK)
        except ValueError:
            return Response({'error': 'Invalid quantity value'}, status=status.HTTP_400_BAD_REQUEST)
