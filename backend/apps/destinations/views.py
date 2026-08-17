import re
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from django.db.models import Q
from .models import Destination, RecentlyViewed, HeroDestination
from .serializers import DestinationListSerializer, DestinationDetailSerializer, RecentlyViewedSerializer, HeroDestinationSerializer
from .services import WeatherService
from apps.states.models import State
from apps.states.serializers import StateListSerializer
from apps.cities.models import City
from apps.cities.serializers import CityListSerializer
from apps.categories.models import Category
from apps.categories.serializers import CategorySerializer
from apps.utils import StandardResultsSetPagination, api_response, IsAdminOrReadOnlyPublished

class DestinationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnlyPublished]
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'short_description', 'description', 'state__name', 'city__name', 'categories__name']
    ordering_fields = ['name', 'avg_rating', 'total_reviews', 'created_at', 'ticket_price']

    def get_queryset(self):
        qs = Destination.objects.select_related('state', 'city').prefetch_related(
            'categories', 'images', 'videos', 'attractions', 'travel_tips'
        )
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(published=True)
        return qs

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_val = self.kwargs.get(self.lookup_field) or self.kwargs.get('pk')
        if lookup_val.isdigit():
            obj = queryset.filter(id=int(lookup_val)).first()
        else:
            obj = queryset.filter(slug=lookup_val).first()
        if not obj:
            raise NotFound("Destination not found")
        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return DestinationDetailSerializer
        return DestinationListSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Filtering parameters
        state_param = request.query_params.get('state')
        if state_param:
            queryset = queryset.filter(Q(state__slug=state_param) | Q(state__name__iexact=state_param))

        city_param = request.query_params.get('city')
        if city_param:
            queryset = queryset.filter(Q(city__slug=city_param) | Q(city__name__iexact=city_param))

        region_param = request.query_params.get('region')
        if region_param:
            region_map = {
                'south-india': ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Andaman and Nicobar Islands', 'Puducherry', 'Lakshadweep'],
                'north-india': ['Jammu and Kashmir', 'Himachal Pradesh', 'Punjab', 'Uttarakhand', 'Haryana', 'Delhi', 'Uttar Pradesh', 'Chandigarh', 'Ladakh'],
                'west-india': ['Rajasthan', 'Gujarat', 'Maharashtra', 'Goa', 'Dadra and Nagar Haveli and Daman and Diu'],
                'east-india': ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha'],
                'central-india': ['Madhya Pradesh', 'Chhattisgarh'],
                'northeast-india': ['Assam', 'Sikkim', 'Nagaland', 'Meghalaya', 'Manipur', 'Mizoram', 'Tripura', 'Arunachal Pradesh']
            }
            # Clean up region param e.g. "South India" -> "south-india"
            region_key = region_param.lower().replace(' ', '-')
            if region_key in region_map:
                queryset = queryset.filter(state__name__in=region_map[region_key])

        category_param = request.query_params.get('category')
        if category_param:
            queryset = queryset.filter(Q(categories__slug=category_param) | Q(categories__name__iexact=category_param)).distinct()

        rating_param = request.query_params.get('rating')
        if rating_param:
            try:
                queryset = queryset.filter(avg_rating__gte=float(rating_param))
            except ValueError:
                pass

        budget_param = request.query_params.get('budget')
        if budget_param:
            queryset = queryset.filter(budget_level=budget_param)

        travel_style_param = request.query_params.get('travel_style') or request.query_params.get('type')
        if travel_style_param:
            queryset = queryset.filter(travel_style=travel_style_param)

        featured = request.query_params.get('featured')
        if featured is not None:
            queryset = queryset.filter(featured=featured.lower() == 'true')

        trending = request.query_params.get('trending')
        if trending is not None:
            queryset = queryset.filter(trending=trending.lower() == 'true')

        hidden_gem = request.query_params.get('is_hidden_gem')
        if hidden_gem is not None:
            queryset = queryset.filter(is_hidden_gem=hidden_gem.lower() == 'true')

        # Custom Search query parameter
        q = request.query_params.get('q')
        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) |
                Q(short_description__icontains=q) |
                Q(description__icontains=q) |
                Q(state__name__icontains=q) |
                Q(city__name__icontains=q) |
                Q(categories__name__icontains=q)
            ).distinct()

        # Sorting
        sort_by = request.query_params.get('sort')
        if sort_by == 'popular':
            queryset = queryset.order_by('-total_reviews', '-avg_rating')
        elif sort_by == 'rating':
            queryset = queryset.order_by('-avg_rating')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort_by == 'name':
            queryset = queryset.order_by('name')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Destinations retrieved", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Track recently viewed if user is authenticated
        if request.user and request.user.is_authenticated:
            RecentlyViewed.objects.update_or_create(
                user=request.user,
                destination=instance
            )

        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"Destination {instance.name} retrieved", data=serializer.data)

    @action(detail=True, methods=['get'], url_path='weather')
    def get_weather(self, request, slug=None, pk=None):
        instance = self.get_object()
        weather_data = WeatherService.get_destination_weather(instance)
        return api_response(success=True, message=f"Weather forecast for {instance.name}", data=weather_data)

    @action(detail=True, methods=['get'], url_path='nearby')
    def get_nearby(self, request, slug=None, pk=None):
        import math
        instance = self.get_object()
        lat1 = float(instance.latitude) if instance.latitude else 17.6868
        lon1 = float(instance.longitude) if instance.longitude else 83.2185

        def calc_dist(lat2, lon2):
            try:
                l2 = float(lat2) if lat2 else lat1 + 0.1
                ln2 = float(lon2) if lon2 else lon1 + 0.1
                dlat = math.radians(l2 - lat1)
                dlon = math.radians(ln2 - lon1)
                a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(l2)) * math.sin(dlon / 2)**2
                return round(6371.0 * (2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))), 1)
            except Exception:
                return 15.0

        all_other = Destination.objects.filter(published=True).exclude(id=instance.id).select_related('state', 'city', 'category')
        
        # Sort by proximity
        nearby_list = []
        for dest in all_other:
            d_km = calc_dist(dest.latitude, dest.longitude)
            serialized = DestinationListSerializer(dest).data
            serialized['distance_km'] = d_km
            nearby_list.append(serialized)

        nearby_list.sort(key=lambda x: x['distance_km'])
        return api_response(success=True, message=f"Nearby places to {instance.name}", data=nearby_list[:6])


class GlobalSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        raw_query = request.query_params.get('q', '').strip()
        if not raw_query:
            return api_response(success=True, message="Empty query", data={
                "destinations": [],
                "cities": [],
                "states": [],
                "categories": []
            })

        # Tokenize and remove common natural language stop words
        stop_words = {'near', 'in', 'best', 'places', 'place', 'spots', 'spot', 'to', 'visit', 'top', 'around', 'of', 'and', 'the'}
        tokens = [w for w in re.split(r'\s+', raw_query.lower()) if w and w not in stop_words]
        if not tokens:
            tokens = [raw_query.lower()]

        # 1. Base Q for full query match
        dest_q = Q(name__icontains=raw_query) | Q(short_description__icontains=raw_query) | Q(description__icontains=raw_query) | Q(city__name__icontains=raw_query) | Q(state__name__icontains=raw_query) | Q(categories__name__icontains=raw_query) | Q(attractions__name__icontains=raw_query)

        # 2. Add individual token matching for natural language (e.g. 'waterfalls' AND 'hyderabad')
        token_q = Q()
        for token in tokens:
            token_q &= (
                Q(name__icontains=token) |
                Q(short_description__icontains=token) |
                Q(description__icontains=token) |
                Q(city__name__icontains=token) |
                Q(state__name__icontains=token) |
                Q(categories__name__icontains=token) |
                Q(attractions__name__icontains=token)
            )

        destinations = Destination.objects.filter(
            (dest_q | token_q),
            published=True
        ).distinct()[:15]

        cities = City.objects.filter(
            Q(name__icontains=raw_query) | Q(state__name__icontains=raw_query) | Q(description__icontains=raw_query),
            published=True
        )[:5]

        states = State.objects.filter(
            Q(name__icontains=raw_query) | Q(capital__icontains=raw_query) | Q(short_description__icontains=raw_query),
            published=True
        )[:5]

        categories = Category.objects.filter(
            Q(name__icontains=raw_query) | Q(description__icontains=raw_query),
            published=True
        )[:5]

        return api_response(success=True, message="Search results retrieved", data={
            "query": raw_query,
            "destinations": DestinationListSerializer(destinations, many=True).data,
            "cities": CityListSerializer(cities, many=True).data,
            "states": StateListSerializer(states, many=True).data,
            "categories": CategorySerializer(categories, many=True).data,
        })


class BudgetPlannerEstimateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        dest_slug = request.data.get('destination_slug', '')
        days = max(1, int(request.data.get('days', 4)))
        travelers = max(1, int(request.data.get('travelers', 2)))
        stay_tier = request.data.get('stay_tier', 'mid')
        food_tier = request.data.get('food_tier', 'casual')
        transport_mode = request.data.get('transport_mode', 'taxi')

        stay_rates = {'budget': 1200.0, 'mid': 3500.0, 'luxury': 8500.0}
        food_rates = {'street': 400.0, 'casual': 1200.0, 'fine': 3000.0}
        transport_rates = {'train': 800.0 * travelers, 'taxi': 2500.0 * days, 'flight': 6000.0 * travelers}

        rooms_needed = (travelers + 1) // 2
        hotel_total = round(stay_rates.get(stay_tier, 3500.0) * days * rooms_needed, 2)
        food_total = round(food_rates.get(food_tier, 1200.0) * days * travelers, 2)
        transport_total = round(transport_rates.get(transport_mode, 2500.0 * days), 2)
        
        activities_base = 300.0 * days * travelers
        if dest_slug:
            dest = Destination.objects.filter(slug=dest_slug).first()
            if dest:
                ticket_sum = sum(float(a.ticket_price) for a in dest.attractions.all() if a.ticket_price)
                if ticket_sum > 0:
                    activities_base += (ticket_sum * travelers)

        activities_total = round(activities_base, 2)
        subtotal = hotel_total + food_total + transport_total + activities_total
        contingency = round(subtotal * 0.10, 2)
        grand_total = round(subtotal + contingency, 2)
        per_person = round(grand_total / travelers, 2)

        return api_response(success=True, message="Budget estimated successfully", data={
            "days": days,
            "travelers": travelers,
            "stay_tier": stay_tier,
            "food_tier": food_tier,
            "transport_mode": transport_mode,
            "breakdown": {
                "hotel_cost": hotel_total,
                "food_cost": food_total,
                "transport_cost": transport_total,
                "activities_cost": activities_total,
                "contingency_cost": contingency,
                "grand_total": grand_total,
                "per_person_cost": per_person
            }
        })

class HeroDestinationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = HeroDestination.objects.filter(is_active=True)
    serializer_class = HeroDestinationSerializer
    
    @action(detail=False, methods=['get'], url_path='random')
    def get_random(self, request):
        exclude_id = request.query_params.get('exclude')
        region_filter = request.query_params.get('region')
        
        qs = self.get_queryset()
        
        if exclude_id and exclude_id.isdigit():
            qs = qs.exclude(id=int(exclude_id))
            
        if region_filter:
            qs = qs.filter(region__iexact=region_filter)
            
        # Get random item
        item = qs.order_by('?').first()
        
        if not item:
            item = self.get_queryset().order_by('?').first()
            
        if not item:
            raise NotFound("No active hero destinations found.")
            
        serializer = self.get_serializer(item)
        return api_response(success=True, message="Random hero destination", data=serializer.data)

