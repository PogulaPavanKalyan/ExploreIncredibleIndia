from rest_framework import viewsets, permissions, status
from .models import Favorite
from .serializers import FavoriteSerializer
from apps.utils import StandardResultsSetPagination, api_response

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Favorite.objects.select_related('destination', 'destination__state', 'destination__category').filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Favorites retrieved", data=serializer.data)

    def create(self, request, *args, **kwargs):
        destination_id = request.data.get('destination')
        if not destination_id:
            return api_response(success=False, message="Destination is required", status_code=status.HTTP_400_BAD_REQUEST)

        fav, created = Favorite.objects.get_or_create(
            user=request.user,
            destination_id=destination_id
        )
        if not created:
            return api_response(success=True, message="Already in favorites", data=FavoriteSerializer(fav).data)

        return api_response(
            success=True,
            message="Added to favorites",
            data=FavoriteSerializer(fav).data,
            status_code=status.HTTP_201_CREATED
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(success=True, message="Removed from favorites")
