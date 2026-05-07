from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Sum, Count, Q, Avg
from django.utils import timezone
from datetime import timedelta

from .models import Order, OrderItem
from .serializers import (
    OrderCreateSerializer, OrderDetailSerializer,
    OrderListSerializer, OrderStatusUpdateSerializer
)


class OrderViewSet(viewsets.ModelViewSet):
    """Order management"""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['id']
    ordering_fields = ['created_at', 'total']
    ordering = ['-created_at']
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == 'retrieve':
            return OrderDetailSerializer
        elif self.action == 'list':
            return OrderListSerializer
        elif self.action == 'update_status':
            return OrderStatusUpdateSerializer
        return OrderDetailSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new order"""
        print(f"[ORDER CREATE] User: {request.user}, Authenticated: {request.user.is_authenticated}")
        print(f"[ORDER CREATE] Request data: {request.data}")
        
        data = request.data.copy()
        serializer = OrderCreateSerializer(data=data, context={'request': request})
        
        if serializer.is_valid():
            try:
                order = serializer.save(user=request.user)
                print(f"[ORDER CREATE] Order created successfully: {order.id}")
                return Response(
                    OrderDetailSerializer(order).data,
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                print(f"[ORDER CREATE] Error saving order: {str(e)}")
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            print(f"[ORDER CREATE] Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get current user's orders"""
        print(f"[MY_ORDERS] User: {request.user}, Auth: {request.user.is_authenticated}")
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        print(f"[MY_ORDERS] Found {orders.count()} orders for user {request.user.id}")
        if orders.exists():
            print(f"[MY_ORDERS] First order: {orders.first().id}, Created: {orders.first().created_at}")
        serializer = OrderListSerializer(orders, many=True)
        print(f"[MY_ORDERS] Serialized data: {len(serializer.data)} items")
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def update_status(self, request):
        """Update order status (admin only)"""
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(OrderDetailSerializer(order).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def by_status(self, request):
        """Get orders filtered by status (admin only)"""
        status_filter = request.query_params.get('status')
        if not status_filter:
            return Response({'error': 'status parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        
        orders = Order.objects.filter(status=status_filter)
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def purchase_history(self, request):
        """Get comprehensive purchase history with analytics (admin only)"""
        # Get query parameters for filtering
        days = int(request.query_params.get('days', 30))
        status_filter = request.query_params.get('status', None)
        user_id = request.query_params.get('user_id', None)
        
        # Build query
        start_date = timezone.now() - timedelta(days=days)
        query = Order.objects.filter(created_at__gte=start_date)
        
        if status_filter:
            query = query.filter(status=status_filter)
        
        if user_id:
            query = query.filter(user_id=user_id)
        
        # Get orders
        orders = query.order_by('-created_at')
        
        # Calculate statistics
        total_orders = orders.count()
        total_revenue = orders.aggregate(Sum('total'))['total__sum'] or 0
        average_order_value = orders.aggregate(Avg('total'))['total__avg'] or 0
        
        # Status breakdown
        status_breakdown = {}
        for status_choice in Order.STATUS_CHOICES:
            count = orders.filter(status=status_choice[0]).count()
            status_breakdown[status_choice[0]] = {
                'label': status_choice[1],
                'count': count,
                'percentage': round((count / total_orders * 100) if total_orders > 0 else 0, 2)
            }
        
        # Top customers
        top_customers = orders.values('user__email', 'user__first_name', 'user_id').annotate(
            total_spent=Sum('total'),
            order_count=Count('id')
        ).order_by('-total_spent')[:5]
        
        # Top products
        top_products = OrderItem.objects.filter(
            order__created_at__gte=start_date
        ).values('product__name', 'product_id').annotate(
            total_quantity=Sum('quantity'),
            times_ordered=Count('id')
        ).order_by('-total_quantity')[:5]
        
        return Response({
            'period_days': days,
            'start_date': start_date,
            'statistics': {
                'total_orders': total_orders,
                'total_revenue': float(total_revenue),
                'average_order_value': float(average_order_value),
                'status_breakdown': status_breakdown,
            },
            'top_customers': list(top_customers),
            'top_products': list(top_products),
            'recent_orders': OrderListSerializer(orders[:10], many=True).data
        })
