import os
import django
from django.utils.text import slugify

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.experiences.models import Experience

EXPERIENCE_CATEGORIES = [
    {
        "name": "Mountains",
        "slug": "mountains",
        "description": "Ascend the snow-capped Himalayan peaks, misty Western Ghats, and tranquil tea estates.",
        "cover_image": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200",
        "display_order": 1,
    },
    {
        "name": "Beaches",
        "slug": "beaches",
        "description": "Relax along 7,500 km of golden coastlines from the Arabian Sea to Andaman's turquoise waters.",
        "cover_image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        "display_order": 2,
    },
    {
        "name": "Temples",
        "slug": "temples",
        "description": "Experience divine energy across the 12 sacred Jyotirlingas, Char Dham, and monumental Dravidian gopurams.",
        "cover_image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200",
        "display_order": 3,
    },
    {
        "name": "Heritage",
        "slug": "heritage",
        "description": "Walk through millennia of history, golden desert fortresses, and royal Mughal and Rajput palaces.",
        "cover_image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200",
        "display_order": 4,
    },
    {
        "name": "Nature",
        "slug": "nature",
        "description": "Immerse in lush emerald valleys, sacred rivers, living root bridges, and tranquil backwaters.",
        "cover_image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200",
        "display_order": 5,
    },
    {
        "name": "Wildlife",
        "slug": "wildlife",
        "description": "Embark on thrilling jungle safaris to witness Royal Bengal Tigers, one-horned rhinos, and wild elephants.",
        "cover_image": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200",
        "display_order": 6,
    },
    {
        "name": "Waterfalls",
        "slug": "waterfalls",
        "description": "Witness roaring multi-tiered waterfalls tumbling down volcanic cliffs in the Western Ghats and Meghalaya.",
        "cover_image": "https://images.unsplash.com/photo-1558431382-27e303142255?w=1200",
        "display_order": 7,
    },
    {
        "name": "Adventure",
        "slug": "adventure",
        "description": "Conquer white-water rapids in Rishikesh, high-altitude passes in Ladakh, and rugged fort treks.",
        "cover_image": "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1200",
        "display_order": 8,
    },
    {
        "name": "Food & Culture",
        "slug": "food-culture",
        "description": "Savor authentic regional flavors from Royal Hyderabadi Biryani to Chettinad spices and Bengali sweets.",
        "cover_image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
        "display_order": 9,
    },
    {
        "name": "Spiritual",
        "slug": "spiritual",
        "description": "Find inner peace along the Ganga ghats, Himalayan meditation ashrams, and Buddhist monasteries.",
        "cover_image": "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=1200",
        "display_order": 10,
    },
]

def seed_all_experiences():
    print("=== SEEDING ALL 10 TRAVEL EXPERIENCES ===")
    for exp in EXPERIENCE_CATEGORIES:
        obj, created = Experience.objects.update_or_create(
            slug=exp["slug"],
            defaults={
                "name": exp["name"],
                "description": exp["description"],
                "cover_image": exp["cover_image"],
                "display_order": exp["display_order"],
                "is_active": True,
            }
        )
        print(f" [+] Experience: {obj.name} (slug: {obj.slug})")

if __name__ == '__main__':
    seed_all_experiences()
