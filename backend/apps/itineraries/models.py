from django.db import models
from django.utils.text import slugify
from django.conf import settings
from apps.cities.models import City
from apps.destinations.models import Destination

class Itinerary(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='itineraries')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    starting_location = models.CharField(max_length=150, blank=True, null=True)
    destination_city = models.ForeignKey(City, on_delete=models.SET_NULL, related_name='itineraries', null=True, blank=True)
    duration_days = models.IntegerField(default=3)
    estimated_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Itineraries'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Itinerary.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.duration_days} Days)"


class ItineraryDay(models.Model):
    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE, related_name='days')
    day_number = models.IntegerField(default=1)
    title = models.CharField(max_length=200, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['day_number']

    def __str__(self):
        return f"Day {self.day_number}: {self.title or self.itinerary.title}"


class ItineraryPlace(models.Model):
    itinerary_day = models.ForeignKey(ItineraryDay, on_delete=models.CASCADE, related_name='places')
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, related_name='itinerary_appearances', null=True, blank=True)
    place_name = models.CharField(max_length=200)
    order = models.IntegerField(default=1)
    activity_notes = models.TextField(blank=True, null=True)
    estimated_cost = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.place_name} (Day {self.itinerary_day.day_number})"
