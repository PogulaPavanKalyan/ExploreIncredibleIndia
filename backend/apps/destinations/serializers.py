from rest_framework import serializers
from .models import Destination, DestinationImage, DestinationVideo, Attraction, TravelTip, RecentlyViewed, HeroDestination
from apps.states.serializers import StateListSerializer
from apps.cities.serializers import CityListSerializer
from apps.categories.serializers import CategorySerializer
from apps.states.models import State
from apps.cities.models import City
from apps.categories.models import Category

class DestinationImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = DestinationImage
        fields = ['id', 'image', 'caption', 'alt_text', 'is_primary', 'display_order', 'created_at']

    def get_image(self, obj):
        if not obj.image:
            return ""
        val = str(obj.image)
        if val.startswith('http'):
            return val
        try:
            return obj.image.url
        except Exception:
            return ""

class DestinationVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationVideo
        fields = ['id', 'title', 'video_url', 'thumbnail', 'description', 'display_order', 'published', 'created_at']

class AttractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attraction
        fields = [
            'id', 'name', 'slug', 'description', 'category', 'latitude', 'longitude',
            'image', 'opening_time', 'closing_time', 'ticket_price', 'published', 'created_at', 'updated_at'
        ]

class TravelTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelTip
        fields = ['id', 'title', 'description', 'display_order', 'published', 'created_at', 'updated_at']

class MinimalStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'name', 'slug']

class MinimalCitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'slug']

class MinimalCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon']

class DestinationListSerializer(serializers.ModelSerializer):
    state = MinimalStateSerializer(read_only=True)
    city = MinimalCitySerializer(read_only=True)
    categories = MinimalCategorySerializer(many=True, read_only=True)
    images = DestinationImageSerializer(many=True, read_only=True)
    state_name = serializers.CharField(source='state.name', read_only=True)
    state_slug = serializers.CharField(source='state.slug', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True, default='')
    city_slug = serializers.CharField(source='city.slug', read_only=True, default='')
    category_name = serializers.SerializerMethodField()
    category_slug = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'slug', 'short_description', 'main_image', 'images',
            'state', 'state_name', 'state_slug',
            'city', 'city_name', 'city_slug',
            'categories', 'category_name', 'category_slug',
            'best_time_to_visit', 'ticket_price', 'recommended_duration',
            'latitude', 'longitude', 'featured', 'trending', 'published',
            'budget_level', 'travel_style', 'avg_rating', 'total_reviews'
        ]

    def get_category_name(self, obj):
        first_cat = obj.categories.first()
        return first_cat.name if first_cat else ''

    def get_category_slug(self, obj):
        first_cat = obj.categories.first()
        return first_cat.slug if first_cat else ''

    def get_main_image(self, obj):
        if not obj.main_image:
            return ""
        # If it's stored as an external URL, return it directly
        val = str(obj.main_image)
        if val.startswith('http'):
            return val
        # Otherwise, let Django handle the media URL prefix
        try:
            return obj.main_image.url
        except Exception:
            return ""

class DestinationDetailSerializer(serializers.ModelSerializer):
    state = MinimalStateSerializer(read_only=True)
    city = MinimalCitySerializer(read_only=True)
    categories = MinimalCategorySerializer(many=True, read_only=True)
    images = DestinationImageSerializer(many=True, read_only=True)
    videos = DestinationVideoSerializer(many=True, read_only=True)
    attractions = AttractionSerializer(many=True, read_only=True)
    travel_tips = TravelTipSerializer(many=True, read_only=True)

    # Writable primary key fields for Admin CRUD API
    state_id = serializers.PrimaryKeyRelatedField(
        queryset=State.objects.all(), source='state', write_only=True
    )
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='city', write_only=True, required=False, allow_null=True
    )
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='categories', many=True, write_only=True, required=False
    )
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = '__all__'

    def get_main_image(self, obj):
        if not obj.main_image:
            return ""
        val = str(obj.main_image)
        if val.startswith('http'):
            return val
        try:
            return obj.main_image.url
        except Exception:
            return ""

class RecentlyViewedSerializer(serializers.ModelSerializer):
    destination = DestinationListSerializer(read_only=True)

    class Meta:
        model = RecentlyViewed
        fields = ['id', 'destination', 'viewed_at']

class HeroDestinationSerializer(serializers.ModelSerializer):
    destination_slug = serializers.CharField(source='destination.slug', read_only=True)
    poster_image = serializers.SerializerMethodField()
    
    class Meta:
        model = HeroDestination
        fields = [
            'id', 'destination', 'destination_slug', 'destination_name', 'region', 'state_name',
            'title', 'subtitle', 'description', 'youtube_video_id', 'desktop_video', 
            'mobile_video', 'poster_image', 'transition_type', 'display_duration'
        ]

    def get_poster_image(self, obj):
        if not obj.poster_image:
            return ""
        val = str(obj.poster_image)
        if val.startswith('http'):
            return val
        try:
            return obj.poster_image.url
        except Exception:
            return ""

