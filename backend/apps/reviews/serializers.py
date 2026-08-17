from rest_framework import serializers
from .models import Review
from apps.users.serializers import UserProfileSerializer

class ReviewSerializer(serializers.ModelSerializer):
    user_details = UserProfileSerializer(source='user', read_only=True)
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    destination_slug = serializers.CharField(source='destination.slug', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_details', 'destination', 'destination_name', 'destination_slug', 'rating', 'title', 'comment', 'helpful_count', 'is_reported', 'is_approved', 'created_at']
        read_only_fields = ['id', 'user', 'helpful_count', 'is_reported', 'is_approved', 'created_at']
