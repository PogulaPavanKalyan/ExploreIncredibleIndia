import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.destinations.models import HeroDestination

prefix_map = {
    'araku-valley': 'araku',
    'taj-mahal': 'taj',
    'munnar': 'munnar',
    'hampi': 'hampi',
    'shillong': 'shillong',
    'jaipur': 'jaipur',
    'khajuraho': 'khajuraho',
    'goa': 'goa',
    'darjeeling': 'darjeeling'
}

destinations = HeroDestination.objects.all()
for dest in destinations:
    slug = dest.destination.slug if dest.destination else prefix_map.get(dest.destination_name.lower())
    if slug:
        # Set desktop_video directly to the path relative to MEDIA_ROOT
        dest.desktop_video = f"hero_videos/{slug}.mp4"
        # We can clear youtube_video_id to force local video usage
        dest.youtube_video_id = ""
        dest.save()

print("Database updated with local video paths!")
