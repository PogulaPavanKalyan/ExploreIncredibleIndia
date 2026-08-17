from django.db import models
from apps.cities.models import City
from apps.destinations.models import Destination

class Hotel(models.Model):
    name = models.CharField(max_length=200)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='hotels')
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, related_name='hotels', null=True, blank=True)
    address = models.CharField(max_length=300)
    star_rating = models.IntegerField(default=3)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(max_length=500, blank=True, null=True)
    booking_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.city.name}"
