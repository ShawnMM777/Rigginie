from datetime import timedelta
from decimal import Decimal

from django.db.models import F, Q, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from databaseusers.permissions import IsMerchantRole

from .models import OrderItem, Product
from .serializers import ProductSerializer


def products_for_merchant(user):
    qs = Product.objects.all()
    branch = getattr(user, 'branch', '') or ''
    if branch and branch != 'ALL':
        qs = qs.filter(Q(branches=branch) | Q(branches='ALL') | Q(branches=''))
    return qs


def branch_payload(user):
    branch = getattr(user, 'branch', '') or ''
    labels = dict(Product.BRANCHES)
    return {
        'branch': branch,
        'branch_label': labels.get(branch, 'All branches') if branch else 'All branches',
    }


class MerchantProductListCreateView(APIView):
    permission_classes = [IsMerchantRole]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        products = products_for_merchant(request.user).order_by('-created_at')
        return Response(ProductSerializer(products, many=True, context={'request': request}).data)

    def post(self, request):
        data = request.data.copy()
        branch = getattr(request.user, 'branch', '') or ''
        if branch and branch != 'ALL' and not data.get('branches'):
            data['branches'] = branch
        serializer = ProductSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MerchantProductDetailView(APIView):
    permission_classes = [IsMerchantRole]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self, request, pk):
        return products_for_merchant(request.user).filter(pk=pk).first()

    def put(self, request, pk):
        product = self.get_object(request, pk)
        if not product:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(
            product, data=request.data, partial=True, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        product = self.get_object(request, pk)
        if not product:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response({'message': 'Product removed.'})


class MerchantSalesView(APIView):
    permission_classes = [IsMerchantRole]

    def get(self, request):
        try:
            days = max(1, min(int(request.query_params.get('days', 30)), 365))
        except (TypeError, ValueError):
            days = 30

        since = timezone.now() - timedelta(days=days)
        products = products_for_merchant(request.user)
        product_ids = list(products.values_list('id', flat=True))

        items = OrderItem.objects.filter(
            order__created_at__gte=since,
            order__status='paid',
            product_id__in=product_ids,
        ) if product_ids else OrderItem.objects.none()

        totals = items.aggregate(
            units_sold=Sum('quantity'),
            revenue=Sum(F('price') * F('quantity')),
        )
        units_sold = totals['units_sold'] or 0
        revenue = totals['revenue'] or Decimal('0')

        daily_rows = (
            items.annotate(day=TruncDate('order__created_at'))
            .values('day')
            .annotate(
                units=Sum('quantity'),
                revenue=Sum(F('price') * F('quantity')),
            )
            .order_by('day')
        )
        day_map = {row['day']: row for row in daily_rows}
        today = timezone.localdate()
        sales_by_day = []
        for offset in range(days - 1, -1, -1):
            day = today - timedelta(days=offset)
            row = day_map.get(day)
            sales_by_day.append({
                'date': day.isoformat(),
                'units': (row['units'] if row else 0) or 0,
                'revenue': float(row['revenue'] if row else 0) or 0,
            })

        top_rows = (
            items.values('product_id', 'product_name')
            .annotate(
                units=Sum('quantity'),
                revenue=Sum(F('price') * F('quantity')),
            )
            .order_by('-units')[:8]
        )
        top_products = [
            {
                'id': row['product_id'],
                'name': row['product_name'],
                'units': row['units'] or 0,
                'revenue': float(row['revenue'] or 0),
            }
            for row in top_rows
        ]

        sold_lookup = {
            row['product_id']: row
            for row in items.values('product_id').annotate(
                units=Sum('quantity'),
                revenue=Sum(F('price') * F('quantity')),
            )
        }

        inventory = []
        sold_out_products = []
        for product in products.order_by('name'):
            sales = sold_lookup.get(product.id) or {}
            entry = {
                'id': product.id,
                'name': product.name,
                'category': product.category,
                'price': float(product.price),
                'stock': product.stock,
                'is_active': product.is_active,
                'status': (
                    'unavailable' if not product.is_active
                    else 'sold_out' if product.stock == 0
                    else 'low_stock' if product.stock <= 5
                    else 'in_stock'
                ),
                'units_sold': sales.get('units') or 0,
                'revenue': float(sales.get('revenue') or 0),
            }
            inventory.append(entry)
            if product.stock == 0:
                sold_out_products.append(entry)

        payload = branch_payload(request.user)
        payload.update({
            'days': days,
            'product_count': products.count(),
            'active_products': products.filter(is_active=True).count(),
            'in_stock': products.filter(is_active=True, stock__gt=0).count(),
            'low_stock': products.filter(is_active=True, stock__gt=0, stock__lte=5).count(),
            'sold_out_count': products.filter(stock=0).count(),
            'units_sold': units_sold,
            'revenue': float(revenue),
            'sales_by_day': sales_by_day,
            'top_products': top_products,
            'sold_out_products': sold_out_products,
            'products': inventory,
        })
        return Response(payload)
