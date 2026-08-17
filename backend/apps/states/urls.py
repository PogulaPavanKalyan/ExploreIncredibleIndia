from rest_framework.routers import DefaultRouter
from .views import StateViewSet

router = DefaultRouter()
router.register('', StateViewSet, basename='state')

urlpatterns = router.urls
