from django.urls import path

from .views import ProductClustersView, ProductRecommendationsView, SalesForecastView


urlpatterns = [
	path('clusters/', ProductClustersView.as_view(), name='ml-clusters'),
	path('forecast/', SalesForecastView.as_view(), name='ml-forecast'),
	path('recommendations/', ProductRecommendationsView.as_view(), name='ml-recommendations'),
]
