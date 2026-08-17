from rest_framework import viewsets, permissions
from apps.regions.models import Region
from apps.regions.serializers import RegionSerializer
from apps.utils import api_response

class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for Regions
    """
    queryset = Region.objects.all().order_by('display_order')
    serializer_class = RegionSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(data=serializer.data)
