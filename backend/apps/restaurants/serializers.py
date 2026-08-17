from rest_framework import serializers
from .models import Restaurant

class RestaurantSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'city', 'city_name', 'destination', 'cuisine_type', 'address', 'avg_cost_for_two', 'rating', 'image']
