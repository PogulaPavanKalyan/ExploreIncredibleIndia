import csv
from decimal import Decimal
from django.contrib import admin, messages
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import (
    Destination, DestinationImage, DestinationVideo, DestinationHistory, 
    DestinationSource, Attraction, TravelTip, RecentlyViewed, HeroDestination,
    DestinationAuditLog, TravelCollection
)
from .importer import DestinationCSVImporter

# ═════════════════════════════════════════════════════════════════════════════
# INLINES
# ═════════════════════════════════════════════════════════════════════════════

class DestinationHistoryInline(admin.StackedInline):
    model = DestinationHistory
    can_delete = False
    extra = 0
    fieldsets = (
        ('Historical Overview', {
            'fields': ('short_history', 'detailed_history', 'architecture')
        }),
        ('Significance & Origins', {
            'fields': ('cultural_significance', 'religious_significance', 'ancient_history', 'medieval_history', 'modern_history')
        }),
        ('Verification & Sources', {
            'fields': ('source_name', 'source_url', 'verification_status')
        }),
    )

class DestinationImageInline(admin.TabularInline):
    model = DestinationImage
    extra = 1
    fields = ('image', 'image_url', 'caption', 'alt_text', 'is_primary', 'display_order')

class DestinationVideoInline(admin.TabularInline):
    model = DestinationVideo
    extra = 1
    fields = ('title', 'video_url', 'thumbnail_url', 'duration', 'video_type', 'source', 'is_primary', 'published', 'display_order')

class AttractionInline(admin.StackedInline):
    model = Attraction
    extra = 0
    prepopulated_fields = {'slug': ('name',)}
    fields = ('name', 'slug', 'category', 'image', 'ticket_price', 'opening_time', 'closing_time', 'published')

class TravelTipInline(admin.TabularInline):
    model = TravelTip
    extra = 0
    fields = ('title', 'description', 'display_order', 'published')

class DestinationSourceInline(admin.TabularInline):
    model = DestinationSource
    extra = 0
    fields = ('source_name', 'source_type', 'source_url', 'is_verified')

class DestinationAuditLogInline(admin.TabularInline):
    model = DestinationAuditLog
    extra = 0
    can_delete = False
    readonly_fields = ('action', 'changed_by', 'change_summary', 'created_at')
    fields = ('action', 'changed_by', 'change_summary', 'created_at')


