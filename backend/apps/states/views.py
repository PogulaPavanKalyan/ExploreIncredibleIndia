from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from django.db.models import Count, Q
from .models import State, District
from .serializers import StateListSerializer, StateDetailSerializer, DistrictSerializer
from apps.cities.models import City
from apps.cities.serializers import CityListSerializer
from apps.utils import StandardResultsSetPagination, api_response, IsAdminOrReadOnlyPublished

class StateViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnlyPublished]
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'capital', 'code', 'short_description']
    ordering_fields = ['name', 'destinations_count', 'created_at']

    def get_queryset(self):
        qs = State.objects.select_related('region').annotate(
            destinations_count=Count('destinations', distinct=True),
            cities_count=Count('cities', distinct=True),
            districts_count=Count('districts', distinct=True)
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
            raise NotFound("State not found")
        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return StateDetailSerializer
        return StateListSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        region = request.query_params.get('region')
        if region:
            queryset = queryset.filter(Q(region__slug=region) | Q(region__name__iexact=region))

        featured = request.query_params.get('featured')
        if featured is not None:
            queryset = queryset.filter(featured=featured.lower() == 'true')
            
        ut = request.query_params.get('is_ut')
        if ut is not None:
            queryset = queryset.filter(is_union_territory=ut.lower() == 'true')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="States retrieved", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"State {instance.name} retrieved", data=serializer.data)

    @action(detail=True, methods=['get'], url_path='districts')
    def districts(self, request, slug=None):
        state = self.get_object()
        qs = District.objects.filter(state=state).annotate(
            destinations_count=Count('destinations', distinct=True)
        ).order_by('name')
        if not (request.user and request.user.is_staff):
            qs = qs.filter(published=True)
        serializer = DistrictSerializer(qs, many=True)
        return api_response(success=True, message=f"Districts in {state.name} retrieved", data=serializer.data)

    @action(detail=True, methods=['get'], url_path='cities')
    def cities(self, request, slug=None):
        state = self.get_object()
        qs = City.objects.filter(state=state)
        if not (request.user and request.user.is_staff):
            qs = qs.filter(published=True)
        serializer = CityListSerializer(qs, many=True)
        return api_response(success=True, message=f"Cities in {state.name} retrieved", data=serializer.data)


class DistrictViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnlyPublished]
    serializer_class = DistrictSerializer
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'headquarters', 'description']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        qs = District.objects.select_related('state').annotate(
            destinations_count=Count('destinations', distinct=True)
        ).order_by('name')
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(published=True)
        state_slug = self.request.query_params.get('state')
        if state_slug:
            qs = qs.filter(Q(state__slug=state_slug) | Q(state__name__iexact=state_slug))
        return qs

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_val = self.kwargs.get(self.lookup_field) or self.kwargs.get('pk')
        if lookup_val.isdigit():
            obj = queryset.filter(id=int(lookup_val)).first()
        else:
            obj = queryset.filter(slug=lookup_val).first()
        if not obj:
            raise NotFound("District not found")
        self.check_object_permissions(self.request, obj)
        return obj

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Districts retrieved", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"District {instance.name} retrieved", data=serializer.data)



