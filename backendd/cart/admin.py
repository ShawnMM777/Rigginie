from django.contrib import admin
from .models import Product, Cart, CartItem, ProductSpecs, Order, OrderItem

class ProductSpecsInline(admin.TabularInline):
    model = ProductSpecs
    extra = 2
    fields = ("hardware", "hardwarename",)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductSpecsInline]
    list_display  = ['name', 'category', 'price', 'stock', 'branches', 'is_active']
    list_filter   = ['category', 'branches', 'is_active']
    search_fields = ['name']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'item_count', 'total']


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'quantity', 'subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total', 'created_at']
    list_filter = ['status']


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'price']