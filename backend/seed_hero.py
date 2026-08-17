import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.destinations.models import Destination, HeroDestination

def get_dest(slug):
    return Destination.objects.filter(slug=slug).first()

hero_data = [
    {
        'destination_slug': 'araku-valley',
        'destination_name': 'Araku Valley',
        'region': 'SOUTH',
        'state_name': 'Andhra Pradesh',
        'title': 'ARAKU VALLEY',
        'subtitle': 'Where mountains meet coffee country.',
        'youtube_video_id': 'FOvOxeb2TCg',
        'display_order': 10,
        'transition_type': 'CROSSFADE',
    },
    {
        'destination_slug': 'taj-mahal',
        'destination_name': 'Taj Mahal',
        'region': 'NORTH',
        'state_name': 'Uttar Pradesh',
        'title': 'TAJ MAHAL',
        'subtitle': 'A timeless icon of Indian heritage.',
        'youtube_video_id': '4sSg1fZ8RjU',
        'display_order': 20,
        'transition_type': 'CROSSFADE',
    },
    {
        'destination_slug': 'munnar',
        'destination_name': 'Munnar',
        'region': 'SOUTH',
        'state_name': 'Kerala',
        'title': 'MUNNAR',
        'subtitle': 'Tea-covered hills and misty landscapes.',
        'youtube_video_id': 'FOvOxeb2TCg', # Placeholder
        'display_order': 30,
        'transition_type': 'CROSSFADE',
    },
    {
        'destination_slug': 'hampi',
        'destination_name': 'Hampi',
        'region': 'SOUTH',
        'state_name': 'Karnataka',
        'title': 'HAMPI',
        'subtitle': 'Ancient ruins of a glorious empire.',
        'youtube_video_id': '4sSg1fZ8RjU', # Placeholder
        'display_order': 40,
        'transition_type': 'CROSSFADE',
    },
    {
        'destination_slug': 'meghalaya', # or Shillong
        'destination_name': 'Shillong',
        'region': 'NORTHEAST',
        'state_name': 'Meghalaya',
        'title': 'MEGHALAYA',
        'subtitle': 'The abode of clouds.',
        'youtube_video_id': 'FOvOxeb2TCg', # Placeholder
        'display_order': 50,
        'transition_type': 'CROSSFADE',
    },
    {
        'destination_slug': 'jaipur',
        'destination_name': 'Jaipur',
        'region': 'NORTH', # Or WEST, rajasthan is often North-West
        'state_name': 'Rajasthan',
        'title': 'RAJASTHAN',
        'subtitle': 'The land of kings and majestic forts.',
        'youtube_video_id': '4sSg1fZ8RjU', # Placeholder
        'display_order': 60,
        'transition_type': 'CROSSFADE',
    },
    {
        'destination_slug': 'khajuraho',
        'destination_name': 'Khajuraho',
        'region': 'CENTRAL',
        'state_name': 'Madhya Pradesh',
        'title': 'KHAJURAHO',
        'subtitle': 'Intricate carvings and ancient temples.',
        'youtube_video_id': 'FOvOxeb2TCg', # Placeholder
        'display_order': 70,
        'transition_type': 'CROSSFADE',
    },
    {
        'destination_slug': 'goa',
        'destination_name': 'Goa',
        'region': 'WEST',
        'state_name': 'Goa',
        'title': 'GOA',
        'subtitle': 'Sun, sand, and beautiful coastlines.',
        'youtube_video_id': '4sSg1fZ8RjU', # Placeholder
        'display_order': 80,
        'transition_type': 'CROSSFADE',
    },
    {
        'destination_slug': 'darjeeling',
        'destination_name': 'Darjeeling',
        'region': 'EAST',
        'state_name': 'West Bengal',
        'title': 'DARJEELING',
        'subtitle': 'The queen of the hills.',
        'youtube_video_id': 'FOvOxeb2TCg', # Placeholder
        'display_order': 90,
        'transition_type': 'CROSSFADE',
    },
]

HeroDestination.objects.all().delete()

for d in hero_data:
    dest = get_dest(d.pop('destination_slug'))
    if dest:
        d['destination'] = dest
    HeroDestination.objects.create(**d)

print(f"Seeded {HeroDestination.objects.count()} Hero Destinations successfully.")
