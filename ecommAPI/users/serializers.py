
from rest_framework.serializers import (
    HyperlinkedIdentityField, 
    SerializerMethodField,
    ModelSerializer
)

from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
        ]


class ProfileSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'company',
            'bio',
            'location',
            'email',
            'phone',
            'user'
        ]
