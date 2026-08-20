from rest_framework.routers import DefaultRouter
from .views import StateViewSet, DistrictViewSet

router = DefaultRouter()
router.register('districts', DistrictViewSet, basename='district')
router.register('', StateViewSet, basename='state')

urlpatterns = router.urls

