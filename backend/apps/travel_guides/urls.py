from rest_framework.routers import DefaultRouter
from .views import StoryViewSet, TravelGuideViewSet, LocalGuideViewSet

router = DefaultRouter()
router.register('stories', StoryViewSet, basename='story')
router.register('local-guides', LocalGuideViewSet, basename='local_guide')
router.register('guides', TravelGuideViewSet, basename='travel_guide')
router.register('', StoryViewSet, basename='default_story')

urlpatterns = router.urls
