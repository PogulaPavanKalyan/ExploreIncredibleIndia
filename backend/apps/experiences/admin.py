from django.contrib import admin
from .models import Experience

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_order', 'is_active', 'destination_count')
    list_editable = ('display_order', 'is_active')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('featured_destinations',)

    def destination_count(self, obj):
        return obj.featured_destinations.count()
    destination_count.short_description = 'Destinations'
