from django.urls import path
from .views import GlobalSearchView, BudgetPlannerEstimateView

urlpatterns = [
    path('', GlobalSearchView.as_view(), name='global_search_root'),
    path('budget-estimate/', BudgetPlannerEstimateView.as_view(), name='budget_estimate'),
]
