from rest_framework import serializers
from .models import State

class StateListSerializer(serializers.ModelSerializer):
    destinations_count = serializers.IntegerField(read_only=True, default=0)
    cities_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = State
        fields = [
            'id', 'name', 'slug', 'code', 'is_union_territory', 'capital',
            'short_description', 'description', 'image', 'banner_image', 'thumbnail_image',
            'latitude', 'longitude', 'published', 'featured', 'destinations_count', 'cities_count'
        ]

class StateDetailSerializer(serializers.ModelSerializer):
    destinations_count = serializers.IntegerField(read_only=True, default=0)
    cities_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = State
        fields = '__all__'

