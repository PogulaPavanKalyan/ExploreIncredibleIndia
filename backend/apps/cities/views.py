from rest_framework import viewsets, filters, status
from rest_framework.exceptions import NotFound
from django.db.models import Count
from .models import City
from .serializers import CityListSerializer, CityDetailSerializer
from apps.utils import StandardResultsSetPagination, api_response, IsAdminOrReadOnlyPublished

class CityViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnlyPublished]
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'state__name', 'description']
    ordering_fields = ['name', 'destinations_count', 'created_at']

    def get_queryset(self):
        qs = City.objects.select_related('state').annotate(
            destinations_count=Count('destinations', distinct=True)
        ).order_by('name')
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
            raise NotFound("City not found")
        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return CityDetailSerializer
        return CityListSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        state_param = request.query_params.get('state')
        if state_param:
            queryset = queryset.filter(state__slug=state_param)
            
        popular = request.query_params.get('is_popular')
        if popular is not None:
            queryset = queryset.filter(is_popular=popular.lower() == 'true')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Cities retrieved", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"City {instance.name} retrieved", data=serializer.data)

