from django.db import models
from django.utils.text import slugify
from django.conf import settings
from django.core.validators import MinValueValidator
from apps.states.models import State
from apps.cities.models import City
from apps.categories.models import Category
from apps.utils import validate_latitude, validate_longitude, validate_image_file

class Destination(models.Model):
    BUDGET_CHOICES = (
        ('low', 'Budget / Low'),
        ('medium', 'Moderate / Medium'),
        ('high', 'Luxury / High'),
    )
    TRAVEL_STYLE_CHOICES = (
        ('family', 'Family'),
        ('couple', 'Couple / Romantic'),
        ('solo', 'Solo Explorer'),
        ('adventure', 'Adventure'),
        ('spiritual', 'Spiritual'),
        ('nature', 'Nature'),
        ('historical', 'Historical'),
        ('cultural', 'Cultural'),
        ('beach', 'Beach'),
        ('wildlife', 'Wildlife'),
    )
    REGION_CHOICES = (
        ('south-india', 'South India'),
        ('north-india', 'North India'),
        ('west-india', 'West India'),
        ('east-india', 'East India'),
        ('central-india', 'Central India'),
        ('northeast-india', 'Northeast India'),
    )
    PILGRIMAGE_COLLECTION_CHOICES = (
        ('jyotirlinga', '12 Jyotirlingas'),
        ('char_dham', 'Maha Char Dham'),
        ('chota_char_dham', 'Chota Char Dham (Uttarakhand)'),
        ('shakti_peetha', '51 Shakti Peethas'),
        ('buddhist_circuit', 'Buddhist Heritage Circuit'),
        ('sikh_pilgrimage', 'Sikh Historical Gurudwaras'),
        ('jain_tirth', 'Jain Tirthankar Sites'),
        ('panch_kedar', 'Panch Kedar'),
        ('panch_prayag', 'Panch Prayag'),
        ('divya_desam', '108 Divya Desams'),
        ('none', 'General Destination'),
    )
    VERIFICATION_CHOICES = (
        ('verified', '100% Verified'),
        ('needs_verification', 'Needs Verification'),
        ('incomplete', 'Incomplete Data'),
        ('outdated', 'Outdated Info'),
    )
    TREKKING_DIFFICULTY_CHOICES = (
        ('easy', 'Easy / Beginner'),
        ('moderate', 'Moderate'),
        ('difficult', 'Difficult / Challenging'),
        ('expert', 'Expert / Extreme'),
        ('none', 'Not Applicable'),
    )
    DURATION_CHOICES = (
        ('half_day', 'Half Day (2-4 hrs)'),
        ('1_day', '1 Day Trip'),
        ('weekend', 'Weekend Getaway (2 Days)'),
        ('multi_day', 'Extended Multi-Day Trip'),
    )
    SEASON_CHOICES = (
        ('all_year', 'All Year Round'),
        ('monsoon', 'Monsoon (Jul-Sep)'),
        ('winter', 'Winter (Oct-Feb)'),
        ('summer', 'Summer (Mar-Jun)'),
    )

    CONTENT_STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('review', 'Admin Review'),
        ('published', 'Published'),
        ('unpublished', 'Unpublished'),
        ('archived', 'Archived'),
    )
    SOURCE_TYPE_CHOICES = (
        ('tourism_board', 'Official Tourism Board'),
        ('government', 'Government Portal'),
        ('temple_trust', 'Temple / Religious Trust'),
        ('national_park', 'National Park Authority'),
        ('local_authority', 'Local Tourism Authority'),
        ('contributor', 'Original Contributor'),
        ('licensed', 'Licensed Source / Public Domain'),
    )

    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=220, unique=True, db_index=True, blank=True)
    region_obj = models.ForeignKey('regions.Region', on_delete=models.SET_NULL, null=True, blank=True, related_name='destinations', db_index=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='destinations', db_index=True)
    district_obj = models.ForeignKey('states.District', on_delete=models.SET_NULL, null=True, blank=True, related_name='destinations', db_index=True)
    district = models.CharField(max_length=150, blank=True, default='', db_index=True, help_text="Official Revenue District (e.g. Tirupati, Puri, Rudraprayag)")
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True, related_name='destinations', db_index=True)
    region = models.CharField(max_length=30, choices=REGION_CHOICES, default='south-india', db_index=True)
    pilgrimage_collection = models.CharField(max_length=40, choices=PILGRIMAGE_COLLECTION_CHOICES, default='none', db_index=True)
    jyotirlinga_number = models.PositiveIntegerField(null=True, blank=True, help_text="Number 1 to 12 if part of 12 Jyotirlingas")

    categories = models.ManyToManyField(Category, related_name='destinations', blank=True)
    activities = models.ManyToManyField('categories.Activity', related_name='destinations', blank=True)
    tags = models.ManyToManyField('categories.Tag', related_name='destinations', blank=True)
    trekking_difficulty = models.CharField(max_length=20, choices=TREKKING_DIFFICULTY_CHOICES, default='none', db_index=True)
    trip_duration_type = models.CharField(max_length=20, choices=DURATION_CHOICES, default='1_day', db_index=True)
    ideal_season = models.CharField(max_length=20, choices=SEASON_CHOICES, default='all_year', db_index=True)
    short_description = models.TextField(blank=True, default='', null=True)
    description = models.TextField(default='')
    famous_for = models.CharField(max_length=300, blank=True, default='', help_text="One-liner: Why this place is internationally famous")
    things_to_do = models.TextField(blank=True, default='', help_text="Top experiences and activities")
    best_time_to_visit = models.CharField(max_length=200, blank=True, default='', null=True)
    ideal_duration = models.CharField(max_length=100, blank=True, default='', null=True)
    recommended_duration = models.CharField(max_length=100, blank=True, default='', null=True)

    temple_deity = models.CharField(max_length=150, blank=True, default='', help_text="Presiding Deity (e.g. Lord Venkateswara, Lord Shiva)")
    spiritual_tradition = models.CharField(max_length=150, blank=True, default='', help_text="Tradition (e.g. Vaishnavism, Shaivism, Shakta, Vajrayana)")
    temple_architecture = models.CharField(max_length=150, blank=True, default='', help_text="Style (e.g. Dravidian, Nagara, Kalinga, Vesara)")

    opening_time = models.CharField(max_length=100, blank=True, default='', null=True)
    closing_time = models.CharField(max_length=100, blank=True, default='', null=True)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    budget_level = models.CharField(max_length=20, choices=BUDGET_CHOICES, default='medium', db_index=True)
    travel_style = models.CharField(max_length=30, choices=TRAVEL_STYLE_CHOICES, default='cultural', db_index=True)

    nearest_airport = models.CharField(max_length=200, blank=True, default='', help_text="Airport name + distance (e.g. Tirupati Airport (TIR) - 15 km)")
    nearest_railway = models.CharField(max_length=200, blank=True, default='', help_text="Railway station + distance (e.g. Tirupati Main (TPTY) - 2 km)")
    nearest_bus_station = models.CharField(max_length=200, blank=True, default='')
    safety_info = models.TextField(blank=True, default='', help_text="Security guidelines, emergency contacts, local protocols")
    weather_info = models.TextField(blank=True, default='', help_text="Seasonal temperature and monsoon alerts")
    suitable_for_tags = models.CharField(max_length=255, blank=True, default='', help_text="Comma-separated e.g. beginners, families, photography, camping")

    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True, validators=[validate_latitude])
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True, validators=[validate_longitude])

    main_image = models.URLField(max_length=600, blank=True, null=True, default='', help_text="Direct verified CDN/Unsplash URL")
    featured = models.BooleanField(default=False, db_index=True)
    trending = models.BooleanField(default=False, db_index=True)
    is_hidden_gem = models.BooleanField(default=False, db_index=True)
    published = models.BooleanField(default=True, db_index=True)
    content_status = models.CharField(max_length=20, choices=CONTENT_STATUS_CHOICES, default='published', db_index=True)

    verification_status = models.CharField(max_length=30, choices=VERIFICATION_CHOICES, default='verified', db_index=True)
    data_completeness_score = models.PositiveIntegerField(default=95, help_text="Percentage 0-100% based on data points present")
    source_name = models.CharField(max_length=200, blank=True, default="Incredible India / Official State Tourism")
    source_type = models.CharField(max_length=40, choices=SOURCE_TYPE_CHOICES, default='tourism_board', blank=True)
    source_url = models.URLField(max_length=600, blank=True, null=True)

    popularity_score = models.PositiveIntegerField(default=85)
    total_reviews = models.PositiveIntegerField(default=0)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.80)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-popularity_score', '-avg_rating', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['region']),
            models.Index(fields=['state']),
            models.Index(fields=['district']),
            models.Index(fields=['city']),
            models.Index(fields=['published']),
            models.Index(fields=['content_status']),
            models.Index(fields=['featured']),
            models.Index(fields=['verification_status']),
            models.Index(fields=['pilgrimage_collection']),
            models.Index(fields=['trekking_difficulty']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.published:
            if self.content_status == 'published':
                self.content_status = 'unpublished'
        else:
            if self.content_status in ['draft', 'review', 'unpublished', 'archived']:
                self.published = False
            else:
                self.content_status = 'published'
        self.data_completeness_score = self.calculate_completeness_score()
        if self.state:
            if hasattr(self.state, 'region') and self.state.region:
                self.region_obj = self.state.region
                self.region = self.state.region.slug
            elif not self.region or self.region == 'south-india':
                state_name = self.state.name
                region_map = {
                    'south-india': ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Andaman and Nicobar Islands', 'Puducherry', 'Lakshadweep'],
                    'north-india': ['Jammu and Kashmir', 'Himachal Pradesh', 'Punjab', 'Uttarakhand', 'Haryana', 'Delhi', 'Uttar Pradesh', 'Chandigarh', 'Ladakh'],
                    'west-india': ['Rajasthan', 'Gujarat', 'Maharashtra', 'Goa', 'Dadra and Nagar Haveli and Daman and Diu'],
                    'east-india': ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha'],
                    'central-india': ['Madhya Pradesh', 'Chhattisgarh'],
                    'northeast-india': ['Assam', 'Sikkim', 'Nagaland', 'Meghalaya', 'Manipur', 'Mizoram', 'Tripura', 'Arunachal Pradesh']
                }
                for r_key, s_list in region_map.items():
                    if state_name in s_list:
                        self.region = r_key
                        break
        super().save(*args, **kwargs)

    @property
    def has_video(self):
        if not self.pk:
            return False
        return self.videos.filter(published=True).exists()

    @property
    def has_history(self):
        if not self.pk:
            return False
        return hasattr(self, 'history') and bool(self.history.short_history)

    def calculate_completeness_score(self):
        score = 0
        if self.name and self.state_id: score += 15 # Basic info
        if self.main_image or (self.pk and self.images.exists()): score += 15 # Image
        if self.has_video: score += 20 # Video
        if self.has_history: score += 25 # History & Timeline
        if self.latitude and self.longitude: score += 10 # Geo Map
        if self.nearest_airport or self.nearest_railway or self.things_to_do: score += 10 # Logistics
        if (self.pk and self.sources.exists()) or self.source_name: score += 5 # Sources
        return min(score, 100)

    def __str__(self):
        return f"{self.name} ({self.district + ', ' if self.district else ''}{self.state.name if self.state_id else ''})"


class DestinationImage(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='destinations/images/', blank=True, null=True, validators=[validate_image_file])
    image_url = models.URLField(max_length=600, blank=True, null=True)
    caption = models.CharField(max_length=255, blank=True, null=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    source = models.CharField(max_length=150, blank=True, default="Official Tourism / Licensed")
    source_url = models.URLField(max_length=600, blank=True, null=True)
    license_info = models.CharField(max_length=200, blank=True, default="Public Domain / Licensed")
    photographer = models.CharField(max_length=150, blank=True, default="")
    is_primary = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', '-is_primary', '-created_at']

    def save(self, *args, **kwargs):
        if self.is_primary:
            DestinationImage.objects.filter(destination=self.destination, is_primary=True).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image for {self.destination.name}"


class DestinationAuditLog(models.Model):
    ACTION_CHOICES = (
        ('CREATED', 'Created Destination'),
        ('UPDATED', 'Updated Details'),
        ('STATUS_CHANGE', 'Status Changed'),
        ('MEDIA_ADDED', 'Media Added'),
        ('IMPORTED', 'Imported via Pipeline'),
    )
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='audit_logs')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES, default='UPDATED')
    changed_by = models.CharField(max_length=150, default='System Administrator')
    change_summary = models.TextField(blank=True, default='')
    previous_state = models.JSONField(null=True, blank=True)
    new_state = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.destination.name} - {self.action} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class DestinationVideo(models.Model):
    VIDEO_TYPE_CHOICES = (
        ('overview', 'Main Travel Video'),
        ('history', 'History & Heritage Documentary'),
        ('temple_tour', 'Temple & Spiritual Tour'),
        ('drone_cinematic', 'Drone & Cinematic Aerial'),
        ('guide', 'Travel Guide & Itinerary'),
        ('local_experience', 'Local Culture & Food Experience'),
    )

    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=255, blank=True, null=True)
    video_url = models.URLField(max_length=600, help_text="Direct MP4 / CDN stream or embed URL")
    thumbnail_url = models.URLField(max_length=600, blank=True, null=True)
    thumbnail = models.ImageField(upload_to='destinations/videos/', blank=True, null=True)
    duration = models.CharField(max_length=50, blank=True, null=True, help_text="e.g. 4:30")
    source = models.CharField(max_length=150, blank=True, null=True, default="Incredible India / Official Tourism")
    source_url = models.URLField(max_length=600, blank=True, null=True)
    video_type = models.CharField(max_length=50, choices=VIDEO_TYPE_CHOICES, default='overview')
    description = models.TextField(blank=True, null=True)
    is_primary = models.BooleanField(default=False, help_text="Use as hero video background on detail page")
    display_order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_primary', 'display_order', '-created_at']

    def save(self, *args, **kwargs):
        if self.is_primary:
            DestinationVideo.objects.filter(destination=self.destination, is_primary=True).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title or 'Video'} for {self.destination.name}"


