from django.urls import path
from .views import GlobalSearchView, AutocompleteSearchView, AIQuerySearchView, BudgetPlannerEstimateView

urlpatterns = [
    path('', GlobalSearchView.as_view(), name='global_search_root'),
    path('autocomplete/', AutocompleteSearchView.as_view(), name='search_autocomplete'),
    path('ai-intent/', AIQuerySearchView.as_view(), name='search_ai_intent'),
    path('budget-estimate/', BudgetPlannerEstimateView.as_view(), name='budget_estimate'),
]
