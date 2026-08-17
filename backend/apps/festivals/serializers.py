from rest_framework import serializers
from .models import Festival

class FestivalSerializer(serializers.ModelSerializer):
    state_name = serializers.CharField(source='state.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True, default='')

    class Meta:
        model = Festival
        fields = ['id', 'name', 'slug', 'state', 'state_name', 'city', 'city_name', 'month_celebrated', 'description', 'image']