# ═════════════════════════════════════════════════════════════════════════════
# DESTINATION ADMIN WITH ADVANCED BULK MANAGEMENT & DASHBOARD
# ═════════════════════════════════════════════════════════════════════════════

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    change_list_template = "admin/destinations/destination/change_list.html"

    list_display = (
        'name', 'city', 'state', 'region', 
        'category_badges', 'completeness_progress',
        'content_status_badge', 'video_status_badge', 'history_status_badge', 
        'verification_badge', 'featured', 'updated_at'
    )
    list_filter = (
        'content_status', 'published', 'featured', 'verification_status', 
        'region', 'state', 'district', 'city',
        'pilgrimage_collection', 'trekking_difficulty', 'budget_level'
    )
    search_fields = (
        'name', 'slug', 'city__name', 'district', 'state__name', 
        'description', 'short_description', 'famous_for', 'tags__name'
    )
    prepopulated_fields = {'slug': ('name',)}
    autocomplete_fields = ['state', 'city']
    filter_horizontal = ('categories', 'activities', 'tags')
    
    inlines = [
        DestinationHistoryInline,
        DestinationImageInline,
        DestinationVideoInline,
        AttractionInline,
        TravelTipInline,
        DestinationSourceInline,
        DestinationAuditLogInline,
    ]

    actions = [
        'publish_selected', 'unpublish_selected',
        'mark_featured', 'remove_featured',
        'mark_verified', 'remove_verified',
        'export_as_csv'
    ]

    fieldsets = (
        ('BASIC INFORMATION', {
            'fields': (
                ('name', 'slug'),
                'short_description',
                'description',
                'main_image',
            )
        }),
        ('LOCATION & COORDINATES', {
            'fields': (
                ('region_obj', 'region'),
                ('state', 'district_obj', 'district'),
                'city',
                ('latitude', 'longitude'),
            )
        }),
        ('CLASSIFICATION', {
            'fields': (
                'categories',
                'activities',
                'tags',
                ('pilgrimage_collection', 'jyotirlinga_number'),
            )
        }),
        ('TRAVEL INFORMATION', {
            'fields': (
                ('best_time_to_visit', 'ideal_duration', 'recommended_duration'),
                ('budget_level', 'ticket_price'),
                ('opening_time', 'closing_time'),
                'famous_for',
                'things_to_do',
                ('trekking_difficulty', 'trip_duration_type'),
            )
        }),
        ('TRAVEL ACCESS & TRANSIT', {
            'fields': (
                ('nearest_airport', 'nearest_railway'),
                ('nearest_bus_station', 'how_to_reach'),
            )
        }),
        ('STATUS & AUDIT', {
            'fields': (
                ('published', 'featured', 'trending'),
                ('verification_status', 'is_hidden_gem'),
                ('popularity_score', 'data_completeness_score'),
            )
        }),
    )

    # ── Custom Admin URLs for Bulk Import & Quality Dashboard ─────────────────
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('import-csv/', self.admin_site.admin_view(self.import_csv_view), name='destinations_import_csv'),
            path('quality-dashboard/', self.admin_site.admin_view(self.quality_dashboard_view), name='destinations_quality_dashboard'),
        ]
        return custom_urls + urls

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        # Compute Quick Data Quality Metrics for the admin banner
        total_dests = Destination.objects.count()
        no_images = Destination.objects.filter(images__isnull=True).count()
        no_videos = Destination.objects.filter(videos__isnull=True).count()
        no_history = Destination.objects.filter(history__isnull=True).count()
        no_coords = Destination.objects.filter(Q(latitude__isnull=True) | Q(longitude__isnull=True)).count()
        unpublished = Destination.objects.filter(published=False).count()
        unverified = Destination.objects.filter(verification_status='unverified').count()

        extra_context['metrics'] = {
            'total': total_dests,
            'no_images': no_images,
            'no_videos': no_videos,
            'no_history': no_history,
            'no_coords': no_coords,
            'unpublished': unpublished,
            'unverified': unverified,
        }
        return super().changelist_view(request, extra_context=extra_context)

    # ── CSV Import View (2-Step Validation & Preview) ─────────────────────────
    def import_csv_view(self, request):
        if request.method == 'POST':
            if 'confirm_import' in request.POST:
                # Step 2: Confirmation & Execution
                raw_csv = request.session.get('pending_csv_data')
                if not raw_csv:
                    messages.error(request, "Import session expired. Please re-upload CSV.")
                    return redirect('..')

                importer = DestinationCSVImporter(raw_csv)
                val_res = importer.validate()
                import_res = importer.execute_import(val_res['valid_rows'])

                # Clear session
                request.session.pop('pending_csv_data', None)
                messages.success(
                    request, 
                    f"Successfully imported {import_res['total_imported']} destinations (Created: {import_res['created_count']}, Updated: {import_res['updated_count']})."
                )
                return redirect('..')

            # Step 1: Upload & Validate Preview
            csv_file = request.FILES.get('csv_file')
            if not csv_file:
                messages.error(request, "Please select a CSV file to upload.")
                return redirect(request.path)

            content = csv_file.read().decode('utf-8-sig', errors='replace')
            request.session['pending_csv_data'] = content

            importer = DestinationCSVImporter(content)
            validation_result = importer.validate()

            context = {
                **self.admin_site.each_context(request),
                'title': 'Bulk Destination CSV Import — Preview & Validation',
                'validation': validation_result,
                'has_valid_rows': validation_result['valid_count'] > 0,
            }
            return render(request, 'admin/destinations/destination/import_preview.html', context)

        context = {
            **self.admin_site.each_context(request),
            'title': 'Upload Bulk Destination CSV',
        }
        return render(request, 'admin/destinations/destination/import_upload.html', context)

    # ── Quality Dashboard View ───────────────────────────────────────────────
    def quality_dashboard_view(self, request):
        total = Destination.objects.count()
        destinations = Destination.objects.select_related('state', 'city').prefetch_related('images', 'videos').all()
        
        breakdown = []
        for d in destinations:
            score = d.calculate_completeness_score()
            breakdown.append({
                'destination': d,
                'score': score,
                'has_image': d.images.exists() or bool(d.main_image),
                'has_video': d.videos.filter(published=True).exists(),
                'has_history': hasattr(d, 'history') and bool(d.history.short_history),
                'has_coords': bool(d.latitude and d.longitude),
            })
        
        breakdown.sort(key=lambda x: x['score'])

        context = {
            **self.admin_site.each_context(request),
            'title': 'Destination Data Quality & Completeness Dashboard',
            'total': total,
            'destinations': breakdown,
        }
        return render(request, 'admin/destinations/destination/quality_dashboard.html', context)

    # ── Bulk Actions ─────────────────────────────────────────────────────────
    def publish_selected(self, request, queryset):
        updated = queryset.update(published=True)
        self.message_user(request, f"Published {updated} destination(s).", messages.SUCCESS)
    publish_selected.short_description = "✓ Publish selected destinations"

    def unpublish_selected(self, request, queryset):
        updated = queryset.update(published=False)
        self.message_user(request, f"Unpublished {updated} destination(s).", messages.WARNING)
    unpublish_selected.short_description = "✗ Unpublish selected destinations"

    def mark_featured(self, request, queryset):
        updated = queryset.update(featured=True)
        self.message_user(request, f"Marked {updated} destination(s) as featured.", messages.SUCCESS)
    mark_featured.short_description = "★ Mark as Featured"

    def remove_featured(self, request, queryset):
        updated = queryset.update(featured=False)
        self.message_user(request, f"Removed featured status from {updated} destination(s).", messages.INFO)
    remove_featured.short_description = "☆ Remove Featured status"

    def mark_verified(self, request, queryset):
        updated = queryset.update(verification_status='verified')
        self.message_user(request, f"Marked {updated} destination(s) as verified.", messages.SUCCESS)
    mark_verified.short_description = "🛡️ Mark as Verified"

    def remove_verified(self, request, queryset):
        updated = queryset.update(verification_status='unverified')
        self.message_user(request, f"Marked {updated} destination(s) as unverified.", messages.INFO)
    remove_verified.short_description = "⚠️ Remove Verified status"

    def export_as_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="destinations_export.csv"'
        writer = csv.writer(response)

        headers = [
            'name', 'slug', 'region', 'state', 'district', 'city',
            'short_description', 'latitude', 'longitude', 'best_time_to_visit',
            'recommended_duration', 'budget_level', 'categories', 'featured', 'verified', 'published'
        ]
        writer.writerow(headers)

        for d in queryset.select_related('state', 'city', 'region_obj').prefetch_related('categories'):
            cats = ", ".join([c.name for c in d.categories.all()])
            writer.writerow([
                d.name,
                d.slug,
                d.region_obj.name if d.region_obj else d.region,
                d.state.name if d.state else '',
                d.district or '',
                d.city.name if d.city else '',
                d.short_description,
                d.latitude or '',
                d.longitude or '',
                d.best_time_to_visit or '',
                d.recommended_duration or '',
                d.budget_level or '',
                cats,
                'True' if d.featured else 'False',
                d.verification_status,
                'True' if d.published else 'False'
            ])
        return response
    export_as_csv.short_description = "📥 Export selected to CSV"

    # ── Display Badges ────────────────────────────────────────────────────────
    def category_badges(self, obj):
        cats = obj.categories.all()[:2]
        if not cats:
            return "—"
        badges = [f'<span style="background:rgba(255,107,26,0.15);color:#ea580c;padding:2px 6px;border-radius:6px;font-size:0.75rem;font-weight:700;margin-right:3px;">{c.name}</span>' for c in cats]
        return format_html("".join(badges))
    category_badges.short_description = "Categories"

    def completeness_progress(self, obj):
        score = obj.calculate_completeness_score()
        color = "#10b981" if score >= 85 else "#f59e0b" if score >= 60 else "#ef4444"
        filled_bars = int(score / 10)
        empty_bars = 10 - filled_bars
        bar_str = "█" * filled_bars + "░" * empty_bars
        return format_html(
            '<div title="{}% Complete" style="font-family:monospace;font-size:0.85rem;color:{};">'
            '<b>{}</b> <span style="font-size:0.75rem;color:#64748b;">{}%</span>'
            '</div>',
            score, color, bar_str, score
        )
    completeness_progress.short_description = "Completeness"

    def content_status_badge(self, obj):
        status_colors = {
            'published': ('#10b981', 'rgba(16,185,129,0.1)', 'Published'),
            'review': ('#f59e0b', 'rgba(245,158,11,0.1)', 'Review'),
            'draft': ('#94a3b8', 'rgba(148,163,184,0.1)', 'Draft'),
            'unpublished': ('#ef4444', 'rgba(239,68,68,0.1)', 'Unpublished'),
            'archived': ('#64748b', 'rgba(100,116,139,0.1)', 'Archived'),
        }
        color, bg, label = status_colors.get(obj.content_status, ('#94a3b8', 'rgba(148,163,184,0.1)', obj.content_status))
        return format_html(
            '<span style="color:{};background:{};font-weight:800;font-size:0.75rem;padding:3px 8px;border-radius:10px;text-transform:uppercase;">{}</span>',
            color, bg, label
        )
    content_status_badge.short_description = "Status"

    def video_status_badge(self, obj):
        if obj.videos.filter(published=True).exists():
            count = obj.videos.filter(published=True).count()
            return format_html(
                '<span style="color:#10b981;font-weight:700;background:rgba(16,185,129,0.1);padding:3px 8px;border-radius:12px;">✓ Video ({})</span>',
                count
            )
        return format_html(
            '<span style="color:#ef4444;font-weight:700;background:rgba(239,68,68,0.1);padding:3px 8px;border-radius:12px;">✗ Missing</span>'
        )
    video_status_badge.short_description = "Video"

    def history_status_badge(self, obj):
        if hasattr(obj, 'history') and bool(obj.history.short_history):
            return format_html(
                '<span style="color:#10b981;font-weight:700;background:rgba(16,185,129,0.1);padding:3px 8px;border-radius:12px;">✓ History</span>'
            )
        return format_html(
            '<span style="color:#ef4444;font-weight:700;background:rgba(239,68,68,0.1);padding:3px 8px;border-radius:12px;">✗ Missing</span>'
        )
    history_status_badge.short_description = "History"

    def verification_badge(self, obj):
        color = "#10b981" if obj.verification_status == 'verified' else "#f59e0b"
        return format_html(
            '<span style="color:{};font-weight:700;text-transform:uppercase;font-size:0.78rem;">{}</span>',
            color, obj.get_verification_status_display()
        )
    verification_badge.short_description = "Verification"


