from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from .models import Review
from .serializers import ReviewSerializer
from apps.utils import StandardResultsSetPagination, api_response

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = Review.objects.select_related('user', 'destination').filter(is_approved=True)
        dest_slug = self.request.query_params.get('destination')
        if dest_slug:
            queryset = queryset.filter(destination__slug=dest_slug)
        user_id = self.request.query_params.get('user')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset

    def get_permissions(self):
        return [permissions.AllowAny()]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, message="Reviews retrieved", data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = request.user if (request.user and request.user.is_authenticated) else None
            review = serializer.save(user=user)
            return api_response(
                success=True,
                message="Review submitted successfully.",
                data=self.get_serializer(review).data,
                status_code=status.HTTP_201_CREATED
            )
        return api_response(
            success=False,
            message="Validation error",
            data=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['post'], url_path='helpful')
    def mark_helpful(self, request, pk=None):
        review = self.get_object()
        review.helpful_count += 1
        review.save(update_fields=['helpful_count'])
        return api_response(success=True, message="Marked as helpful", data={'helpful_count': review.helpful_count})

    @action(detail=True, methods=['post'], url_path='report')
    def report_review(self, request, pk=None):
        review = self.get_object()
        review.is_reported = True
        review.save(update_fields=['is_reported'])
        return api_response(success=True, message="Review reported for moderation")

