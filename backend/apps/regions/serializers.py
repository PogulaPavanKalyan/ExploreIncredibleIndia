from rest_framework import serializers
from apps.regions.models import Region
from apps.states.models import State
from apps.destinations.models import Destination

# Reuse the existing mapping logic to maintain consistency without needing schema changes
STATE_TO_REGION_MAP = {
    'north-india': ['Jammu & Kashmir', 'Ladakh', 'Punjab', 'Himachal Pradesh', 'Haryana', 'Delhi', 'Uttarakhand', 'Uttar Pradesh', 'Chandigarh'],
    'south-india': ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana', 'Lakshadweep', 'Puducherry', 'Andaman & Nicobar Islands', 'Andaman & Nicobar'],
    'west-india': ['Gujarat', 'Maharashtra', 'Goa', 'Rajasthan', 'Dadra & Nagar Haveli and Daman & Diu'],
    'east-india': ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha'],
    'central-india': ['Madhya Pradesh', 'Chhattisgarh'],
    'northeast-india': ['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'],
}

class RegionStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['name', 'slug']

class RegionDestinationSerializer(serializers.ModelSerializer):
    destination = serializers.SerializerMethodField()
    state = serializers.StringRelatedField()
    category = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Destination
        fields = ['id', 'destination', 'slug', 'state', 'category', 'image']
        
    def get_destination(self, obj):
        return obj.name
        
    def get_category(self, obj):
        return obj.categories.first().name if obj.categories.exists() else 'General'
        
    def get_image(self, obj):
        if obj.main_image:
            return obj.main_image.url
        return ''

class RegionSerializer(serializers.ModelSerializer):
    destination_count = serializers.SerializerMethodField()
    state_count = serializers.SerializerMethodField()
    states = serializers.SerializerMethodField()
    featured_destinations = serializers.SerializerMethodField()
    
    class Meta:
        model = Region
        fields = [
            'id', 'name', 'slug', 'tagline', 'description', 
            'desktop_video', 'mobile_video', 'poster_image',
            'destination_count', 'state_count', 'states', 'featured_destinations'
        ]

    def get_states(self, obj):
        state_names = STATE_TO_REGION_MAP.get(obj.slug, [])
        states = State.objects.filter(name__in=state_names)
        return RegionStateSerializer(states, many=True).data

    def get_state_count(self, obj):
        return len(STATE_TO_REGION_MAP.get(obj.slug, []))

    def get_destination_count(self, obj):
        state_names = STATE_TO_REGION_MAP.get(obj.slug, [])
        return Destination.objects.filter(state__name__in=state_names, published=True).count()

    def get_featured_destinations(self, obj):
        state_names = STATE_TO_REGION_MAP.get(obj.slug, [])
        # Get up to 6 featured or trending destinations for this region
        dests = Destination.objects.filter(
            state__name__in=state_names, 
            published=True,
        )
        featured = dests.filter(featured=True) | dests.filter(trending=True)
        # If we don't have enough featured, just get random/top ones
        if featured.count() < 4:
            featured = dests.order_by('?')[:6]
        else:
            featured = featured[:6]
            
        return RegionDestinationSerializer(featured, many=True).data
