from django.contrib import admin
from .models import Itinerary, ItineraryDay, ItineraryPlace

class ItineraryPlaceInline(admin.TabularInline):
    model = ItineraryPlace
    extra = 1

class ItineraryDayInline(admin.StackedInline):
    model = ItineraryDay
    extra = 1

@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'starting_location', 'duration_days', 'estimated_budget', 'is_public', 'created_at')
    list_filter = ('duration_days', 'is_public', 'created_at')
    search_fields = ('title', 'user__username', 'description', 'starting_location')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ItineraryDayInline]
