
import logging as log
from rest_framework.serializers import (
    HyperlinkedIdentityField,
    SerializerMethodField,
    ModelSerializer
)

from django.contrib.auth import get_user_model
from .models import Product, Variation, VariationImage
from users.serializers import ProfileSerializer

User = get_user_model()


class VariationImageSerializer(ModelSerializer):
    class Meta:
        model = VariationImage
        fields = [
            'image'
        ]

    def get_image(self, obj):
        try:
            image = obj.image.url
        except:
            image = None
        return image
    
    def get_name(self, obj):
        return "Snoie shrestha"


class VariationSerializer(ModelSerializer):
    images = VariationImageSerializer(many=True, required=False)

    class Meta:
        model = Variation
        fields = [
            'title',
            'description',
            'price',
            'sale_price',
            'available',
            'images'
        ]

# Product CREATE/UPDATE serializer
class ProductCreateSerializer(ModelSerializer):
    variations = VariationSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            'title',
            'description',
            'tags',
            'publish',
            'variations'
        ]

    # def to_internal_value(self, data):
    #     ret = super().to_internal_value(data)
    #     if ret.get('tags'):
    #         ret['tags'] = ret['tags'][0].split(",")

    #     return ret

    def create(self, validated_data):
        variations_data = validated_data.pop('variations')
        product = Product.objects.create(**validated_data)
        for variation_data in variations_data:
            images_data = variation_data.pop('images', [])
            variation = Variation.objects.create(
                product=product, **variation_data)
            for image_data in images_data:
                VariationImage.objects.create(
                    variation=variation, **image_data)

        return product


"""
    def update(self, instance, validated_data):
        choices = validated_data.pop('choices')
        instance.title = validated_data.get("title", instance.title)
        instance.save()
        keep_choices = []
        for choice in choices:
            if "id" in choice.keys():
                if Choice.objects.filter(id=choice["id"]).exists():
                    c = Choice.objects.get(id=choice["id"])
                    c.text = choice.get('text', c.text)
                    c.save()
                    keep_choices.append(c.id)
                else:
                    continue
            else:
                c = Choice.objects.create(**choice, question=instance)
                keep_choices.append(c.id)

        for choice in instance.choices:
            if choice.id not in keep_choices:
                choice.delete()

        return instance
"""

# Product LIST serializer


class ProductListSerializer(ModelSerializer):
    variations = VariationSerializer(many=True)
    user = ProfileSerializer()

    class Meta:
        model = Product
        fields = [
            'pk',
            'title',
            'user',
            'tags',
            'variations'
        ]


# Product DETAIL serializer
class ProductDetailSerializer(ModelSerializer):
    variations = VariationSerializer(many=True, required=False)
    user = ProfileSerializer()

    class Meta:
        model = Product
        fields = [
            'pk',
            'title',
            'description',
            'slug',
            'tags',
            'user',
            'variations'
        ]

    # def get_html(self, obj):
    #     return obj.get_markdown()


"""
# create() and/or update() methods in order to explicitly specify
# how the child relationships should be saved.

class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['order', 'title', 'duration']

class AlbumSerializer(serializers.ModelSerializer):
    tracks = TrackSerializer(many=True)

    class Meta:
        model = Album
        fields = ['album_name', 'artist', 'tracks']

    def create(self, validated_data):
        tracks_data = validated_data.pop('tracks', [])
        album = Album.objects.create(**validated_data)
        for track_data in tracks_data:
            image_data = track_data.pop('track_images', [])
            track =  Track.objects.create(album=album, **track_data)
            for track_image in track_images:
                TrackImage.objects.create(track=track, **image_data)

        return album

# dummy data
 data = {
    'album_name': 'The Grey Album',
    'artist': 'Danger Mouse',
    'tracks': [
        {'order': 1, 'title': 'Public Service Announcement', 'duration': 245},
        {'order': 2, 'title': 'What More Can I Say', 'duration': 264},
        {'order': 3, 'title': 'Encore', 'duration': 159},
    ],
}
>>> serializer = AlbumSerializer(data=data)
>>> serializer.is_valid()
>>> serializer.save()
"""
