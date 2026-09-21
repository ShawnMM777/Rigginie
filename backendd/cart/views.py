from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status, permissions, generics
from django.db.models import Q, Sum
from django.db import transaction
import secrets

from .models import Product, Cart, CartItem, PointsUser, ProductSpecs, Order, OrderItem
from databaseusers.permissions import IsAdminRole
from .serializers import ProductSerializer, CartSerializer, PointsTranscationSerializer, UserPointsSerializer, ProductSpecsSerializer
def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        address = str(request.data.get('shipping_address', '')).strip()
        contact = str(request.data.get('contact_number', '')).strip()
        payment_method = str(request.data.get('payment_method', '')).strip()
        if not address or not contact or not payment_method:
            return Response({'error': 'Address, contact number, and payment method are required.'}, status=400)
        if len(contact) < 7 or len(contact) > 15:
            return Response({'error': 'Enter a valid contact number.'}, status=400)

        cart = get_or_create_cart(request.user)
        items = list(cart.items.select_related('product'))
        if not items:
            return Response({'error': 'Your cart is empty.'}, status=400)
        if any(item.product.stock < item.quantity for item in items):
            return Response({'error': 'One or more products no longer have enough stock.'}, status=400)

        purchase_number = f'RG-{secrets.token_hex(6).upper()}'
        order = Order.objects.create(
            user=request.user,
            purchase_number=purchase_number,
            shipping_address=address,
            contact_number=contact,
            payment_method=payment_method,
            status='paid',
            total=sum(item.subtotal for item in items),
        )
        for item in items:
            OrderItem.objects.create(order=order, product=item.product, product_name=item.product.name, quantity=item.quantity, price=item.product.price)
            item.product.stock -= item.quantity
            item.product.save(update_fields=['stock'])
        cart.items.all().delete()
        return Response({
            'purchase_number': purchase_number,
            'order_id': order.id,
            'total': str(order.total),
            'status': order.status,
        }, status=201)


class AdminOrderListView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        status_filter = request.query_params.get('status')
        orders = Order.objects.select_related('user').prefetch_related('items').order_by('-created_at')
        if status_filter in {'pending', 'paid', 'cancelled'}:
            orders = orders.filter(status=status_filter)

        return Response([
            {
                'id': order.id,
                'purchase_number': order.purchase_number,
                'customer': order.user.email if order.user else 'Deleted user',
                'payment_method': order.payment_method,
                'status': order.status,
                'total': str(order.total),
                'shipping_address': order.shipping_address,
                'contact_number': order.contact_number,
                'items': [
                    {
                        'name': item.product_name,
                        'quantity': item.quantity,
                        'price': str(item.price),
                    }
                    for item in order.items.all()
                ],
                'created_at': order.created_at,
            }
            for order in orders
        ])


class AdminProductListView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        products = Product.objects.all().order_by('-created_at')
        return Response([
            {
                'id': product.id,
                'name': product.name,
                'category': product.get_category_display(),
                'price': str(product.price),
                'stock': product.stock,
                'branches': product.branches or 'All branches',
                'is_active': product.is_active,
                'created_at': product.created_at,
            }
            for product in products
        ])


class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get('category')
        search = request.query_params.get('search', '').strip()
        products = Product.objects.filter(is_active=True, stock__gt=0)
        if category:
            products = products.filter(category=category)
        if search:
            products = products.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(brand__icontains=search)
                | Q(subbrand__icontains=search)
                | Q(gpu__icontains=search)
                | Q(cpu__icontains=search)
            )
        return Response(
            ProductSerializer(products, many=True, context={'request': request}).data
        )


class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        product = Product.objects.filter(pk=pk, is_active=True).first()
        if not product:
            return Response({'error': 'Product not found.'}, status=404)
        return Response(ProductSerializer(product, context={'request': request}).data)


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = get_or_create_cart(request.user)
        return Response(CartSerializer(cart).data)

    def delete(self, request):
        cart = get_or_create_cart(request.user)
        cart.items.all().delete()
        return Response({'message': 'Cart cleared.'})


class CartAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity   = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({'error': 'product_id is required.'}, status=400)

        product = Product.objects.filter(pk=product_id, is_active=True).first()
        if not product:
            return Response({'error': 'Product not found.'}, status=404)

        if product.stock < quantity:
            return Response({'error': 'Not enough stock.'}, status=400)

        cart = get_or_create_cart(request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()

        return Response(CartSerializer(cart).data, status=201)


class CartItemUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, item_id):
        quantity = int(request.data.get('quantity', 1))
        cart     = get_or_create_cart(request.user)
        item     = CartItem.objects.filter(pk=item_id, cart=cart).first()

        if not item:
            return Response({'error': 'Item not found.'}, status=404)

        if quantity <= 0:
            item.delete()
            return Response(CartSerializer(cart).data)

        if item.product.stock < quantity:
            return Response({'error': 'Not enough stock.'}, status=400)

        item.quantity = quantity
        item.save()
        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request.user)
        item = CartItem.objects.filter(pk=item_id, cart=cart).first()
        if not item:
            return Response({'error': 'Item not found.'}, status=404)
        item.delete()
        return Response(CartSerializer(cart).data)

class UserPointsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total = PointsUser.objects.filter(user=request.user).aggregate(
            total=Sum('points_earned')
        )['total'] or 0
        return Response({'points': total})


class PointsHistoryListView(generics.ListAPIView):
    serializer_class = UserPointsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PointsUser.objects.filter(user=self.request.user).order_by('-created_at')

class ProductSpecsViewSet(APIView):
    queryset = ProductSpecs.objects.all()
    serializer_class = ProductSpecsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        product_id = self.request.query_params.get('product')
        return qs.filter(product_id=product_id) if product_id else qs