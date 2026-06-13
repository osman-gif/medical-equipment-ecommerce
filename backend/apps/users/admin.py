"""Documentation for backend/apps/users/admin.py."""

from django.contrib import admin
from .models import User, Address

admin.site.register(User)
admin.site.register(Address)
