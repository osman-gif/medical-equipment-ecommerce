from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import User, Address
from .serializers import (
    UserSerializer, UserRegisterSerializer, UserLoginSerializer,
    UserDetailSerializer, AddressSerializer
)


class UserViewSet(viewsets.ViewSet):
    """User authentication and profile management"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new user"""
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """User login"""
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')
            
            try:
                user = User.objects.get(email=email)
                user_authenticated = authenticate(username=user.username, password=password)
                
                if user_authenticated:
                    refresh = RefreshToken.for_user(user_authenticated)
                    return Response({
                        'user': UserSerializer(user_authenticated).data,
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    }, status=status.HTTP_200_OK)
                else:
                    return Response(
                        {'error': 'Invalid credentials'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            except User.DoesNotExist:
                return Response(
                    {'error': 'User not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """Get current user profile"""
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """Update user profile"""
        user = request.user
        serializer = UserDetailSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressViewSet(viewsets.ModelViewSet):
    """Manage user addresses"""
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def set_default(self, request):
        """Set an address as default"""
        address_id = request.data.get('address_id')
        try:
            address = Address.objects.get(id=address_id, user=request.user)
            Address.objects.filter(user=request.user).update(is_default=False)
            address.is_default = True
            address.save()
            return Response({'message': 'Default address updated'}, status=status.HTTP_200_OK)
        except Address.DoesNotExist:
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)