class DestinationHistory(models.Model):
    VERIFICATION_CHOICES = (
        ('verified', '100% Verified by Official Records'),
        ('needs_review', 'Needs Review'),
        ('outdated', 'Outdated Info'),
    )

    destination = models.OneToOneField(Destination, on_delete=models.CASCADE, related_name='history')
    short_history = models.TextField(help_text="Concise historical summary (1-2 paragraphs)")
    detailed_history = models.TextField(help_text="Comprehensive historical narrative")
    ancient_history = models.TextField(blank=True, null=True, help_text="Origins and Vedic / Ancient era background")
    medieval_history = models.TextField(blank=True, null=True, help_text="Medieval dynasties, royal patrons, and invasions")
    modern_history = models.TextField(blank=True, null=True, help_text="Colonial to post-independence evolution")
    architecture = models.TextField(blank=True, null=True, help_text="Architectural style, layout, carvings, and engineering")
    cultural_significance = models.TextField(blank=True, null=True, help_text="Festivals, traditions, rituals, and music")
    religious_significance = models.TextField(blank=True, null=True, help_text="Puranic lore, sanctum details, and spiritual importance")
    historical_events = models.JSONField(default=list, blank=True, help_text="List of key historical milestones")
    important_dates = models.JSONField(default=list, blank=True, help_text="Timeline: [{'era': '...', 'year': '...', 'title': '...', 'description': '...'}]")
    source_name = models.CharField(max_length=255, default="Archaeological Survey of India (ASI) / State Archaeology")
    source_url = models.URLField(max_length=600, blank=True, null=True)
    verification_status = models.CharField(max_length=30, choices=VERIFICATION_CHOICES, default='verified')
    last_verified_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Destination Histories'

    def __str__(self):
        return f"History of {self.destination.name}"


