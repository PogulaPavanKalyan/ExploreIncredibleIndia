from django.db import models
from django.utils.text import slugify
from apps.states.models import State
from apps.cities.models import City
from apps.destinations.models import Destination

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

