from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    destinations_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'image', 'description', 'published', 'destinations_count']