class DestinationSource(models.Model):
    SOURCE_TYPE_CHOICES = (
        ('government', 'Government Tourism Department'),
        ('asi', 'Archaeological Survey of India (ASI)'),
        ('temple_trust', 'Official Temple Trust / Devasthanam'),
        ('unesco', 'UNESCO World Heritage Centre'),
        ('academic', 'Academic / Historical Research Archive'),
        ('verified_partner', 'Verified Travel Partner'),
    )

    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='sources')
    source_name = models.CharField(max_length=200)
    source_type = models.CharField(max_length=50, choices=SOURCE_TYPE_CHOICES, default='government')
    source_url = models.URLField(max_length=600, blank=True, null=True)
    license_info = models.CharField(max_length=255, default='Official Public Tourism Information / Fair Use Attribution')
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.source_name} ({self.destination.name})"


class Attraction(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='attractions')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, blank=True)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True, validators=[validate_latitude])
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True, validators=[validate_longitude])
    image = models.ImageField(upload_to='attractions/', blank=True, null=True)
    opening_time = models.CharField(max_length=100, blank=True, null=True)
    closing_time = models.CharField(max_length=100, blank=True, null=True)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} near {self.destination.name}"


class TravelTip(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='travel_tips')
    title = models.CharField(max_length=200, default='General Tip')
    description = models.TextField()
    display_order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"Tip for {self.destination.name}"


