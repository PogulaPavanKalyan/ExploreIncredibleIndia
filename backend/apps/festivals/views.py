from rest_framework import viewsets, filters
from .models import Festival
from .serializers import FestivalSerializer
from apps.utils import StandardResultsSetPagination, api_response

class FestivalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Festival.objects.select_related('state', 'city').order_by('name')
    serializer_class = FestivalSerializer
    lookup_field = 'slug'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'state__name', 'month_celebrated']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        state_slug = request.query_params.get('state')
        if state_slug:
            queryset = queryset.filter(state__slug=state_slug)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Festivals retrieved", data=serializer.data)
