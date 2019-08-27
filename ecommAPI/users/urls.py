
from .views import (login, logout, session_details, ProfileListAPIView)
from .jwtauthenticator import (
    UserLoginViewJwt, get_session_details, TokenAuthentication)
from django.conf.urls import url, include

from rest_framework_jwt.views import (
    obtain_jwt_token, verify_jwt_token, refresh_jwt_token)

import logging as log

urlpatterns = [
    url(r'^profiles/$', ProfileListAPIView.as_view(), name='profile_list'),

    # APIs for the jwt-token login and session
    url(r'^api-token-refresh', refresh_jwt_token),
    url(r'^api-token-verify', verify_jwt_token),
    url(r'^api-token-login', UserLoginViewJwt.as_view()),
    url(r'^sessionDetails/', get_session_details, name='checksessiondetails'),
    
    # Old session implementation, deprecated
    # url(r'^login/', login, name='login_view'),
    # url(r'^logout/', logout, name='logout_view'),
]
