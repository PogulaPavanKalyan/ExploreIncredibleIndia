from rest_framework import serializers
from urllib.parse import unquote
from .models import Experience
from apps.destinations.serializers import DestinationListSerializer


def resolve_image_url(image_field):
    """Resolve ImageField to a clean URL, handling Unsplash-seed URLs stored as filenames."""
    if not image_field:
        return None
    name = image_field.name
    if not name:
        return None
    # Detect externally-stored URL encoded as filename
    if 'http' in name:
        cleaned = name.replace('experiences/images/', '', 1).replace('experiences/', '', 1)
        return unquote(cleaned)
    # Real local file
    try:
        return image_field.url
    except Exception:
        return None


class ExperienceSerializer(serializers.ModelSerializer):
    featured_destinations = DestinationListSerializer(many=True, read_only=True)
    destination_count = serializers.IntegerField(read_only=True)
    cover_image_url = serializers.SerializerMethodField()

    def get_cover_image_url(self, obj):
        return resolve_image_url(obj.cover_image)

    class Meta:
        model = Experience
        fields = [
            'id', 'name', 'slug', 'description',
            'cover_image_url', 'cover_video', 'display_order',
            'is_active', 'featured_destinations', 'destination_count'
        ]
