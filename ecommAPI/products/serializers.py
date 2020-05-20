import logging as log
from rest_framework.serializers import (
    HyperlinkedIdentityField,
    SerializerMethodField,
    ModelSerializer
)

from django.contrib.auth import get_user_model
from .models import Product, Variation, VariationImage
from users.serializers import (
    ProfileSerializer,
    UserSerializer,
    UserListSerializer,
)

from drf_extra_fields.fields import Base64ImageField

User = get_user_model()


class VariationImageSerializer(ModelSerializer):
    image = Base64ImageField()

    class Meta:
        model = VariationImage
        fields = ["pk", "image"]

    def get_image(self, obj):
        try:
            image = obj.image.url
        except Exception:
            image = None
        return image

    def create(self, validated_data):
        image = validated_data.pop('image')
        variation = validated_data.pop('variation')
        return VariationImage.objects.create(image=image, variation=variation)


class VariationSerializer(ModelSerializer):
    variationimages = VariationImageSerializer(many=True, required=False)

    class Meta:
        model = Variation
        fields = [
            "pk",
            "title",
            "description",
            "price",
            "sale_price",
            "available",
            "variationimages"
        ]
        extra_kwargs = {
            "pk": {
                "read_only": False,
                "required": False
            },
            'title': {'validators': []},
        }


# Product CREATE/UPDATE serializer
class ProductCreateSerializer(ModelSerializer):
    variations = VariationSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = ["title", "description", "tags", "publish", "variations"]

    def create(self, validated_data):
        log.info("Product - Create action")
        variations_data = validated_data.pop("variations", [])
        product = Product.objects.create(**validated_data)
        for variation_data in variations_data:
            images_data = variation_data.pop("variationimages", [])
            variation = Variation.objects.create(
                product=product, **variation_data
            )
            for image in images_data:
                image_data = {'variation': variation, 'image': image.get('image')}
                # serializer = VariationImageSerializer(data=image_data)
                # result = serializer.is_valid()
                #     serializer.save()
                VariationImage.objects.create(**image_data)

        return product

    def update(self, instance, validated_data):
        log.warning(f"Ayush Ayush - Edit action - {instance}")
        variations = validated_data.pop("variations", [])
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.tags = validated_data.get('tags', instance.tags)
        instance.save()
        keep_variations = []
        for variation in variations:
            # log.warning(variation)
            keep_images = []
            variation['product'] = instance
            variation_images = variation.pop("images", [])
            if "pk" in variation.keys():
                if Variation.objects.filter(id=variation["pk"]).exists():
                    v = Variation.objects.get(id=variation["pk"])
                    v.title = variation.get('title', v.title)
                    v.description = variation.get('v', v.description)
                    v.price = variation.get('price', v.price)
                    v.sale_price = variation.get('sale_price', v.sale_price)
                    v.save()
                    keep_variations.append(v.id)
                else:
                    continue
            else:
                images_data = variation.pop("variationimages", [])
                variation = Variation.objects.create(**variation)
                for image in images_data:
                    image_data = {'variation': variation, 'image': image.get('image')}
                    VariationImage.objects.create(**image_data)
                keep_variations.append(v.id)
        # for variation in instance.variation_set.all():
        #     if variation.id not in keep_variations:
        #         variation.delete()

        return instance


# Product LIST serializer
class ProductListSerializer(ModelSerializer):
    variations = VariationSerializer(many=True, required=False)
    user = UserListSerializer()

    class Meta:
        model = Product
        fields = ["pk", "title", "description", "tags", "variations", "user"]


# Product DETAIL serializer
class ProductDetailSerializer(ModelSerializer):
    variations = VariationSerializer(many=True, required=False)
    user = UserSerializer()

    class Meta:
        model = Product
        fields = [
            "pk",
            "title",
            "description",
            "slug",
            "tags",
            "user",
            "variations",
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
