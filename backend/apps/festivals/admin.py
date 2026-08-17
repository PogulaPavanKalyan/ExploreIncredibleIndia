from django.contrib import admin
from .models import Festival

@admin.register(Festival)
class FestivalAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'state', 'city', 'month_celebrated', 'created_at')
    list_filter = ('state', 'month_celebrated')
    search_fields = ('name', 'description', 'state__name')
    prepopulated_fields = {'slug': ('name',)}
