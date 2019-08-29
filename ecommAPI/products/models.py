# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
from django.utils.safestring import mark_safe
from django.utils.text import slugify


class ProductManager(models.Manager):
    def active(self, *args, **kwargs):
        return super(ProductManager, self).filter(draft=False).filter(publish__lte=timezone.now())


class Product(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             default=1, on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    description = models.TextField()
    slug = models.SlugField(unique=True)
    tags = ArrayField(models.CharField(
        max_length=150, null=True, blank=True), null=True, blank=True)
    publish = models.DateField(auto_now=False, auto_now_add=False)

    objects = ProductManager()

    def __unicode__(self):
        return self.title

    def __str__(self):
        return str(self.title)

    def get_image_url(self):
        variation = self.variation_set.first()
        img = variation.variationimage_set.first()
        if img:
            return img.image.url
        return img

    # @property
    # def comments(self):
    #     instance = self
    #     qs = Comment.objects.filter_by_instance(instance)
    #     return qs

    # @property
    # def images(self):
    #     instance = self
    #     qs = Image.objects.filter_by_instance(instance)
    #     return qs


def create_slug(instance, new_slug=None):
    slug = slugify(instance.title)
    if new_slug is not None:
        slug = new_slug
    qs = Product.objects.filter(slug=slug).order_by("-id")
    exists = qs.exists()
    if exists:
        new_slug = "%s-%s" % (slug, qs.first().id)
        return create_slug(instance, new_slug=new_slug)
    return slug


# pre_save.connect(pre_save_post_receiver, sender=Product)
@receiver(pre_save, sender=Product)
def pre_save_post_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = create_slug(instance)


# ------------------------  Images ------------------------------------------

class Variation(models.Model):
    product = models.ForeignKey(
        Product, related_name='variations', on_delete=models.CASCADE)
    title = models.CharField(unique=True, max_length=120)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(decimal_places=2, max_digits=20, null=False)
    sale_price = models.DecimalField(
        decimal_places=2, max_digits=20, null=True, blank=True)
    available = models.BooleanField(default=True)
    inventory = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return str(self.title)

    def get_price(self):
        if self.sale_price is not None:
            return self.sale_price
        else:
            return self.price

    def get_title(self):
        return "%s - %s" % (self.product.title, self.title)


# post_save.connect(product_post_save, sender=Product)
# @receiver(pre_save, sender=Product)
def product_post_save(sender, instance, *args, **kwargs):
    product = instance
    variations = product.variation_set.all()
    if variations.count() == 0:
        new_var = Variation()
        new_var.product = product
        new_var.title = str(product.title) + " - default"
        new_var.save()


# ------------------------  Image Model --------------------------
def image_upload_to(instance, filename):
    title = instance.variation.title
    product_id = instance.variation.product.id
    slug = slugify(title)
    basename, file_extension = filename.split(".")
    new_filename = "{}-{}.{}".format(slug, instance.id, file_extension)
    return "products/{}/{}".format(product_id, new_filename)


class VariationImage(models.Model):
    variation = models.ForeignKey(
        Variation, related_name='variationimages', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=image_upload_to)

    def __str__(self):
        return self.variation.title

    def get_image_url(self):
        img = self
        if img:
            return img.image.url
        return img
