from rest_framework import serializers
from .models import Itinerary, ItineraryDay, ItineraryPlace
from apps.destinations.serializers import DestinationListSerializer
from apps.users.serializers import UserProfileSerializer

class ItineraryPlaceSerializer(serializers.ModelSerializer):
    destination_details = DestinationListSerializer(source='destination', read_only=True)

    class Meta:
        model = ItineraryPlace
        fields = ['id', 'destination', 'destination_details', 'place_name', 'order', 'activity_notes', 'estimated_cost']

class ItineraryDaySerializer(serializers.ModelSerializer):
    places = ItineraryPlaceSerializer(many=True, read_only=True)

    class Meta:
        model = ItineraryDay
        fields = ['id', 'day_number', 'title', 'notes', 'places']

class ItineraryListSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    destination_city_name = serializers.CharField(source='destination_city.name', read_only=True, default='')

    class Meta:
        model = Itinerary
        fields = ['id', 'title', 'slug', 'description', 'starting_location', 'destination_city', 'destination_city_name', 'duration_days', 'estimated_budget', 'is_public', 'user_name', 'created_at']

class ItineraryDetailSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    days = ItineraryDaySerializer(many=True, read_only=True)

    class Meta:
        model = Itinerary
        fields = '__all__'