# ═════════════════════════════════════════════════════════════════════════════
# OTHER MODELS REGISTRATION
# ═════════════════════════════════════════════════════════════════════════════

@admin.register(DestinationHistory)
class DestinationHistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'destination', 'source_name', 'verification_status', 'last_verified_at')
    list_filter = ('verification_status', 'source_name')
    search_fields = ('destination__name', 'short_history', 'detailed_history', 'architecture')

@admin.register(DestinationVideo)
class DestinationVideoAdmin(admin.ModelAdmin):
    list_display = ('id', 'destination', 'title', 'video_type', 'duration', 'is_primary', 'published', 'created_at')
    list_filter = ('video_type', 'is_primary', 'published', 'destination__state')
    search_fields = ('destination__name', 'title', 'source')

@admin.register(DestinationImage)
class DestinationImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'destination', 'caption', 'is_primary', 'display_order', 'created_at')
    list_filter = ('is_primary', 'destination__state')
    search_fields = ('destination__name', 'caption', 'alt_text')
    ordering = ('destination', 'display_order')

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


@admin.register(TravelCollection)
class TravelCollectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'category', 'destinations_count', 'featured', 'display_order', 'published', 'updated_at')
    list_filter = ('published', 'featured', 'category')
    search_fields = ('name', 'slug', 'description', 'subtitle')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('destinations',)
    ordering = ('display_order', 'name')

    def destinations_count(self, obj):
        return obj.destinations.count()
    destinations_count.short_description = "Destinations"
