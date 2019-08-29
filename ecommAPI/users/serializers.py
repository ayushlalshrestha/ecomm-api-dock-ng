
from rest_framework.serializers import (
    HyperlinkedIdentityField,
    SerializerMethodField,
    ModelSerializer
)

from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'company',
            'bio',
            'location',
            'phone'
        ]


class UserSerializer(ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'profile'
        ]


class ProfileListSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'company'
        ]


class UserListSerializer(ModelSerializer):
    profile = ProfileListSerializer()

    class Meta:
        model = User
        fields = [
            'username',
            'profile'
        ]
