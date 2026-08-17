from rest_framework.routers import DefaultRouter
from .views import TravelGuideViewSet, LocalGuideViewSet

router = DefaultRouter()
router.register('local-guides', LocalGuideViewSet, basename='local_guide')
router.register('', TravelGuideViewSet, basename='travel_guide')

urlpatterns = router.urls
