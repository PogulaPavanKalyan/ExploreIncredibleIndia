from django.db import models
from django.utils.text import slugify
from apps.states.models import State
from apps.cities.models import City

class Festival(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='festivals')
    city = models.ForeignKey(City, on_delete=models.SET_NULL, related_name='festivals', null=True, blank=True)
    month_celebrated = models.CharField(max_length=100)
    description = models.TextField()
    image = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.name}-{self.state.name}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.state.name})"
