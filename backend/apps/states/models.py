from django.db import models
from django.utils.text import slugify
from apps.utils import validate_latitude, validate_longitude

class State(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True)
    slug = models.SlugField(max_length=120, unique=True, db_index=True, blank=True)
    code = models.CharField(max_length=10, blank=True, null=True)
    is_union_territory = models.BooleanField(default=False)
    capital = models.CharField(max_length=100, blank=True, null=True)
    short_description = models.CharField(max_length=300, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='states/', blank=True, null=True)
    banner_image = models.CharField(max_length=500, blank=True, null=True)
    thumbnail_image = models.CharField(max_length=500, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True, validators=[validate_latitude])
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True, validators=[validate_longitude])
    best_time_to_visit = models.CharField(max_length=200, blank=True, null=True)
    culture_info = models.TextField(blank=True, null=True)
    food_info = models.TextField(blank=True, null=True)
    festival_info = models.TextField(blank=True, null=True)
    featured = models.BooleanField(default=False, db_index=True)
    published = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['slug']),
            models.Index(fields=['published']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({'UT' if self.is_union_territory else 'State'})"

