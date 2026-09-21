from django.urls import include, path
from .views import ( ProductListView, ProductDetailView, CartView, CartAddView, CartItemUpdateView, UserPointsView, PointsHistoryListView, ProductSpecsViewSet, CreateOrderView, AdminOrderListView, AdminProductListView)

urlpatterns = [
    path('products/',              ProductListView.as_view()),
    path('products/<int:pk>/',     ProductDetailView.as_view()),
    path('cart/',                  CartView.as_view()),
    path('cart/add/',              CartAddView.as_view()),
    path('cart/items/<int:item_id>/', CartItemUpdateView.as_view()),
    path('orders/create/', CreateOrderView.as_view()),
    path('staff/orders/', AdminOrderListView.as_view()),
    path('staff/products/', AdminProductListView.as_view()),
    path ('points/', UserPointsView.as_view(), name='user-points'),
    path ('pointsuser/', PointsHistoryListView.as_view(), name='points-history'),
    path ('pcspec/', ProductSpecsViewSet.as_view()),
    path('merchant/', include('cart.merchant_urls')),
]
