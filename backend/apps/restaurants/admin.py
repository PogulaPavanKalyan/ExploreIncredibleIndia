from django.contrib import admin
from .models import Restaurant

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'city', 'cuisine_type', 'avg_cost_for_two', 'rating', 'created_at')
    list_filter = ('cuisine_type', 'city')
    search_fields = ('name', 'cuisine_type', 'address', 'city__name')
