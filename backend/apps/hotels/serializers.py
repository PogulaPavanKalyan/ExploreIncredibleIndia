from rest_framework import serializers
from .models import Hotel

class HotelSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)

    class Meta:
        model = Hotel
        fields = ['id', 'name', 'city', 'city_name', 'destination', 'address', 'star_rating', 'price_per_night', 'image', 'booking_url']
