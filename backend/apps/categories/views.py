from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from django.db.models import Count
from .models import Category, Activity, Tag
from .serializers import CategorySerializer, ActivitySerializer, TagSerializer
from apps.destinations.models import Destination
from apps.destinations.serializers import DestinationListSerializer
from apps.utils import StandardResultsSetPagination, api_response, IsAdminOrReadOnlyPublished

class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnlyPublished]
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'destinations_count', 'created_at']

    def get_queryset(self):
        qs = Category.objects.annotate(
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
            raise NotFound("Category not found")
        self.check_object_permissions(self.request, obj)
        return obj

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Categories retrieved", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"Category {instance.name} retrieved", data=serializer.data)

    @action(detail=True, methods=['get'], url_path='places')
    def places(self, request, slug=None):
        category = self.get_object()
        qs = Destination.objects.filter(categories=category).select_related('state', 'city', 'region_obj').prefetch_related('categories', 'activities', 'tags')
        if not (request.user and request.user.is_staff):
            qs = qs.filter(published=True)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = DestinationListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = DestinationListSerializer(qs, many=True)
        return api_response(success=True, message=f"Places in category {category.name} retrieved", data=serializer.data)


class ActivityViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnlyPublished]
    serializer_class = ActivitySerializer
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'destinations_count', 'created_at']

    def get_queryset(self):
        qs = Activity.objects.annotate(
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
            raise NotFound("Activity not found")
        self.check_object_permissions(self.request, obj)
        return obj

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Activities retrieved", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"Activity {instance.name} retrieved", data=serializer.data)

    @action(detail=True, methods=['get'], url_path='places')
    def places(self, request, slug=None):
        activity = self.get_object()
        qs = Destination.objects.filter(activities=activity).select_related('state', 'city', 'region_obj').prefetch_related('categories', 'activities', 'tags')
        if not (request.user and request.user.is_staff):
            qs = qs.filter(published=True)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = DestinationListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = DestinationListSerializer(qs, many=True)
        return api_response(success=True, message=f"Places for activity {activity.name} retrieved", data=serializer.data)


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAdminOrReadOnlyPublished]
    serializer_class = TagSerializer
    lookup_field = 'slug'
    queryset = Tag.objects.all().order_by('name')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Tags retrieved", data=serializer.data)


