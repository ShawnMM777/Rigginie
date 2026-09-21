from django.urls import path

from .merchant_views import (
    MerchantProductDetailView,
    MerchantProductListCreateView,
    MerchantSalesView,
)

urlpatterns = [
    path('products/', MerchantProductListCreateView.as_view()),
    path('products/<int:pk>/', MerchantProductDetailView.as_view()),
    path('sales/', MerchantSalesView.as_view()),
]
