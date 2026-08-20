from django.db import models
from django.utils.text import slugify
from apps.states.models import State, District
from apps.utils import validate_latitude, validate_longitude

class City(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=120, unique=True, db_index=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='cities', db_index=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True, related_name='cities', db_index=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='cities/', blank=True, null=True)
    banner_image = models.CharField(max_length=500, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True, validators=[validate_latitude])
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True, validators=[validate_longitude])
    is_popular = models.BooleanField(default=False)
    published = models.BooleanField(default=True, db_index=True)
    best_time_to_visit = models.CharField(max_length=200, blank=True, null=True)
    transport_info = models.TextField(blank=True, null=True)
    food_highlights = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Cities'
        ordering = ['name']
        unique_together = ('name', 'state')
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['slug']),
            models.Index(fields=['published']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            state_name = self.state.name if self.state_id else ""
            self.slug = slugify(f"{self.name}-{state_name}") if state_name else slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}, {self.state.name if self.state_id else ''}"

