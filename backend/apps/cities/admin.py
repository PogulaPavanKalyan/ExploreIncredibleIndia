from django.contrib import admin
from .models import City

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'state', 'published', 'is_popular', 'latitude', 'longitude', 'created_at')
    list_filter = ('published', 'state', 'is_popular')
    search_fields = ('name', 'state__name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    autocomplete_fields = ['state']
    ordering = ('name',)

