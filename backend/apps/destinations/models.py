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

    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=220, unique=True, db_index=True, blank=True)
    short_description = models.CharField(max_length=500)
    description = models.TextField()
    history = models.TextField(blank=True, null=True)

    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='destinations')
    city = models.ForeignKey(City, on_delete=models.SET_NULL, related_name='destinations', blank=True, null=True)
    categories = models.ManyToManyField(Category, related_name='destinations', blank=True)

    best_time_to_visit = models.CharField(max_length=200, blank=True, null=True)
    opening_time = models.CharField(max_length=100, blank=True, null=True, default="06:00 AM")
    closing_time = models.CharField(max_length=100, blank=True, null=True, default="06:00 PM")
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    recommended_duration = models.CharField(max_length=100, blank=True, null=True, default="2-3 Hours")

    how_to_reach = models.TextField(blank=True, null=True)
    airport_information = models.TextField(blank=True, null=True)
    railway_information = models.TextField(blank=True, null=True)
    bus_information = models.TextField(blank=True, null=True)
    local_transport = models.TextField(blank=True, null=True)

    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True, validators=[validate_latitude])
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True, validators=[validate_longitude])

    featured = models.BooleanField(default=False, db_index=True)
    trending = models.BooleanField(default=False, db_index=True)
    is_hidden_gem = models.BooleanField(default=False)
    published = models.BooleanField(default=True, db_index=True)

    budget_level = models.CharField(max_length=20, choices=BUDGET_CHOICES, default='medium')
    travel_style = models.CharField(max_length=20, choices=TRAVEL_STYLE_CHOICES, default='family')

    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    total_reviews = models.IntegerField(default=0)
    main_image = models.ImageField(upload_to='destinations/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-featured', '-trending', 'name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['slug']),
            models.Index(fields=['published']),
            models.Index(fields=['featured']),
            models.Index(fields=['trending']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.state.name if self.state_id else ''})"


class DestinationImage(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='destinations/images/', validators=[validate_image_file])
    caption = models.CharField(max_length=255, blank=True, null=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
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


class DestinationVideo(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=200, blank=True, null=True)
    video_url = models.URLField(max_length=500)
    thumbnail = models.ImageField(upload_to='destinations/videos/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"Video for {self.destination.name}"


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
    
    youtube_video_id = models.CharField(max_length=50, blank=True, null=True, help_text="YouTube ID (preferred)")
    desktop_video = models.FileField(upload_to='hero_videos/', blank=True, null=True, help_text="Raw MP4 if YouTube is not used")
    mobile_video = models.FileField(upload_to='hero_videos/mobile/', blank=True, null=True)
    poster_image = models.ImageField(upload_to='hero_posters/', blank=True, null=True)
    
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False)
    
    transition_type = models.CharField(max_length=20, choices=TRANSITION_CHOICES, default='CROSSFADE')
    display_duration = models.PositiveIntegerField(default=10, help_text="Duration in seconds")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.get_region_display()}"

