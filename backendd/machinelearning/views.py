from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from cart.models import Product
from databaseusers.permissions import IsMerchantRole
from .clustering import cluster_products
from .prediction import forecast_sales, recommend_products


class ProductClustersView(APIView):
	permission_classes = [IsMerchantRole]
	def get(self, request):
		try:
			cluster_count = max(1, int(request.query_params.get('clusters', 3)))
		except (TypeError, ValueError):
			cluster_count = 3
		products = Product.objects.filter(is_active=True, stock__gt=0).order_by('id')
		return Response({'clusters': cluster_products(products, cluster_count), 'cluster_count': min(cluster_count, products.count())})


class SalesForecastView(APIView):
	permission_classes = [IsMerchantRole]

	def get(self, request):
		try:
			days = max(1, min(int(request.query_params.get('days', 7)), 90))
		except (TypeError, ValueError):
			days = 7
		result = forecast_sales(days)
		result['days'] = days
		return Response(result)


class ProductRecommendationsView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request):
		try:
			limit = max(1, min(int(request.query_params.get('limit', 8)), 20))
		except (TypeError, ValueError):
			limit = 8
		result = recommend_products(request.user, limit)
		result['limit'] = limit
		return Response(result)
