from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/auth/', include('apps.users.urls')),
    path('api/states/', include('apps.states.urls')),
    path('api/cities/', include('apps.cities.urls')),
    path('api/categories/', include('apps.categories.urls')),
    path('api/places/', include('apps.destinations.urls')),
    path('api/search/', include('apps.destinations.search_urls')),
    path('api/journey/', include('apps.destinations.journey_urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/favorites/', include('apps.favorites.urls')),
    path('api/itineraries/', include('apps.itineraries.urls')),
    path('api/travel-guides/', include('apps.travel_guides.urls')),
    path('api/hotels/', include('apps.hotels.urls')),
    path('api/restaurants/', include('apps.restaurants.urls')),
    path('api/festivals/', include('apps.festivals.urls')),
    path('api/travel-planner/', include('apps.travel_planner.urls')),
    path('api/experiences/', include('apps.experiences.urls')),
    path('api/regions/', include('apps.regions.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
