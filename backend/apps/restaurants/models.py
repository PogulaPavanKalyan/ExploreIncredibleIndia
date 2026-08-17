from django.db import models
from apps.cities.models import City
from apps.destinations.models import Destination

class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='restaurants')
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, related_name='restaurants', null=True, blank=True)
    cuisine_type = models.CharField(max_length=150)
    address = models.CharField(max_length=300)
    avg_cost_for_two = models.DecimalField(max_digits=8, decimal_places=2, default=500.00)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.2)
    image = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.cuisine_type}) - {self.city.name}"
