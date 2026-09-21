from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmailVerificationCode, PasswordResetCode


class UserAdmin(BaseUserAdmin):
    model = User
    list_display  = ['email', 'first_name', 'last_name', 'role', 'branch', 'user_type', 'is_verified', 'is_active', 'date_joined']
    list_filter   = ['role', 'branch', 'user_type', 'is_verified', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
    ordering      = ['-date_joined']

    fieldsets = (
        (None,  {'fields': ('email', 'password')}),
        ('Personal info',   {'fields': ('first_name', 'last_name', 'contact')}),
        ('Rigginie',    {'fields': ('role', 'branch', 'user_type', 'is_verified')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates',  {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )
admin.site.register(User, UserAdmin)
admin.site.register(EmailVerificationCode)
admin.site.register(PasswordResetCode)