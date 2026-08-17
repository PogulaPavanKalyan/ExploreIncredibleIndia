from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.regions.views import RegionViewSet

router = DefaultRouter()
router.register(r'', RegionViewSet, basename='region')

urlpatterns = [
    path('', include(router.urls)),
]
