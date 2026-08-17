from rest_framework import serializers
from .models import Favorite
from apps.destinations.serializers import DestinationListSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    destination_details = DestinationListSerializer(source='destination', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'destination', 'destination_details', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
