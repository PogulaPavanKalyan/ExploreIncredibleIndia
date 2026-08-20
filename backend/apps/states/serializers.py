from rest_framework import serializers
from .models import State, District

class DistrictSerializer(serializers.ModelSerializer):
    state_name = serializers.CharField(source='state.name', read_only=True)
    state_slug = serializers.CharField(source='state.slug', read_only=True)
    destinations_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = District
        fields = [
            'id', 'name', 'slug', 'state', 'state_name', 'state_slug',
            'headquarters', 'description', 'latitude', 'longitude',
            'published', 'destinations_count'
        ]


class StateListSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='region.name', read_only=True)
    region_slug = serializers.CharField(source='region.slug', read_only=True)
    destinations_count = serializers.IntegerField(read_only=True, default=0)
    cities_count = serializers.IntegerField(read_only=True, default=0)
    districts_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = State
        fields = [
            'id', 'name', 'slug', 'code', 'region', 'region_name', 'region_slug',
            'is_union_territory', 'capital', 'short_description', 'description',
            'image', 'banner_image', 'thumbnail_image', 'latitude', 'longitude',
            'published', 'featured', 'destinations_count', 'cities_count', 'districts_count'
        ]


class StateDetailSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='region.name', read_only=True)
    region_slug = serializers.CharField(source='region.slug', read_only=True)
    destinations_count = serializers.IntegerField(read_only=True, default=0)
    cities_count = serializers.IntegerField(read_only=True, default=0)
    districts_count = serializers.IntegerField(read_only=True, default=0)
    districts = DistrictSerializer(many=True, read_only=True)

    class Meta:
        model = State
        fields = '__all__'


