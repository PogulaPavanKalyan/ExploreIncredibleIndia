from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.destinations.models import Destination

STATE_TO_REGION = {
    # NORTH
    'Jammu & Kashmir': 'North India',
    'Ladakh': 'North India',
    'Punjab': 'North India',
    'Himachal Pradesh': 'North India',
    'Haryana': 'North India',
    'Delhi': 'North India',
    'Uttarakhand': 'North India',
    'Uttar Pradesh': 'North India',
    'Chandigarh': 'North India',
    
    # SOUTH
    'Andhra Pradesh': 'South India',
    'Karnataka': 'South India',
    'Kerala': 'South India',
    'Tamil Nadu': 'South India',
    'Telangana': 'South India',
    'Lakshadweep': 'South India',
    'Puducherry': 'South India',
    'Andaman & Nicobar Islands': 'South India',
    'Andaman & Nicobar': 'South India',
    
    # WEST
    'Gujarat': 'West India',
    'Maharashtra': 'West India',
    'Goa': 'West India',
    'Rajasthan': 'West India',
    'Dadra & Nagar Haveli and Daman & Diu': 'West India',
    
    # EAST
    'West Bengal': 'East India',
    'Bihar': 'East India',
    'Jharkhand': 'East India',
    'Odisha': 'East India',
    
    # CENTRAL
    'Madhya Pradesh': 'Central India',
    'Chhattisgarh': 'Central India',
    
    # NORTHEAST
    'Assam': 'Northeast India',
    'Arunachal Pradesh': 'Northeast India',
    'Manipur': 'Northeast India',
    'Meghalaya': 'Northeast India',
    'Mizoram': 'Northeast India',
    'Nagaland': 'Northeast India',
    'Sikkim': 'Northeast India',
    'Tripura': 'Northeast India',
}

def get_region_from_state(state_name):
    for key, value in STATE_TO_REGION.items():
        if key.lower() in state_name.lower():
            return value
    return 'Other'

def get_image_url(dest, request=None):
    """
    Safely resolve the best available image URL for a destination.
    Handles three cases:
    1. main_image stores a real local file -> return Django media URL.
    2. main_image stores an encoded external URL (Unsplash seed bug) -> decode and return directly.
    3. main_image is blank -> fall back to first DestinationImage.
    """
    from urllib.parse import unquote

    def resolve(path_str):
        if not path_str:
            return None
        # Django ImageField.name stores e.g. "destinations/photo.jpg"
        # But some records were seeded with "https://..." encoded as a file name.
        # Detect: if the path contains "http" it's an external URL stored incorrectly.
        if 'http' in path_str:
            # Strip any leading "destinations/" prefix added by upload_to
            # then URL-decode
            cleaned = path_str.replace('destinations/', '', 1)
            return unquote(cleaned)
        return None

    if dest.main_image:
        external = resolve(dest.main_image.name)
        if external:
            return external
        # Real local file — return absolute URL
        try:
            return dest.main_image.url  # /media/destinations/photo.jpg
        except Exception:
            pass

    # Fallback: first DestinationImage
    first_img = dest.images.filter().first()
    if first_img and first_img.image:
        external = resolve(first_img.image.name)
        if external:
            return external
        try:
            return first_img.image.url
        except Exception:
            pass

    return ''


def serialize_destination(dest):
    image_url = get_image_url(dest)
    category = dest.categories.first().name if dest.categories.exists() else 'General'
    
    return {
        "id": dest.id,
        "destination": dest.name,
        "slug": dest.slug,
        "state": dest.state.name if dest.state else '',
        "region": get_region_from_state(dest.state.name) if dest.state else 'Other',
        "latitude": float(dest.latitude) if dest.latitude else None,
        "longitude": float(dest.longitude) if dest.longitude else None,
        "image": image_url,
        "short_description": dest.short_description,
        "category": category
    }

class JourneyViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def destinations(self, request):
        destinations = Destination.objects.filter(published=True).select_related('state').prefetch_related('categories', 'images')
        
        # We only want destinations that have coordinates for the map
        destinations = destinations.exclude(latitude__isnull=True).exclude(longitude__isnull=True)
        
        data = [serialize_destination(d) for d in destinations]
        return Response(data)

    @action(detail=False, methods=['get'])
    def regions(self, request):
        regions = list(set(STATE_TO_REGION.values()))
        regions.sort()
        return Response([{"id": i, "name": r} for i, r in enumerate(regions)])

    @action(detail=False, methods=['get'])
    def featured(self, request):
        # We need a curated list for the cinematic journey
        destinations = Destination.objects.filter(published=True).select_related('state').prefetch_related('categories', 'images')
        destinations = destinations.exclude(latitude__isnull=True).exclude(longitude__isnull=True)
        
        # Prefer featured or trending, but ensure we have spread
        featured_qs = destinations.filter(featured=True) | destinations.filter(trending=True)
        if featured_qs.count() < 5:
             featured_qs = destinations[:15]
             
        data = [serialize_destination(d) for d in featured_qs]
        return Response(data)
