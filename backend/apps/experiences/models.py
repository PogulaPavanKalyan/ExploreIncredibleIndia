from django.db import models
from django.utils.text import slugify
from apps.destinations.models import Destination

class Experience(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True)
    slug = models.SlugField(max_length=120, unique=True, db_index=True, blank=True)
    description = models.TextField(blank=True, null=True)
    
    cover_image = models.ImageField(upload_to='experiences/images/', blank=True, null=True)
    cover_video = models.FileField(upload_to='experiences/videos/', blank=True, null=True, help_text="Cinematic video for this experience")
    
    display_order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    
    featured_destinations = models.ManyToManyField(Destination, related_name='experiences', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Experiences'
        ordering = ['display_order', 'name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
            models.Index(fields=['display_order']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
