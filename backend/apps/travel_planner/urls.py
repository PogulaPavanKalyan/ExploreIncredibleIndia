from django.urls import path
from .views import TravelPlannerGenerateView

urlpatterns = [
    path('generate/', TravelPlannerGenerateView.as_view(), name='travel_planner_generate'),
]
