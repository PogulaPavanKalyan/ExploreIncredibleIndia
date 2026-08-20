from rest_framework import serializers
from .models import Category, Activity, Tag

class CategorySerializer(serializers.ModelSerializer):
    destinations_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'category_type', 'icon', 'image', 'image_url', 'description', 'display_order', 'published', 'destinations_count']


class ActivitySerializer(serializers.ModelSerializer):
    destinations_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Activity
        fields = ['id', 'name', 'slug', 'icon', 'image', 'image_url', 'description', 'published', 'destinations_count']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


