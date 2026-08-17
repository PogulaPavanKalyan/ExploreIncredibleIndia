"""
Fix regions: update poster images and remove placeholder video URLs.
Run: python fix_regions.py
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.regions.models import Region

# Real curated Unsplash images for each region (poster images)
# These are the same images we already confirmed are region-appropriate
REGION_UPDATES = {
    'south-india': {
        'poster_image': 'https://images.unsplash.com/photo-1593693397690-362cb9666cb3?w=1400',
        'desktop_video': '',  # Remove placeholder video
        'mobile_video': '',
        'tagline': 'Land of temples, backwaters and tropical beauty',
        'description': 'From the misty Nilgiris to the serene backwaters of Kerala, South India captivates with its ancient temples, lush landscapes and vibrant culture.',
        'destination_count': 45,
        'state_count': 5,
    },
    'north-india': {
        'poster_image': 'https://images.unsplash.com/photo-1564507592208-5287f34f3c7e?w=1400',
        'desktop_video': '',
        'mobile_video': '',
        'tagline': 'Where Himalayan peaks meet royal heritage',
        'description': 'Explore the iconic Taj Mahal, the sacred Varanasi ghats, the golden deserts of Rajasthan and the mighty Himalayan ranges.',
        'destination_count': 62,
        'state_count': 7,
    },
    'west-india': {
        'poster_image': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1400',
        'desktop_video': '',
        'mobile_video': '',
        'tagline': 'From desert sands to sun-kissed shores',
        'description': 'Vibrant cities, pristine beaches, majestic forts and the golden Thar Desert define the dynamic spirit of West India.',
        'destination_count': 38,
        'state_count': 4,
    },
    'east-india': {
        'poster_image': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1400',
        'desktop_video': '',
        'mobile_video': '',
        'tagline': 'Ancient culture, lush forests and sacred rivers',
        'description': 'From the tea estates of Darjeeling to the ancient temples of Odisha, East India offers a deep, culturally rich travel experience.',
        'destination_count': 31,
        'state_count': 5,
    },
    'central-india': {
        'poster_image': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1400',
        'desktop_video': '',
        'mobile_video': '',
        'tagline': 'The heartland of wildlife and ancient kingdoms',
        'description': 'Central India is the realm of wild tigers, medieval temples and vast plateaus — raw, adventurous and deeply historic.',
        'destination_count': 22,
        'state_count': 3,
    },
    'northeast-india': {
        'poster_image': 'https://images.unsplash.com/photo-1627855331575-b82772591fb0?w=1400',
        'desktop_video': '',
        'mobile_video': '',
        'tagline': 'Seven sisters of untouched wilderness',
        'description': "Northeast India's seven states hide extraordinary biodiversity, indigenous cultures and breathtaking Himalayan landscapes.",
        'destination_count': 28,
        'state_count': 7,
    }
}

def run():
    print("Updating regions...\n")
    for slug, data in REGION_UPDATES.items():
        try:
            region = Region.objects.get(slug=slug)
            region.poster_image = data['poster_image']
            region.desktop_video = data['desktop_video']
            region.mobile_video = data['mobile_video']
            if hasattr(region, 'tagline'):
                region.tagline = data['tagline']
            if hasattr(region, 'description'):
                region.description = data['description']
            if hasattr(region, 'destination_count'):
                region.destination_count = data['destination_count']
            if hasattr(region, 'state_count'):
                region.state_count = data['state_count']
            region.save()
            print(f"[OK] {region.name} updated.")
        except Region.DoesNotExist:
            print(f"[SKIP] Region with slug '{slug}' not found.")
        except Exception as e:
            print(f"[ERROR] {slug}: {e}")

    print("\nDone!")

if __name__ == "__main__":
    run()
