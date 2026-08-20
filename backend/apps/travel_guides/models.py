from django.db import models
from django.utils.text import slugify
from apps.states.models import State
from apps.cities.models import City
from apps.destinations.models import Destination

class Story(models.Model):
    CATEGORY_CHOICES = (
        ('hidden', 'Hidden India'),
        ('culture', 'Culture & Traditions'),
        ('food', 'Food Stories'),
        ('heritage', 'Royal & Heritage'),
        ('spiritual', 'Sacred & Spiritual'),
        ('adventure', 'Adventure & Exploration'),
        ('wildlife', 'Wild India'),
        ('nature', 'Nature & Landscapes'),
        ('coastal', 'Coastal India'),
        ('mountain', 'Mountain India'),
        ('festival', 'Festival Stories'),
    )

    title = models.CharField(max_length=250, db_index=True)
    slug = models.SlugField(max_length=270, unique=True, db_index=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='hidden', db_index=True)
    category_label = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=150, default='India')
    state = models.ForeignKey(State, on_delete=models.SET_NULL, related_name='stories', null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, related_name='stories', null=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, related_name='stories', null=True, blank=True)
    
    short_description = models.TextField(help_text="Engaging 1-2 sentence overview for cards")
    content = models.TextField()
    cover_image = models.URLField(max_length=600)
    
    author = models.CharField(max_length=120, default="Dekho Bharat Editorial")
    author_role = models.CharField(max_length=120, default="Travel Chronicler", blank=True, null=True)
    read_time = models.CharField(max_length=50, default="5 min read")
    
    is_featured = models.BooleanField(default=False, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    display_order = models.PositiveIntegerField(default=0)
    
    likes_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-is_featured', '-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['is_active']),
            models.Index(fields=['slug']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.category_label:
            self.category_label = dict(self.CATEGORY_CHOICES).get(self.category, self.category.title())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"


class TravelGuide(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.SET_NULL, related_name='guides', null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, related_name='guides', null=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, related_name='guides', null=True, blank=True)
    content = models.TextField()
    author = models.CharField(max_length=100, default="Dekho Bharat Editorial")
    featured_image = models.URLField(max_length=500, blank=True, null=True)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class LocalGuide(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    photo = models.URLField(max_length=500, blank=True, null=True)
    bio = models.TextField()
    state = models.ForeignKey(State, on_delete=models.SET_NULL, related_name='local_guides', null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, related_name='local_guides', null=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, related_name='local_guides', null=True, blank=True)
    languages_spoken = models.CharField(max_length=200, default="English, Hindi, Telugu")
    experience_years = models.IntegerField(default=5)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.85)
    price_per_day = models.DecimalField(max_digits=8, decimal_places=2, default=1500.00)
    contact_phone = models.CharField(max_length=30, default="+91 98765 43210")
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-rating', '-experience_years']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.experience_years} yrs exp)"
