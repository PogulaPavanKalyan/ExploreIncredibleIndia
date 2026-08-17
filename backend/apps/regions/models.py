from django.db import models

class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    tagline = models.CharField(max_length=255)
    description = models.TextField()
    desktop_video = models.URLField(max_length=500, blank=True, null=True, help_text="URL to desktop cinematic video")
    mobile_video = models.URLField(max_length=500, blank=True, null=True, help_text="URL to mobile cinematic video")
    poster_image = models.URLField(max_length=500, blank=True, null=True, help_text="URL to poster image fallback")
    display_order = models.IntegerField(default=0, help_text="Order in which region appears in the UI")
    
    class Meta:
        ordering = ['display_order']
        verbose_name = 'Region'
        verbose_name_plural = 'Regions'

    def __str__(self):
        return self.name
