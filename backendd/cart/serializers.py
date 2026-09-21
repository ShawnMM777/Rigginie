from rest_framework import serializers
from .models import Product, Cart, CartItem, PointsUser, UserPoints, ProductSpecs


class ProductSpecsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecs
        fields = ['hardware', 'hardwarename']


class ProductSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    recommended_for_display = serializers.CharField(source='get_recommended_for_display', read_only=True)
    specifications = ProductSpecsSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_status(self, obj):
        if not obj.is_active:
            return 'unavailable'
        if obj.stock == 0:
            return 'out_of_stock'
        if obj.stock <= 5:
            return 'low_stock'
        return 'in_stock'

class CartItemSerializer(serializers.ModelSerializer):
    product  = ProductSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    class Meta:
        model  = CartItem
        fields = ['id', 'product', 'quantity', 'subtotal']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    class Meta:
        model  = Cart
        fields = ['id', 'items', 'total', 'item_count']

class PointsTranscationSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True, default=None)
    class Meta:
        model = PointsUser
        fields = ['id', 'user', 'cart', 'product', 'points_earned', 'created_at']

class UserPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPoints
        fields = ['points']