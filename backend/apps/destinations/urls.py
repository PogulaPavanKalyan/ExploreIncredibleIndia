from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DestinationViewSet, GlobalSearchView, HeroDestinationViewSet

router = DefaultRouter()
router.register('hero', HeroDestinationViewSet, basename='hero')
router.register('', DestinationViewSet, basename='destination')

urlpatterns = [
    path('search/', GlobalSearchView.as_view(), name='global_search'),
    path('', include(router.urls)),
]
