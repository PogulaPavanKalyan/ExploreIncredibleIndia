from django.urls import path
from .journey_views import JourneyViewSet

urlpatterns = [
    path('destinations/', JourneyViewSet.as_view({'get': 'destinations'}), name='journey-destinations'),
    path('regions/', JourneyViewSet.as_view({'get': 'regions'}), name='journey-regions'),
    path('featured/', JourneyViewSet.as_view({'get': 'featured'}), name='journey-featured'),
]
