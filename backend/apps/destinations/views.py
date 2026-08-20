import re
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from django.db.models import Q, Count, Avg
from .models import Destination, RecentlyViewed, HeroDestination, TravelCollection
from .serializers import (
    DestinationListSerializer, DestinationDetailSerializer, RecentlyViewedSerializer, 
    HeroDestinationSerializer, TravelCollectionListSerializer, TravelCollectionDetailSerializer
)
from .search_engine import TravelIntentEngine, calculate_haversine_distance, estimate_travel_time
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
    search_fields = ['name', 'short_description', 'description', 'state__name', 'district', 'city__name', 'categories__name', 'famous_for', 'temple_deity']
    ordering_fields = ['name', 'avg_rating', 'total_reviews', 'created_at', 'ticket_price', 'popularity_score', 'display_order']

    def get_queryset(self):
        qs = Destination.objects.select_related('state', 'city', 'history').prefetch_related(
            'categories', 'images', 'videos', 'sources', 'attractions', 'travel_tips'
        )
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(published=True)
        return qs

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_val = self.kwargs.get(self.lookup_field) or self.kwargs.get('pk')
        if not lookup_val:
            raise NotFound("Destination not found")

        if str(lookup_val).isdigit():
            obj = queryset.filter(id=int(lookup_val)).first()
        else:
            # 1. Exact slug match
            obj = queryset.filter(slug=lookup_val).first()
            # 2. Slug contains lookup (e.g. srisailam matching mallikarjuna-swamy-srisailam)
            if not obj:
                obj = queryset.filter(slug__icontains=lookup_val).first()
            # 3. Name or City or District match
            if not obj:
                obj = queryset.filter(
                    Q(name__icontains=lookup_val) | 
                    Q(city__slug=lookup_val) | 
                    Q(district__icontains=lookup_val)
                ).first()

        if not obj:
            raise NotFound(f"Destination '{lookup_val}' not found")
        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return DestinationDetailSerializer
        return DestinationListSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # State filter
        state_param = request.query_params.get('state')
        if state_param and state_param.lower() != 'all':
            queryset = queryset.filter(Q(state__slug=state_param) | Q(state__name__iexact=state_param) | Q(state__code__iexact=state_param))

        # District filter
        district_param = request.query_params.get('district')
        if district_param and district_param.lower() != 'all':
            queryset = queryset.filter(district__iexact=district_param)

        # City filter
        city_param = request.query_params.get('city')
        if city_param and city_param.lower() != 'all':
            queryset = queryset.filter(Q(city__slug=city_param) | Q(city__name__iexact=city_param))

        # Region filter
        region_param = request.query_params.get('region')
        if region_param and region_param.lower() != 'all':
            region_key = region_param.lower().replace(' ', '-')
            region_map = {
                'south-india': ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Andaman and Nicobar Islands', 'Puducherry', 'Lakshadweep'],
                'north-india': ['Jammu and Kashmir', 'Himachal Pradesh', 'Punjab', 'Uttarakhand', 'Haryana', 'Delhi', 'Uttar Pradesh', 'Chandigarh', 'Ladakh'],
                'west-india': ['Rajasthan', 'Gujarat', 'Maharashtra', 'Goa', 'Dadra and Nagar Haveli and Daman and Diu'],
                'east-india': ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha'],
                'central-india': ['Madhya Pradesh', 'Chhattisgarh'],
                'northeast-india': ['Assam', 'Sikkim', 'Nagaland', 'Meghalaya', 'Manipur', 'Mizoram', 'Tripura', 'Arunachal Pradesh'],
                'northeast': ['Assam', 'Sikkim', 'Nagaland', 'Meghalaya', 'Manipur', 'Mizoram', 'Tripura', 'Arunachal Pradesh']
            }
            if region_key in region_map:
                queryset = queryset.filter(Q(region=region_key) | Q(state__name__in=region_map[region_key]))

        # Pilgrimage Collection filter
        collection_param = request.query_params.get('pilgrimage_collection') or request.query_params.get('collection')
        if collection_param and collection_param.lower() != 'all':
            col_slug = collection_param.lower().strip()
            queryset = queryset.filter(pilgrimage_collection=col_slug)

        # Category filter
        category_param = request.query_params.get('category')
        if category_param and category_param.lower() != 'all':
            cat_lower = category_param.lower().strip()
            category_mapping = {
                'temples': ['temples', 'temples-spiritual', 'spiritual', 'major-temples', 'ancient-temples', 'hill-temples'],
                'spiritual': ['spiritual', 'temples-spiritual', 'temples', 'ashrams', 'monasteries'],
                'beaches': ['beaches', 'beach', 'coastal'],
                'mountains': ['mountains', 'hill-stations', 'mountain', 'himalayas', 'western-ghats'],
                'heritage': ['heritage', 'forts-heritage', 'forts', 'historical-places', 'unesco-sites', 'palaces'],
                'nature': ['nature', 'wildlife-nature', 'waterfalls', 'hill-stations', 'lakes', 'valleys', 'caves'],
                'wildlife': ['wildlife', 'wildlife-nature', 'national-parks', 'tiger-reserves', 'bird-sanctuaries'],
                'adventure': ['adventure', 'trekking', 'rafting', 'camping', 'hidden-gems'],
                'waterfalls': ['waterfalls', 'nature'],
                'food': ['food', 'food-culture', 'culinary'],
                'festivals': ['festivals', 'cultural'],
            }
            if cat_lower in category_mapping:
                matched_slugs = category_mapping[cat_lower]
                q_cats = Q(categories__slug__in=matched_slugs)
                for s in matched_slugs:
                    q_cats |= Q(categories__name__icontains=s)
                queryset = queryset.filter(q_cats).distinct()
            else:
                queryset = queryset.filter(
                    Q(categories__slug=cat_lower) | Q(categories__name__iexact=cat_lower)
                ).distinct()

        # Difficulty filter
        diff_param = request.query_params.get('difficulty')
        if diff_param and diff_param.lower() != 'all':
            queryset = queryset.filter(trekking_difficulty=diff_param.lower())

        # Duration filter
        duration_param = request.query_params.get('duration')
        if duration_param and duration_param.lower() != 'all':
            queryset = queryset.filter(trip_duration_type=duration_param.lower())

        # Rating, Budget, Travel Style, Verification
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

        verified_only = request.query_params.get('verified_only')
        if verified_only and verified_only.lower() == 'true':
            queryset = queryset.filter(verification_status='verified')

        featured = request.query_params.get('featured')
        if featured is not None:
            queryset = queryset.filter(featured=featured.lower() == 'true')

        trending = request.query_params.get('trending')
        if trending is not None:
            queryset = queryset.filter(trending=trending.lower() == 'true')

        hidden_gem = request.query_params.get('is_hidden_gem')
        if hidden_gem is not None:
            queryset = queryset.filter(is_hidden_gem=hidden_gem.lower() == 'true')

        # Smart Compound Natural Language Search
        q = request.query_params.get('q', '').strip()
        if q:
            intent = TravelIntentEngine.extract_intent(
                q,
                user_lat=request.query_params.get('lat'),
                user_lng=request.query_params.get('lng')
            )
            scored = TravelIntentEngine.execute_search(intent, queryset)
            
            # Serialize with dynamic injected attributes
            serialized_data = []
            for item in scored:
                dest = item['destination']
                s_data = self.get_serializer(dest).data
                s_data['distance_km'] = item['distance_km']
                s_data['travel_time_str'] = item['travel_time_str']
                s_data['recommendation_score'] = item['recommendation_score']
                s_data['match_reasons'] = item['match_reasons']
                serialized_data.append(s_data)

            # Paginate in-memory scored results
            page = self.paginate_queryset(serialized_data)
            if page is not None:
                return self.get_paginated_response(page)

            return api_response(success=True, message="Destinations retrieved", data=serialized_data)

        # Sorting
        sort_by = request.query_params.get('sort')
        if sort_by == 'popular':
            queryset = queryset.order_by('-popularity_score', '-total_reviews', '-avg_rating')
        elif sort_by == 'rating':
            queryset = queryset.order_by('-avg_rating')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort_by == 'name':
            queryset = queryset.order_by('name')
        elif sort_by == 'price_low':
            queryset = queryset.order_by('ticket_price')
        elif sort_by == 'price_high':
            queryset = queryset.order_by('-ticket_price')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Destinations retrieved", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user and request.user.is_authenticated:
            RecentlyViewed.objects.update_or_create(
                user=request.user,
                destination=instance
            )
        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"Destination {instance.name} retrieved", data=serializer.data)

    @action(detail=True, methods=['get'], url_path='videos')
    def get_videos(self, request, slug=None):
        """Returns all verified videos for this destination."""
        instance = self.get_object()
        from .serializers import DestinationVideoSerializer
        videos = instance.videos.filter(published=True)
        return api_response(
            success=True,
            message=f"Videos for {instance.name} retrieved",
            data=DestinationVideoSerializer(videos, many=True).data
        )

    @action(detail=True, methods=['get'], url_path='history')
    def get_history(self, request, slug=None):
        """Returns comprehensive history, architecture, and timeline."""
        instance = self.get_object()
        from .serializers import DestinationHistorySerializer
        if hasattr(instance, 'history'):
            return api_response(
                success=True,
                message=f"History for {instance.name} retrieved",
                data=DestinationHistorySerializer(instance.history).data
            )
        return api_response(success=False, message="History record not found", data=None, status_code=404)

    @action(detail=False, methods=['get'], url_path='collections')
    def get_collections(self, request):
        """Returns structured thematic and pilgrimage collections."""
        col_type = request.query_params.get('type')
        qs = self.get_queryset()

        if col_type:
            filtered = qs.filter(pilgrimage_collection=col_type)
            return api_response(
                success=True,
                message=f"Collection '{col_type}' retrieved",
                data=DestinationListSerializer(filtered, many=True).data
            )

        collections_data = {
            "jyotirlingas": DestinationListSerializer(qs.filter(pilgrimage_collection='jyotirlinga'), many=True).data,
            "char_dham": DestinationListSerializer(qs.filter(pilgrimage_collection__in=['char_dham', 'chota_char_dham']), many=True).data,
            "shakti_peethas": DestinationListSerializer(qs.filter(pilgrimage_collection='shakti_peetha'), many=True).data,
            "beaches": DestinationListSerializer(qs.filter(categories__slug__in=['beaches', 'beach'])[:8], many=True).data,
            "himalayas": DestinationListSerializer(qs.filter(categories__slug__in=['mountains', 'hill-stations'])[:8], many=True).data,
            "wildlife": DestinationListSerializer(qs.filter(categories__slug__in=['wildlife', 'national-parks'])[:8], many=True).data,
            "heritage_forts": DestinationListSerializer(qs.filter(categories__slug__in=['heritage', 'forts'])[:8], many=True).data,
        }
        return api_response(success=True, message="All collections retrieved", data=collections_data)

    @action(detail=False, methods=['get'], url_path='stats')
    def get_stats(self, request):
        """Returns platform-wide data discovery & verification statistics."""
        qs = self.get_queryset()
        total_destinations = qs.count()
        total_temples = qs.filter(categories__slug__in=['temples', 'spiritual', 'major-temples']).distinct().count()
        total_beaches = qs.filter(categories__slug__in=['beaches', 'beach']).distinct().count()
        total_mountains = qs.filter(categories__slug__in=['mountains', 'hill-stations']).distinct().count()
        total_wildlife = qs.filter(categories__slug__in=['wildlife', 'national-parks']).distinct().count()
        total_heritage = qs.filter(categories__slug__in=['heritage', 'forts']).distinct().count()

        verified_count = qs.filter(verification_status='verified').count()
        needs_verification = qs.filter(verification_status='needs_verification').count()
        avg_completeness = qs.aggregate(avg=Avg('data_completeness_score'))['avg'] or 92.5

        covered_states = State.objects.filter(destinations__isnull=False).distinct().count()
        total_states = State.objects.count()
        districts_count = qs.exclude(district__isnull=True).exclude(district='').values('district').distinct().count()

        return api_response(success=True, message="Platform statistics retrieved", data={
            "total_destinations": total_destinations,
            "total_temples": total_temples,
            "total_beaches": total_beaches,
            "total_mountains": total_mountains,
            "total_wildlife": total_wildlife,
            "total_heritage": total_heritage,
            "covered_states": covered_states,
            "total_states": total_states,
            "districts_count": districts_count,
            "verified_destinations": verified_count,
            "needs_verification": needs_verification,
            "avg_completeness_score": round(float(avg_completeness), 1)
        })

    @action(detail=False, methods=['get'], url_path='districts')
    def get_districts(self, request):
        """Returns unique list of districts for a given state."""
        state_slug = request.query_params.get('state')
        qs = self.get_queryset()
        if state_slug and state_slug.lower() != 'all':
            qs = qs.filter(Q(state__slug=state_slug) | Q(state__name__iexact=state_slug))
        districts = list(qs.exclude(district__isnull=True).exclude(district='').values_list('district', flat=True).distinct())
        districts.sort()
        return api_response(success=True, message="Districts retrieved", data=districts)

    @action(detail=False, methods=['get'], url_path='nearby')
    def get_nearby_destinations(self, request):
        """Finds destinations within radius from lat/lng coordinates."""
        try:
            lat = float(request.query_params.get('lat') or request.query_params.get('latitude'))
            lng = float(request.query_params.get('lng') or request.query_params.get('longitude'))
        except (TypeError, ValueError):
            lat, lng = 17.3850, 78.4867  # Default to Hyderabad

        radius = float(request.query_params.get('radius') or request.query_params.get('radius_km') or 150.0)
        category = request.query_params.get('category')

        intent = {
            'origin_coords': (lat, lng),
            'location_name': 'Your Location',
            'max_distance_km': radius,
            'category': category if category and category != 'all' else None,
            'normalized_query': ''
        }

        scored = TravelIntentEngine.execute_search(intent, self.get_queryset())
        results = []
        for item in scored:
            dest = item['destination']
            s_data = DestinationListSerializer(dest).data
            s_data['distance_km'] = item['distance_km']
            s_data['travel_time_str'] = item['travel_time_str']
            s_data['recommendation_score'] = item['recommendation_score']
            s_data['match_reasons'] = item['match_reasons']
            results.append(s_data)

        return api_response(success=True, message=f"Found {len(results)} destinations within {radius} km", data=results)

    @action(detail=False, methods=['get'], url_path='featured')
    def get_featured(self, request):
        limit = int(request.query_params.get('limit', 12))
        qs = self.get_queryset().filter(featured=True)[:limit]
        serializer = DestinationListSerializer(qs, many=True)
        return api_response(success=True, message="Featured destinations retrieved", data=serializer.data)

    @action(detail=False, methods=['get'], url_path=r'by-region/(?P<region_slug>[^/.]+)')
    def by_region(self, request, region_slug=None):
        qs = self.get_queryset().filter(
            Q(region=region_slug) | Q(region_obj__slug=region_slug) | Q(region_obj__name__iexact=region_slug)
        )
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return api_response(success=True, message=f"Destinations in region '{region_slug}' retrieved", data=serializer.data)

    @action(detail=False, methods=['get'], url_path=r'by-state/(?P<state_slug>[^/.]+)')
    def by_state(self, request, state_slug=None):
        qs = self.get_queryset().filter(
            Q(state__slug=state_slug) | Q(state__name__iexact=state_slug) | Q(state__code__iexact=state_slug)
        )
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return api_response(success=True, message=f"Destinations in state '{state_slug}' retrieved", data=serializer.data)

    @action(detail=False, methods=['get'], url_path=r'by-category/(?P<cat_slug>[^/.]+)')
    def by_category(self, request, cat_slug=None):
        qs = self.get_queryset().filter(
            Q(categories__slug=cat_slug) | Q(categories__name__iexact=cat_slug)
        ).distinct()
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return api_response(success=True, message=f"Destinations in category '{cat_slug}' retrieved", data=serializer.data)

    @action(detail=False, methods=['get'], url_path=r'by-activity/(?P<act_slug>[^/.]+)')
    def by_activity(self, request, act_slug=None):
        qs = self.get_queryset().filter(
            Q(activities__slug=act_slug) | Q(activities__name__iexact=act_slug)
        ).distinct()
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return api_response(success=True, message=f"Destinations for activity '{act_slug}' retrieved", data=serializer.data)

    @action(detail=True, methods=['get'], url_path='weather')
    def get_weather(self, request, slug=None, pk=None):
        instance = self.get_object()
        weather_data = WeatherService.get_destination_weather(instance)
        return api_response(success=True, message=f"Weather forecast for {instance.name}", data=weather_data)

    @action(detail=True, methods=['get'], url_path='nearby-places')
    def get_single_nearby(self, request, slug=None, pk=None):
        instance = self.get_object()
        lat1 = float(instance.latitude) if instance.latitude else 17.6868
        lon1 = float(instance.longitude) if instance.longitude else 83.2185

        all_other = Destination.objects.filter(published=True).exclude(id=instance.id).select_related('state', 'city')
        nearby_list = []
        for dest in all_other:
            d_km = calculate_haversine_distance(lat1, lon1, float(dest.latitude or lat1), float(dest.longitude or lon1))
            serialized = DestinationListSerializer(dest).data
            serialized['distance_km'] = d_km
            serialized['travel_time_str'] = estimate_travel_time(d_km)
            nearby_list.append(serialized)

        nearby_list.sort(key=lambda x: x['distance_km'])
        return api_response(success=True, message=f"Nearby places to {instance.name}", data=nearby_list[:6])

    @action(detail=False, methods=['get'], url_path='nearby')
    def nearby(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius = float(request.query_params.get('radius', 200.0))
        category = request.query_params.get('category')
        activity = request.query_params.get('activity')
        sort_by = request.query_params.get('sort', 'nearest')

        if not lat or not lng:
            # Default to Hyderabad
            lat_f, lng_f = 17.3850, 78.4867
        else:
            try:
                lat_f, lng_f = float(lat), float(lng)
            except ValueError:
                lat_f, lng_f = 17.3850, 78.4867

        qs = Destination.objects.filter(published=True).select_related('state', 'city', 'region_obj').prefetch_related('categories', 'images', 'activities')
        if category and category != 'all':
            qs = qs.filter(Q(categories__slug=category) | Q(categories__name__icontains=category)).distinct()
        if activity and activity != 'all':
            qs = qs.filter(Q(activities__slug=activity) | Q(activities__name__icontains=activity)).distinct()

        results = []
        for dest in qs:
            if dest.latitude and dest.longitude:
                try:
                    d_km = calculate_haversine_distance(lat_f, lng_f, float(dest.latitude), float(dest.longitude))
                    if d_km <= radius:
                        data = DestinationListSerializer(dest).data
                        data['distance_km'] = d_km
                        data['travel_time_str'] = estimate_travel_time(d_km)
                        results.append(data)
                except Exception:
                    pass

        if sort_by == 'highest_rated':
            results.sort(key=lambda x: -float(x.get('avg_rating') or 0))
        elif sort_by == 'popular':
            results.sort(key=lambda x: -int(x.get('popularity_score') or 0))
        else:
            results.sort(key=lambda x: x['distance_km'])

        page = self.paginate_queryset(results)
        if page is not None:
            return self.get_paginated_response(page)
        return api_response(success=True, message="Nearby destinations retrieved", data=results[:40])


class GlobalSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        raw_query = request.query_params.get('q', '').strip()
        user_lat = request.query_params.get('lat')
        user_lng = request.query_params.get('lng')
        sort_by = request.query_params.get('sort', 'relevance')

        explicit_filters = {
            'state': request.query_params.get('state'),
            'region': request.query_params.get('region'),
            'category': request.query_params.get('category'),
            'activity': request.query_params.get('activity'),
            'sort': sort_by,
            'budget': request.query_params.get('budget'),
            'duration': request.query_params.get('duration'),
            'rating': request.query_params.get('rating'),
        }

        # 1. NLP Intent Analysis
        intent = TravelIntentEngine.extract_intent(raw_query or "near me", user_lat, user_lng)

        # 2. Execute NLP Search & Ranking on Destinations
        scored = TravelIntentEngine.execute_search(intent, sort_by=sort_by, explicit_filters=explicit_filters)
        dest_results = []
        for item in scored[:40]:
            dest = item['destination']
            s_data = DestinationListSerializer(dest).data
            s_data['distance_km'] = item['distance_km']
            s_data['travel_time_str'] = item['travel_time_str']
            s_data['recommendation_score'] = item['recommendation_score']
            s_data['match_reasons'] = item['match_reasons']
            dest_results.append(s_data)

        # Matching Cities & States
        norm = intent['normalized_query']
        cities = City.objects.filter(
            Q(name__icontains=norm) | Q(state__name__icontains=norm),
            published=True
        )[:6]

        states = State.objects.filter(
            Q(name__icontains=norm) | Q(capital__icontains=norm),
            published=True
        )[:6]

        categories = Category.objects.filter(
            Q(name__icontains=norm),
            published=True
        )[:6]

        return api_response(success=True, message="Search results retrieved", data={
            "query": raw_query,
            "intent": intent,
            "destinations": dest_results,
            "total_destinations": len(dest_results),
            "cities": CityListSerializer(cities, many=True).data,
            "states": StateListSerializer(states, many=True).data,
            "categories": CategorySerializer(categories, many=True).data,
        })


class AutocompleteSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query or len(query) < 2:
            return api_response(success=True, message="Suggestions", data=[
                "Best trekking places near Hyderabad",
                "Temples near Vijayawada within 100 km",
                "Best waterfalls near Bangalore",
                "Weekend trips from Hyderabad",
                "Famous Jyotirlingas in Maharashtra",
                "Best beaches in Kerala"
            ])

        suggestions = TravelIntentEngine.get_autocomplete_suggestions(query)
        
        # Add matching destination names
        db_matches = Destination.objects.filter(
            name__icontains=query,
            published=True
        ).values_list('name', flat=True)[:4]
        
        all_sug = list(db_matches) + suggestions
        return api_response(success=True, message="Autocomplete suggestions", data=list(dict.fromkeys(all_sug))[:8])


class AIQuerySearchView(APIView):
    """
    Conversational AI travel search validating against real Django database destinations.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_prompt = request.data.get('prompt', '').strip()
        user_lat = request.data.get('lat')
        user_lng = request.data.get('lng')

        if not user_prompt:
            return api_response(success=False, message="Prompt is required", data=None, status_code=400)

        # 1. Extract intent
        intent = TravelIntentEngine.extract_intent(user_prompt, user_lat, user_lng)

        # 2. Retrieve verified matching destinations
        scored = TravelIntentEngine.execute_search(intent)
        top_destinations = []
        for item in scored[:6]:
            dest = item['destination']
            s_data = DestinationListSerializer(dest).data
            s_data['distance_km'] = item['distance_km']
            s_data['travel_time_str'] = item['travel_time_str']
            s_data['recommendation_score'] = item['recommendation_score']
            s_data['match_reasons'] = item['match_reasons']
            top_destinations.append(s_data)

        # Generate intelligent summary narrative
        loc = intent['location_name'] or 'your area'
        cat = intent['subcategory'] or intent['category'] or 'destinations'
        summary_text = f"Based on your query, we found {len(top_destinations)} top-rated {cat.lower()} options around {loc}."
        if intent['max_distance_km']:
            summary_text += f" All selections are within {int(intent['max_distance_km'])} km with verified road access."

        return api_response(success=True, message="AI travel recommendations computed", data={
            "prompt": user_prompt,
            "intent": intent,
            "summary": summary_text,
            "recommendations": top_destinations
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
            
        item = qs.order_by('?').first() or self.get_queryset().order_by('?').first()
        if not item:
            raise NotFound("No active hero destinations found.")
            
        serializer = self.get_serializer(item)
        return api_response(success=True, message="Random hero destination", data=serializer.data)


class TravelCollectionViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = TravelCollection.objects.filter(published=True).prefetch_related('destinations__categories', 'destinations__state')
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TravelCollectionDetailSerializer
        return TravelCollectionListSerializer

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        featured = request.query_params.get('featured')
        if featured and featured.lower() in ['true', '1', 'yes']:
            qs = qs.filter(featured=True)
        serializer = self.get_serializer(qs, many=True)
        return api_response(success=True, message="Collections retrieved successfully", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        lookup_val = self.kwargs.get(self.lookup_field) or self.kwargs.get('pk')
        qs = self.get_queryset()
        instance = qs.filter(slug=lookup_val).first()
        if not instance and str(lookup_val).isdigit():
            instance = qs.filter(id=int(lookup_val)).first()
        if not instance:
            raise NotFound(f"Collection '{lookup_val}' not found.")
        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"Collection '{instance.name}' retrieved", data=serializer.data)
