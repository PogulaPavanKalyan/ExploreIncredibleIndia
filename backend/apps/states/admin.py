from django.contrib import admin
from .models import State

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code', 'capital', 'is_union_territory', 'published', 'featured', 'created_at')
    list_filter = ('published', 'is_union_territory', 'featured')
    search_fields = ('name', 'capital', 'code')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)

