from rest_framework import viewsets, filters
from django.db.models import Count
from .models import Experience
from .serializers import ExperienceSerializer
from apps.utils import StandardResultsSetPagination, api_response, IsAdminOrReadOnlyPublished

class ExperienceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnlyPublished]
    serializer_class = ExperienceSerializer
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['display_order', 'name', 'created_at']

    def get_queryset(self):
        qs = Experience.objects.annotate(
            destination_count=Count('featured_destinations', distinct=True)
        ).order_by('display_order', 'name')
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Experiences retrieved", data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, message=f"Experience {instance.name} retrieved", data=serializer.data)
