from django.contrib import admin
from .models import Hotel

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'city', 'star_rating', 'price_per_night', 'created_at')
    list_filter = ('star_rating', 'city')
    search_fields = ('name', 'address', 'city__name')
