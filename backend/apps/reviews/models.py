from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg
from apps.destinations.models import Destination

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=150)
    comment = models.TextField()
    helpful_count = models.IntegerField(default=0)
    is_reported = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_destination_rating()

    def delete(self, *args, **kwargs):
        dest = self.destination
        super().delete(*args, **kwargs)
        dest.total_reviews = dest.reviews.filter(is_approved=True).count()
        avg = dest.reviews.filter(is_approved=True).aggregate(Avg('rating'))['rating__avg']
        dest.avg_rating = round(avg, 2) if avg else 4.5
        dest.save()

    def update_destination_rating(self):
        dest = self.destination
        approved_reviews = dest.reviews.filter(is_approved=True)
        dest.total_reviews = approved_reviews.count()
        avg = approved_reviews.aggregate(Avg('rating'))['rating__avg']
        dest.avg_rating = round(avg, 2) if avg else 4.5
        dest.save()

    def __str__(self):
        author = self.user.username if self.user else "Guest Traveler"
        return f"{self.rating}★ by {author} for {self.destination.name}"
