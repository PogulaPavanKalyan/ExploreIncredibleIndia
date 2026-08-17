"""
Script to populate experience cover images and descriptions in Django backend.
Run: python fix_experience_images.py
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.experiences.models import Experience

# 10 Definitive Categories with exact user-requested descriptions and verified India imagery
EXPERIENCE_DATA = [
    {
        "name": "Mountains",
        "slug": "mountains",
        "display_order": 1,
        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
        "description": "Chase misty peaks, Himalayan valleys and breathtaking mountain escapes."
    },
    {
        "name": "Beaches",
        "slug": "beaches",
        "display_order": 2,
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        "description": "Relax along India's tropical shores, islands and coastal escapes."
    },
    {
        "name": "Temples",
        "slug": "temples",
        "display_order": 3,
        "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200",
        "description": "Discover India's magnificent temples, architecture and sacred traditions."
    },
    {
        "name": "Heritage",
        "slug": "heritage",
        "display_order": 4,
        "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200",
        "description": "Walk through forts, palaces and centuries of Indian history."
    },
    {
        "name": "Nature",
        "slug": "nature",
        "display_order": 5,
        "image": "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200",
        "description": "Escape into India's forests, valleys, lakes and untouched landscapes."
    },
    {
        "name": "Wildlife",
        "slug": "wildlife",
        "display_order": 6,
        "image": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200",
        "description": "Meet India's incredible wildlife across forests and national parks."
    },
    {
        "name": "Waterfalls",
        "slug": "waterfalls",
        "display_order": 7,
        "image": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200",
        "description": "Discover spectacular waterfalls hidden across India's landscapes."
    },
    {
        "name": "Adventure",
        "slug": "adventure",
        "display_order": 8,
        "image": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200",
        "description": "Push your limits with trekking, rafting, camping and outdoor adventures."
    },
    {
        "name": "Food & Culture",
        "slug": "food-culture",
        "display_order": 9,
        "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200",
        "description": "Taste India's regional flavours, traditions and vibrant local culture."
    },
    {
        "name": "Spiritual",
        "slug": "spiritual",
        "display_order": 10,
        "image": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200",
        "description": "Experience India's sacred places, pilgrimages and peaceful retreats."
    }
]

def run():
    print("Populating 10 Experience Categories...")
    for item in EXPERIENCE_DATA:
        exp, created = Experience.objects.update_or_create(
            slug=item["slug"],
            defaults={
                "name": item["name"],
                "description": item["description"],
                "cover_image": item["image"],
                "display_order": item["display_order"],
                "is_active": True
            }
        )
        status = "Created" if created else "Updated"
        print(f"[{status}] {exp.name} -> {item['image'][:50]}...")

    print("\nDatabase updated successfully!")

if __name__ == "__main__":
    run()
