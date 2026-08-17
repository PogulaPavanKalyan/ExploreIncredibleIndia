from django.contrib import admin
from .models import TravelGuide

@admin.register(TravelGuide)
class TravelGuideAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'state', 'city', 'author', 'is_published', 'published_at')
    list_filter = ('is_published', 'published_at', 'state')
    search_fields = ('title', 'content', 'author')
    prepopulated_fields = {'slug': ('title',)}
