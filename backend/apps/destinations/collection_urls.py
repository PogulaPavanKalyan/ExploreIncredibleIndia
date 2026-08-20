from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TravelCollectionViewSet

router = DefaultRouter()
router.register('', TravelCollectionViewSet, basename='travel-collection')

urlpatterns = [
    path('', include(router.urls)),
]
