from rest_framework import viewsets, filters, permissions
from django.db.models import Q
from .models import TravelGuide, LocalGuide
from .serializers import TravelGuideSerializer, LocalGuideSerializer
from apps.utils import StandardResultsSetPagination, api_response

class TravelGuideViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TravelGuide.objects.select_related('state', 'city', 'destination').filter(is_published=True)
    serializer_class = TravelGuideSerializer
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'state__name', 'city__name']
    ordering_fields = ['published_at', 'title']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Travel guides retrieved", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"Guide {instance.title} retrieved", data=serializer.data)


class LocalGuideViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = LocalGuide.objects.select_related('state', 'city', 'destination').all()
    serializer_class = LocalGuideSerializer
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'bio', 'languages_spoken', 'state__name', 'destination__name']
    ordering_fields = ['rating', 'experience_years', 'price_per_day']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        dest = request.query_params.get('destination')
        if dest:
            queryset = queryset.filter(Q(destination__slug=dest) | Q(destination__name__icontains=dest))
            
        state = request.query_params.get('state')
        if state:
            queryset = queryset.filter(Q(state__slug=state) | Q(state__name__icontains=state))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Local guides retrieved", data=serializer.data)

