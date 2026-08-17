from rest_framework import viewsets, filters
from .models import Hotel
from .serializers import HotelSerializer
from apps.utils import StandardResultsSetPagination, api_response

class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Hotel.objects.select_related('city', 'destination').order_by('-star_rating', 'name')
    serializer_class = HotelSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'address', 'city__name']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        city_slug = request.query_params.get('city')
        if city_slug:
            queryset = queryset.filter(city__slug=city_slug)
        dest_slug = request.query_params.get('destination')
        if dest_slug:
            queryset = queryset.filter(destination__slug=dest_slug)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Hotels retrieved", data=serializer.data)
