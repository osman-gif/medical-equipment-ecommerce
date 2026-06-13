"""Admin interface configuration for viewing and managing orders."""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Sum, Count
from django.utils.dateformat import format as format_date
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    """Shows order items inline inside the order admin page."""

    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price_at_order']
    can_delete = False
    fields = ['product', 'quantity', 'price_at_order']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Custom admin view for tracking, filtering, and reviewing orders."""

    list_display = ['order_id', 'customer_info', 'status_badge', 'total', 'order_date', 'days_ago']
    list_filter = ['status', 'created_at', 'user']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'id']
    readonly_fields = ['id', 'created_at', 'updated_at', 'total', 'order_summary']
    inlines = [OrderItemInline]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    def get_fieldsets(self, request, obj=None):
        """Return different admin fields for create and edit forms."""

        if obj:  # Editing existing order
            return (
                ('Order Information', {
                    'fields': ('id', 'created_at', 'updated_at', 'order_summary')
                }),
                ('Customer Details', {
                    'fields': ('user', 'address')
                }),
                ('Order Status & Total', {
                    'fields': ('status', 'total')
                }),
                ('Additional Notes', {
                    'fields': ('notes',)
                }),
            )
        else:  # Creating new order
            return (
                ('Customer Details', {
                    'fields': ('user', 'address')
                }),
                ('Order Status & Total', {
                    'fields': ('status', 'total')
                }),
                ('Additional Notes', {
                    'fields': ('notes',)
                }),
            )
    
    def order_id(self, obj):
        """Display a friendly order number in the admin list."""

        return f"#{obj.id}"
    order_id.short_description = "Order ID"
    
    def customer_info(self, obj):
        """Show the customer name and email in a compact format."""

        return f"{obj.user.first_name or obj.user.username} ({obj.user.email})"
    customer_info.short_description = "Customer"
    
    def status_badge(self, obj):
        """Render the current order status as a colored badge."""

        status_colors = {
            'pending': '#FFA500',
            'processing': '#1E90FF',
            'shipped': '#4169E1',
            'delivered': '#228B22',
            'cancelled': '#DC143C',
        }
        color = status_colors.get(obj.status, '#808080')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 5px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = "Status"
    
    def order_date(self, obj):
        """Format the order creation timestamp for display."""

        return format_date(obj.created_at, 'M d, Y g:i A')
    order_date.short_description = "Order Date"
    
    def days_ago(self, obj):
        """Show how recently the order was created."""

        from django.utils import timezone
        from datetime import timedelta
        delta = timezone.now() - obj.created_at
        if delta.days == 0:
            return "Today"
        elif delta.days == 1:
            return "Yesterday"
        else:
            return f"{delta.days} days ago"
    days_ago.short_description = "When"
    
    def order_summary(self, obj):
        """Display the items included in the order in the admin form."""

        items = obj.items.all()
        items_html = "<ul style='list-style-type: none; padding: 0;'>"
        for item in items:
            items_html += f"<li>{item.product.name} × {item.quantity} @ ${item.price_at_order}</li>"
        items_html += "</ul>"
        return format_html(
            "<strong>Items ({}):</strong>{}<br><strong>Total: ${}</strong>",
            items.count(),
            items_html,
            obj.total
        )
    order_summary.short_description = "Order Summary"
    
    def get_readonly_fields(self, request, obj=None):
        """Keep key order fields read-only once the order already exists."""

        if obj:  # Editing an existing object
            return self.readonly_fields + ['user', 'address', 'status']
        return self.readonly_fields