class RecentlyViewed(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recently_viewed')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='viewed_by')
    viewed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'destination')
        ordering = ['-viewed_at']


class HeroDestination(models.Model):
    REGION_CHOICES = (
        ('SOUTH', 'South India'),
        ('NORTH', 'North India'),
        ('WEST', 'West India'),
        ('EAST', 'East India'),
        ('CENTRAL', 'Central India'),
        ('NORTHEAST', 'Northeast India'),
    )
    TRANSITION_CHOICES = (
        ('CROSSFADE', 'Cinematic Crossfade'),
        ('ZOOM', '3D Zoom'),
        ('SLIDE', 'Depth Slide'),
        ('SWEEP', 'Light Sweep'),
    )

    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='hero_features', blank=True, null=True)
    destination_name = models.CharField(max_length=200, help_text="Fallback name if not linked to a Destination")
    region = models.CharField(max_length=20, choices=REGION_CHOICES, default='SOUTH', db_index=True)
    state_name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    youtube_video_id = models.CharField(max_length=50, blank=True, null=True)
    desktop_video = models.FileField(upload_to='hero_videos/', blank=True, null=True)
    mobile_video = models.FileField(upload_to='hero_videos/mobile/', blank=True, null=True)
    poster_image = models.ImageField(upload_to='hero_posters/', blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False)
    transition_type = models.CharField(max_length=20, choices=TRANSITION_CHOICES, default='CROSSFADE')
    display_duration = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.get_region_display()}"


class TravelCollection(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=220, unique=True, db_index=True, blank=True)
    subtitle = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')
    cover_image = models.URLField(max_length=600, blank=True, default='')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='collections')
    destinations = models.ManyToManyField(Destination, related_name='travel_collections', blank=True)
    featured = models.BooleanField(default=True, db_index=True)
    display_order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.destinations.count()} destinations)"
