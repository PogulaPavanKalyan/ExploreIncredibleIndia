from rest_framework.routers import DefaultRouter
from .views import FestivalViewSet

router = DefaultRouter()
router.register('', FestivalViewSet, basename='festival')

urlpatterns = router.urls
