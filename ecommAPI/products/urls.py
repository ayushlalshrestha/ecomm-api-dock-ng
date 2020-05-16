from .views import (
    ProductListAPIView, ProductCreateAPIView,
    ProductDetailAPIView,
    ProductUpdateAPIView
)
from django.conf.urls import url, include

urlpatterns = [
    url(r'^create/$', ProductCreateAPIView.as_view(), name='product_create'),
    url(r'^list/$', ProductListAPIView.as_view(), name='product_list'),
    url(r'^(?P<pk>(\d+))/$', ProductDetailAPIView.as_view(), name='product_detail'),
    url(r'^(?P<pk>(\d+))/update/$', ProductUpdateAPIView.as_view(), name='product_update'),
]
