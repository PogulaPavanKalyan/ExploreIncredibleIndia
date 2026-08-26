from rest_framework import serializers
from .models import (
    Destination, DestinationImage, DestinationVideo, DestinationHistory, 
    DestinationSource, Attraction, TravelTip, RecentlyViewed, HeroDestination,
    TravelCollection
)
from apps.states.models import State
from apps.cities.models import City
from apps.categories.models import Category

class DestinationImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = DestinationImage
        fields = ['id', 'image', 'image_url', 'caption', 'alt_text', 'is_primary', 'display_order', 'created_at']

    def get_image(self, obj):
        if obj.image_url:
            return obj.image_url
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
    video_type_display = serializers.CharField(source='get_video_type_display', read_only=True)

    class Meta:
        model = DestinationVideo
        fields = [
            'id', 'title', 'video_url', 'thumbnail_url', 'thumbnail', 
            'duration', 'source', 'source_url', 'video_type', 
            'video_type_display', 'description', 'is_primary', 
            'display_order', 'published', 'created_at'
        ]

class DestinationHistorySerializer(serializers.ModelSerializer):
    verification_status_display = serializers.CharField(source='get_verification_status_display', read_only=True)

    class Meta:
        model = DestinationHistory
        fields = [
            'id', 'short_history', 'detailed_history', 'ancient_history', 
            'medieval_history', 'modern_history', 'architecture', 
            'cultural_significance', 'religious_significance', 
            'historical_events', 'important_dates', 'source_name', 
            'source_url', 'verification_status', 'verification_status_display', 
            'last_verified_at', 'updated_at'
        ]

class DestinationSourceSerializer(serializers.ModelSerializer):
    source_type_display = serializers.CharField(source='get_source_type_display', read_only=True)

    class Meta:
        model = DestinationSource
        fields = ['id', 'source_name', 'source_type', 'source_type_display', 'source_url', 'license_info', 'is_verified', 'created_at']

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
        fields = ['id', 'name', 'slug', 'code', 'is_union_territory']

class MinimalCitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'slug']

class MinimalCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon']

class MinimalActivitySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    slug = serializers.CharField()
    icon = serializers.CharField(allow_null=True, required=False)

class MinimalTagSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    slug = serializers.CharField()

class DestinationListSerializer(serializers.ModelSerializer):
    state = MinimalStateSerializer(read_only=True)
    city = MinimalCitySerializer(read_only=True)
    categories = MinimalCategorySerializer(many=True, read_only=True)
    activities = MinimalActivitySerializer(many=True, read_only=True)
    tags = MinimalTagSerializer(many=True, read_only=True)
    images = DestinationImageSerializer(many=True, read_only=True)
    state_name = serializers.CharField(source='state.name', read_only=True)
    state_slug = serializers.CharField(source='state.slug', read_only=True)
    district_name = serializers.SerializerMethodField()
    city_name = serializers.CharField(source='city.name', read_only=True, default='')
    city_slug = serializers.CharField(source='city.slug', read_only=True, default='')
    region_name = serializers.SerializerMethodField()
    region_slug = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    category_slug = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()
    primary_video = serializers.SerializerMethodField()
    has_video = serializers.BooleanField(read_only=True)
    has_history = serializers.BooleanField(read_only=True)
    pilgrimage_collection_display = serializers.CharField(source='get_pilgrimage_collection_display', read_only=True)
    region_display = serializers.CharField(source='get_region_display', read_only=True)
    trekking_difficulty_display = serializers.CharField(source='get_trekking_difficulty_display', read_only=True)
    trip_duration_type_display = serializers.CharField(source='get_trip_duration_type_display', read_only=True)
    ideal_season_display = serializers.CharField(source='get_ideal_season_display', read_only=True)

    # Dynamic search intent attributes
    distance_km = serializers.FloatField(read_only=True, required=False)
    travel_time_str = serializers.CharField(read_only=True, required=False)
    recommendation_score = serializers.FloatField(read_only=True, required=False)
    match_reasons = serializers.ListField(child=serializers.CharField(), read_only=True, required=False)

    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'slug', 'short_description', 'main_image', 'images',
            'state', 'state_name', 'state_slug', 'district', 'district_name',
            'city', 'city_name', 'city_slug', 'region', 'region_name', 'region_slug', 'region_display',
            'categories', 'category_name', 'category_slug', 'activities', 'tags',
            'pilgrimage_collection', 'pilgrimage_collection_display', 'jyotirlinga_number',
            'temple_deity', 'spiritual_tradition', 'temple_architecture',
            'trekking_difficulty', 'trekking_difficulty_display',
            'trip_duration_type', 'trip_duration_type_display',
            'suitable_for_tags', 'ideal_season', 'ideal_season_display',
            'famous_for', 'best_time_to_visit', 'ticket_price', 'recommended_duration',
            'nearest_airport', 'nearest_railway', 'nearest_bus_station',
            'latitude', 'longitude', 'featured', 'trending', 'is_hidden_gem', 'published',
            'budget_level', 'travel_style', 'avg_rating', 'total_reviews',
            'verification_status', 'data_completeness_score', 'popularity_score',
            'has_video', 'has_history', 'primary_video',
            'distance_km', 'travel_time_str', 'recommendation_score', 'match_reasons'
        ]

    def get_district_name(self, obj):
        if obj.district_obj_id:
            return obj.district_obj.name
        return obj.district or ''

    def get_region_name(self, obj):
        if obj.region_obj_id:
            return obj.region_obj.name
        return obj.get_region_display()

    def get_region_slug(self, obj):
        if obj.region_obj_id:
            return obj.region_obj.slug
        return obj.region


    def get_category_name(self, obj):
        first_cat = obj.categories.first()
        return first_cat.name if first_cat else ''

    def get_category_slug(self, obj):
        first_cat = obj.categories.first()
        return first_cat.slug if first_cat else ''

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

    def get_primary_video(self, obj):
        vid = obj.videos.filter(published=True).order_by('-is_primary', 'display_order').first()
        return DestinationVideoSerializer(vid).data if vid else None


