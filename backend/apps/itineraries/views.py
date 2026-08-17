from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from .models import Itinerary, ItineraryDay, ItineraryPlace
from .serializers import ItineraryListSerializer, ItineraryDetailSerializer
from .services import TravelPlannerEngine
from apps.utils import StandardResultsSetPagination, api_response

class ItineraryViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user and self.request.user.is_authenticated:
            return Itinerary.objects.select_related('user', 'destination_city').prefetch_related('days__places__destination').filter(
                user=self.request.user
            ) | Itinerary.objects.select_related('user', 'destination_city').prefetch_related('days__places__destination').filter(
                is_public=True
            )
        return Itinerary.objects.select_related('user', 'destination_city').prefetch_related('days__places__destination').filter(is_public=True)

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'generate']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ItineraryDetailSerializer
        return ItineraryListSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Itineraries retrieved", data=serializer.data)

    @action(detail=False, methods=['post'], url_path='generate', permission_classes=[permissions.AllowAny])
    def generate(self, request):
        start = request.data.get('starting_location', 'Hyderabad')
        dest = request.data.get('destination', 'Andhra Pradesh')
        days = request.data.get('duration_days', 4)
        budget = request.data.get('budget', 15000)
        travelers = request.data.get('num_travelers', 2)
        interests = request.data.get('interests', '')
        transport = request.data.get('transport_preference', 'train')

        plan = TravelPlannerEngine.generate_itinerary(
            starting_location=start,
            destination_name=dest,
            duration_days=days,
            budget=budget,
            num_travelers=travelers,
            interests_str=interests,
            transport_preference=transport
        )
        return api_response(success=True, message="AI itinerary generated", data=plan)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            itinerary = serializer.save(user=request.user)
            
            # Handle creation of nested days/places if provided
            days_data = request.data.get('days', [])
            for day_info in days_data:
                day_obj = ItineraryDay.objects.create(
                    itinerary=itinerary,
                    day_number=day_info.get('day_number', 1),
                    title=day_info.get('title', ''),
                    notes=day_info.get('notes', '')
                )
                for place_info in day_info.get('places', []):
                    ItineraryPlace.objects.create(
                        itinerary_day=day_obj,
                        destination_id=place_info.get('destination_id'),
                        place_name=place_info.get('place_name', ''),
                        order=place_info.get('order', 1),
                        activity_notes=place_info.get('activity_notes', ''),
                        estimated_cost=place_info.get('estimated_cost', 0.00)
                    )

            return api_response(
                success=True,
                message="Itinerary created successfully",
                data=ItineraryDetailSerializer(itinerary).data,
                status_code=status.HTTP_201_CREATED
            )
        return api_response(success=False, message="Validation error", data=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

