import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.regions.models import Region

regions_data = [
    {
        "name": "South India",
        "slug": "south-india",
        "tagline": "Where ancient temples meet mist-covered mountains.",
        "description": "Walk through centuries-old temples, follow mountain roads through misty valleys, and discover coastlines shaped by culture.",
        "desktop_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "mobile_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "poster_image": "https://images.unsplash.com/photo-1593693397690-362cb9666cb3?q=80&w=2000&auto=format&fit=crop",
        "display_order": 1,
    },
    {
        "name": "North India",
        "slug": "north-india",
        "tagline": "The crown of the Himalayas and the cradle of civilization.",
        "description": "Experience the spiritual aura of ancient rivers, the towering peaks of the Himalayas, and the legacy of Mughal architecture.",
        "desktop_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "mobile_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "poster_image": "https://images.unsplash.com/photo-1564507592208-5287f34f3c7e?q=80&w=2000&auto=format&fit=crop",
        "display_order": 2,
    },
    {
        "name": "West India",
        "slug": "west-india",
        "tagline": "Golden deserts, vibrant heritage, and modern metropolises.",
        "description": "From the sprawling forts of Rajasthan to the energetic coasts of Goa and the bustling streets of Mumbai.",
        "desktop_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "mobile_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "poster_image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2000&auto=format&fit=crop",
        "display_order": 3,
    },
    {
        "name": "East India",
        "slug": "east-india",
        "tagline": "Untouched coastlines, colonial charm, and rich artistry.",
        "description": "Discover the lush tea gardens of Darjeeling, the historic temples of Odisha, and the cultural heartbeat of Kolkata.",
        "desktop_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "mobile_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "poster_image": "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=2000&auto=format&fit=crop",
        "display_order": 4,
    },
    {
        "name": "Central India",
        "slug": "central-india",
        "tagline": "The heart of the nation, rich in wildlife and legends.",
        "description": "Explore dense jungles hiding ancient forts, exquisite temple carvings, and some of the world's finest tiger reserves.",
        "desktop_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "mobile_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "poster_image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2000&auto=format&fit=crop",
        "display_order": 5,
    },
    {
        "name": "Northeast India",
        "slug": "northeast-india",
        "tagline": "Mist-shrouded valleys, living root bridges, and vibrant tribes.",
        "description": "Step into an untouched paradise of cascading waterfalls, endless tea estates, and an incredibly diverse indigenous heritage.",
        "desktop_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "mobile_video": "https://www.w3schools.com/html/mov_bbb.mp4",
        "poster_image": "https://images.unsplash.com/photo-1627855331575-b82772591fb0?q=80&w=2000&auto=format&fit=crop",
        "display_order": 6,
    }
]

def seed_regions():
    print("Seeding Regions...")
    for data in regions_data:
        region, created = Region.objects.update_or_create(
            slug=data['slug'],
            defaults={
                'name': data['name'],
                'tagline': data['tagline'],
                'description': data['description'],
                'desktop_video': data['desktop_video'],
                'mobile_video': data['mobile_video'],
                'poster_image': data['poster_image'],
                'display_order': data['display_order']
            }
        )
        if created:
            print(f"Created: {region.name}")
        else:
            print(f"Updated: {region.name}")
    print("Regions seeded successfully!")

if __name__ == '__main__':
    seed_regions()