class DestinationDetailSerializer(serializers.ModelSerializer):
    state = MinimalStateSerializer(read_only=True)
    city = MinimalCitySerializer(read_only=True)
    categories = MinimalCategorySerializer(many=True, read_only=True)
    images = DestinationImageSerializer(many=True, read_only=True)
    videos = DestinationVideoSerializer(many=True, read_only=True)
    history = DestinationHistorySerializer(read_only=True)
    sources = DestinationSourceSerializer(many=True, read_only=True)
    attractions = AttractionSerializer(many=True, read_only=True)
    travel_tips = TravelTipSerializer(many=True, read_only=True)

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
    primary_video = serializers.SerializerMethodField()
    has_video = serializers.BooleanField(read_only=True)
    has_history = serializers.BooleanField(read_only=True)
    calculated_completeness_score = serializers.SerializerMethodField()
    pilgrimage_collection_display = serializers.CharField(source='get_pilgrimage_collection_display', read_only=True)
    region_display = serializers.CharField(source='get_region_display', read_only=True)
    trekking_difficulty_display = serializers.CharField(source='get_trekking_difficulty_display', read_only=True)
    trip_duration_type_display = serializers.CharField(source='get_trip_duration_type_display', read_only=True)
    ideal_season_display = serializers.CharField(source='get_ideal_season_display', read_only=True)

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

    def get_primary_video(self, obj):
        vid = obj.videos.filter(published=True).order_by('-is_primary', 'display_order').first()
        return DestinationVideoSerializer(vid).data if vid else None

    def get_calculated_completeness_score(self, obj):
        return obj.calculate_completeness_score()


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


class TravelCollectionListSerializer(serializers.ModelSerializer):
    destination_count = serializers.IntegerField(source='destinations.count', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = TravelCollection
        fields = [
            'id', 'name', 'slug', 'subtitle', 'description', 
            'cover_image', 'category', 'category_name', 'destination_count', 
            'featured', 'display_order', 'published'
        ]


class TravelCollectionDetailSerializer(serializers.ModelSerializer):
    destination_count = serializers.IntegerField(source='destinations.count', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    destinations = DestinationListSerializer(many=True, read_only=True)
    destination_ids = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all(), source='destinations', many=True, write_only=True, required=False
    )

    class Meta:
        model = TravelCollection
        fields = [
            'id', 'name', 'slug', 'subtitle', 'description', 
            'cover_image', 'category', 'category_name', 'destination_count', 
            'destinations', 'destination_ids', 'featured', 'display_order', 'published', 
            'created_at', 'updated_at'
        ]
