from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ActivityViewSet, TagViewSet

router = DefaultRouter()
router.register('activities', ActivityViewSet, basename='activity')
router.register('tags', TagViewSet, basename='tag')
router.register('', CategoryViewSet, basename='category')

urlpatterns = router.urls

