from rest_framework import serializers
from .models import City
from apps.states.serializers import StateListSerializer

class CityListSerializer(serializers.ModelSerializer):
    state_name = serializers.CharField(source='state.name', read_only=True)
    state_slug = serializers.CharField(source='state.slug', read_only=True)
    destinations_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = City
        fields = [
            'id', 'name', 'slug', 'state', 'state_name', 'state_slug',
            'description', 'image', 'is_popular', 'published',
            'latitude', 'longitude', 'destinations_count'
        ]

class CityDetailSerializer(serializers.ModelSerializer):
    state = StateListSerializer(read_only=True)
    destinations_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = City
        fields = '__all__'

