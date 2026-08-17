from rest_framework import serializers
from .models import TravelGuide, LocalGuide

class TravelGuideSerializer(serializers.ModelSerializer):
    state_name = serializers.CharField(source='state.name', read_only=True, default='')
    city_name = serializers.CharField(source='city.name', read_only=True, default='')

    class Meta:
        model = TravelGuide
        fields = ['id', 'title', 'slug', 'state', 'state_name', 'city', 'city_name', 'destination', 'content', 'author', 'featured_image', 'is_published', 'published_at']


class LocalGuideSerializer(serializers.ModelSerializer):
    state_name = serializers.CharField(source='state.name', read_only=True, default='')
    city_name = serializers.CharField(source='city.name', read_only=True, default='')
    destination_name = serializers.CharField(source='destination.name', read_only=True, default='')

    class Meta:
        model = LocalGuide
        fields = [
            'id', 'name', 'slug', 'photo', 'bio', 'state', 'state_name',
            'city', 'city_name', 'destination', 'destination_name',
            'languages_spoken', 'experience_years', 'rating', 'price_per_day',
            'contact_phone', 'is_verified', 'created_at'
        ]

