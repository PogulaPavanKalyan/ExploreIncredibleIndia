from django.contrib import admin
from .models import State, District

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code', 'region', 'capital', 'is_union_territory', 'published', 'featured', 'created_at')
    list_filter = ('published', 'region', 'is_union_territory', 'featured')
    search_fields = ('name', 'capital', 'code')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'state', 'headquarters', 'published', 'created_at')
    list_filter = ('published', 'state')
    search_fields = ('name', 'headquarters', 'state__name')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)


