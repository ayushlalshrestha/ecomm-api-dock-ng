# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging as log
from django.shortcuts import render
from django.db.models import Q

from rest_framework.filters import (SearchFilter, OrderingFilter, )
from rest_framework.generics import (CreateAPIView, DestroyAPIView, ListAPIView, UpdateAPIView,
                                     RetrieveAPIView, RetrieveUpdateAPIView)

from rest_framework.permissions import (AllowAny, IsAuthenticated, IsAdminUser,
                                        IsAuthenticatedOrReadOnly)

from rest_framework.authentication import SessionAuthentication

from .models import Product

from .permissions import IsOwner, IsOwnerOrReadOnly
from .serializers import (
    ProductCreateSerializer, ProductListSerializer, ProductDetailSerializer
)
from .pagination import ProductPageNumberPagination

from users.jwtauthenticator import TokenAuthentication

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


# Product CREATE API
@method_decorator(csrf_exempt, name='dispatch')
class ProductCreateAPIView(CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateSerializer
    permission_classes = [ IsAuthenticated, ]
    authentication_classes = [ TokenAuthentication, ]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Product LIST API
class ProductListAPIView(ListAPIView):
    permission_classes = [ AllowAny, ]
    serializer_class = ProductListSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'content', 'user__first_name']
    pagination_class = ProductPageNumberPagination  # PageNumberPagination

    def get_queryset(self, *args, **kwargs):
        #queryset_list = super(PostListAPIView, self).get_queryset(*args, **kwargs)

        # selfs_product = self.request.GET.get("selfs_product")
        # if not selfs_product:
        #     queryset_list = Product.objects.all().exclude(
        #         user=self.request.user)
        # else:
        #     queryset_list = Product.objects.all().filter(user=self.request.user)
        queryset_list = Product.objects.all()
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(title__icontains=query) |
                Q(content__icontains=query) |
                Q(user__first_name__icontains=query) |
                Q(user__last_name__icontains=query)
            ).distinct()
        return queryset_list


# Product DETAIL API
class ProductDetailAPIView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    # lookup_field = 'pk'
    # lookup_url_kwarg = "abc"


# Product UPDATE API
@method_decorator(csrf_exempt, name='dispatch')
class productUpdateAPIView(RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateSerializer
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'pk'
    authentication_classes = [TokenAuthentication]

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


"""
class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAdminUser,)

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
"""
