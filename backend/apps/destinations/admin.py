from django.contrib import admin
from .models import Destination, DestinationImage, DestinationVideo, Attraction, TravelTip, RecentlyViewed, HeroDestination

class DestinationImageInline(admin.TabularInline):
    model = DestinationImage
    extra = 1
    fields = ('image', 'caption', 'alt_text', 'is_primary', 'display_order')

class DestinationVideoInline(admin.TabularInline):
    model = DestinationVideo
    extra = 1
    fields = ('title', 'video_url', 'thumbnail', 'display_order', 'published')

class AttractionInline(admin.StackedInline):
    model = Attraction
    extra = 1
    prepopulated_fields = {'slug': ('name',)}
    fields = ('name', 'slug', 'category', 'image', 'ticket_price', 'opening_time', 'closing_time', 'published')

class TravelTipInline(admin.TabularInline):
    model = TravelTip
    extra = 1
    fields = ('title', 'description', 'display_order', 'published')

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'state', 'city', 'ticket_price', 'featured', 'trending', 'published', 'avg_rating', 'created_at')
    list_filter = ('published', 'featured', 'trending', 'state', 'categories', 'budget_level', 'travel_style')
    search_fields = ('name', 'short_description', 'description', 'state__name', 'city__name')
    prepopulated_fields = {'slug': ('name',)}
    autocomplete_fields = ['state', 'city']
    filter_horizontal = ('categories',)
    inlines = [DestinationImageInline, DestinationVideoInline, AttractionInline, TravelTipInline]
    ordering = ('name',)

@admin.register(DestinationImage)
class DestinationImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'destination', 'caption', 'is_primary', 'display_order', 'created_at')
    list_filter = ('is_primary', 'destination__state')
    search_fields = ('destination__name', 'caption', 'alt_text')
    ordering = ('destination', 'display_order')

@admin.register(DestinationVideo)
class DestinationVideoAdmin(admin.ModelAdmin):
    list_display = ('id', 'destination', 'title', 'published', 'display_order', 'created_at')
    list_filter = ('published', 'destination__state')
    search_fields = ('destination__name', 'title')

@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ('id', 'destination', 'name', 'category', 'ticket_price', 'published', 'created_at')
    list_filter = ('published', 'destination__state', 'category')
    search_fields = ('name', 'destination__name', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(TravelTip)
class TravelTipAdmin(admin.ModelAdmin):
    list_display = ('id', 'destination', 'title', 'published', 'display_order', 'created_at')
    list_filter = ('published', 'destination__state')
    search_fields = ('title', 'description', 'destination__name')

@admin.register(RecentlyViewed)
class RecentlyViewedAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'destination', 'viewed_at')
    list_filter = ('viewed_at',)
    search_fields = ('user__username', 'destination__name')

@admin.register(HeroDestination)
class HeroDestinationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'region', 'state_name', 'is_active', 'is_featured', 'display_order')
    list_filter = ('region', 'is_active', 'is_featured', 'transition_type')
    search_fields = ('title', 'subtitle', 'destination_name', 'state_name')
    ordering = ('display_order', 'region')

