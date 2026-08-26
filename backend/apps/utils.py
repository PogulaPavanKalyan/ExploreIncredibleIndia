import os
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

def validate_latitude(value):
    if value is not None and (value < -90 or value > 90):
        raise ValidationError('Latitude must be between -90 and 90 degrees.')

def validate_longitude(value):
    if value is not None and (value < -180 or value > 180):
        raise ValidationError('Longitude must be between -180 and 180 degrees.')

def validate_image_file(file):
    if hasattr(file, 'size') and file.size > 5 * 1024 * 1024:
        raise ValidationError('Image file size cannot exceed 5MB.')
    if hasattr(file, 'name') and file.name:
        ext = os.path.splitext(file.name)[1].lower()
        valid_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
        if ext and ext not in valid_extensions:
            raise ValidationError(f'Unsupported file extension {ext}. Allowed: {", ".join(valid_extensions)}')

from rest_framework import permissions

class IsAdminOrReadOnlyPublished(permissions.BasePermission):
    """
    Custom permission to allow public read-only access to published objects,
    while allowing admin users full access (including unpublished objects and write operations).
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or getattr(request.user, 'role', '') == 'admin' or request.user.is_superuser))

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            if getattr(obj, 'published', True):
                return True
            return bool(request.user and request.user.is_authenticated and (request.user.is_staff or getattr(request.user, 'role', '') == 'admin' or request.user.is_superuser))
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or getattr(request.user, 'role', '') == 'admin' or request.user.is_superuser))

def api_response(success=True, message="", data=None, status_code=status.HTTP_200_OK, pagination=None):

    payload = {
        "success": success,
        "message": message,
        "data": data if data is not None else {}
    }
    if pagination:
        payload["pagination"] = pagination
    return Response(payload, status=status_code)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            "success": True,
            "message": "Data retrieved successfully",
            "data": data,
            "pagination": {
                "page": self.page.number,
                "page_size": self.get_page_size(self.request),
                "total": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages
            }
        })

