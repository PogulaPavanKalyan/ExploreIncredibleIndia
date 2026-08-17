import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.experiences.models import Experience
from apps.destinations.models import Destination

def seed_experiences():
    experiences_data = [
        {
            "name": "Mountains",
            "slug": "mountains",
            "description": "Rise above the clouds.",
            "destinations": ["Kashmir", "Manali", "Shimla", "Sikkim"]
        },
        {
            "name": "Beaches",
            "slug": "beaches",
            "description": "Golden sands and azure waters.",
            "destinations": ["Goa", "Varkala", "Andaman", "Puri"]
        },
        {
            "name": "Temples",
            "slug": "temples",
            "description": "Discover spiritual architecture.",
            "destinations": ["Tirumala", "Meenakshi Temple", "Kedarnath", "Konark"]
        },
        {
            "name": "Heritage",
            "slug": "heritage",
            "description": "Step back into royal history.",
            "destinations": ["Hampi", "Taj Mahal", "Rajasthan", "Ajanta"]
        },
        {
            "name": "Nature",
            "slug": "nature",
            "description": "Lush greens and endless calm.",
            "destinations": ["Munnar", "Araku", "Coorg", "Meghalaya"]
        },
        {
            "name": "Wildlife",
            "slug": "wildlife",
            "description": "Roam the untamed forests.",
            "destinations": ["Kaziranga", "Ranthambore", "Periyar", "Bandipur"]
        },
        {
            "name": "Waterfalls",
            "slug": "waterfalls",
            "description": "Witness the power of nature.",
            "destinations": ["Jog Falls", "Dudhsagar", "Chitrakote", "Athirappilly"]
        },
        {
            "name": "Adventure",
            "slug": "adventure",
            "description": "Thrill your senses.",
            "destinations": ["Rishikesh", "Ladakh"]
        },
        {
            "name": "Food & Culture",
            "slug": "food-culture",
            "description": "A feast for the soul.",
            "destinations": ["Hyderabad", "Lucknow", "Amritsar", "Kolkata", "Chennai"]
        },
        {
            "name": "Spiritual",
            "slug": "spiritual",
            "description": "Find your inner peace.",
            "destinations": ["Varanasi", "Bodh Gaya"]
        }
    ]

    for index, exp_data in enumerate(experiences_data):
        exp, created = Experience.objects.get_or_create(
            slug=exp_data['slug'],
            defaults={
                'name': exp_data['name'],
                'description': exp_data['description'],
                'display_order': index + 1
            }
        )
        if not created:
            exp.name = exp_data['name']
            exp.description = exp_data['description']
            exp.display_order = index + 1
            exp.save()
        
        # Link destinations
        dests_to_add = []
        for dest_name in exp_data['destinations']:
            dest = Destination.objects.filter(name__icontains=dest_name).first()
            if dest:
                dests_to_add.append(dest)
        
        if dests_to_add:
            exp.featured_destinations.set(dests_to_add)

    print("Successfully seeded Experiences!")

if __name__ == "__main__":
    seed_experiences()
