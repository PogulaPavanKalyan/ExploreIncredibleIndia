"""
Script to fix destination images and add missing regional destinations.
Run: python fix_journey_data.py
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.destinations.models import Destination
from apps.states.models import State
from apps.categories.models import Category
from decimal import Decimal
from urllib.parse import unquote

# ─────────────────────────────────────────────────────────────────────────────
# VERIFIED CORRECT IMAGE MAPPINGS (Correct Unsplash photos per destination)
# ─────────────────────────────────────────────────────────────────────────────
CORRECT_IMAGES = {
    # Araku Valley — Eastern Ghats hill station / coffee / tribal
    "Araku Valley": "https://images.unsplash.com/photo-1623000850613-3e1b72e7c68b?w=1000",
    # Borra Caves — Limestone cave interior (NOT industrial/tech)
    "Borra Caves": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000",
    # Rishikonda Beach — clean sandy beach (existing photo is fine, a beach)
    "Rishikonda Beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000",
    # Charminar — Hyderabad monument (existing OK)
    "Charminar": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1000",
    # Tea Gardens of Munnar — green terraced tea hills Kerala
    "Tea Gardens of Munnar": "https://images.unsplash.com/photo-1576769562804-455efadf94f4?w=1000",
    # Hawa Mahal — Jaipur pink palace (existing OK)
    "Hawa Mahal": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000",
}

# ─────────────────────────────────────────────────────────────────────────────
# NEW DESTINATIONS — one per missing region
# ─────────────────────────────────────────────────────────────────────────────
NEW_DESTINATIONS = [
    {
        "name": "Khajuraho Temples",
        "slug": "khajuraho-temples",
        "short_description": "UNESCO World Heritage temples famous for exquisite medieval sculptures in Madhya Pradesh.",
        "description": "The Khajuraho Group of Monuments is a UNESCO World Heritage Site comprising 85 temples built between 950 and 1050 AD by Chandela rulers.",
        "state_name": "Madhya Pradesh",
        "latitude": 24.8318, "longitude": 79.9199,
        "image": "https://images.unsplash.com/photo-1589309736404-2d2ab92f8059?w=1000",
        "category": "Forts & Heritage",
    },
    {
        "name": "Darjeeling",
        "slug": "darjeeling",
        "short_description": "Queen of Himalayan hill stations, home to world-famous tea gardens and Tiger Hill sunrise views.",
        "description": "Darjeeling is a hill station in West Bengal at 2042 meters. Famous for tea gardens, the UNESCO Darjeeling Himalayan Railway, and Kanchenjunga views.",
        "state_name": "West Bengal",
        "latitude": 27.0360, "longitude": 88.2627,
        "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000",
        "category": "Hill Stations",
    },
    {
        "name": "Taj Mahal",
        "slug": "taj-mahal",
        "short_description": "The world's greatest monument to love, built by Shah Jahan in white marble, a UNESCO World Heritage Site.",
        "description": "The Taj Mahal is an ivory-white marble mausoleum on the Yamuna river in Agra, built by Mughal emperor Shah Jahan in 1632.",
        "state_name": "Uttar Pradesh",
        "latitude": 27.1751, "longitude": 78.0421,
        "image": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000",
        "category": "Forts & Heritage",
    },
    {
        "name": "Cherrapunji",
        "slug": "cherrapunji",
        "short_description": "One of the wettest places on Earth with spectacular living root bridges and cascading waterfalls.",
        "description": "Cherrapunji in Meghalaya is famous for its living root bridges, stunning gorges, and some of India's most impressive waterfalls.",
        "state_name": "Meghalaya",
        "latitude": 25.2700, "longitude": 91.7200,
        "image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000",
        "category": "Waterfalls",
    },
]

STATE_DEFAULTS = {
    "Madhya Pradesh": {"code": "MP", "capital": "Bhopal"},
    "West Bengal":    {"code": "WB", "capital": "Kolkata"},
    "Uttar Pradesh":  {"code": "UP", "capital": "Lucknow"},
    "Meghalaya":      {"code": "ML", "capital": "Shillong"},
}

def fix_data():
    print("=" * 60)
    print("FIXING DESTINATION IMAGE MAPPINGS")
    print("=" * 60)

    for name, correct_url in CORRECT_IMAGES.items():
        try:
            dest = Destination.objects.get(name=name)
            dest.main_image = correct_url
            dest.save(update_fields=["main_image"])
            print(f"FIXED: {name}")
            print(f"  -> {correct_url[:70]}")
        except Destination.DoesNotExist:
            print(f"NOT FOUND: {name}")

    print("\n" + "=" * 60)
    print("ADDING MISSING REGIONAL DESTINATIONS")
    print("=" * 60)

    for d in NEW_DESTINATIONS:
        state_defaults = STATE_DEFAULTS.get(d["state_name"], {"code": "XX", "capital": d["state_name"]})
        state, _ = State.objects.get_or_create(
            name=d["state_name"],
            defaults=state_defaults
        )
        cat, _ = Category.objects.get_or_create(name=d["category"], defaults={"icon": "Map"})

        dest, created = Destination.objects.get_or_create(
            slug=d["slug"],
            defaults={
                "name": d["name"],
                "short_description": d["short_description"],
                "description": d["description"],
                "state": state,
                "latitude": d["latitude"],
                "longitude": d["longitude"],
                "featured": True,
                "trending": True,
                "main_image": d["image"],
                "published": True,
                "avg_rating": Decimal("4.8"),
                "total_reviews": 200,
            }
        )
        if created:
            dest.categories.add(cat)
            print(f"ADDED: {d['name']} ({d['state_name']})")
        else:
            dest.main_image = d["image"]
            dest.save(update_fields=["main_image"])
            print(f"UPDATED image: {d['name']}")

    print("\n" + "=" * 60)
    print("FINAL VERIFICATION")
    print("=" * 60)

    all_dests = Destination.objects.filter(published=True).exclude(
        latitude__isnull=True
    ).exclude(longitude__isnull=True).select_related("state")

    for dest in all_dests:
        state_name = dest.state.name if dest.state else "?"
        img_name = dest.main_image.name if dest.main_image else "NO IMAGE"
        if "http" in img_name:
            img_display = unquote(img_name.replace("destinations/", "", 1))[:55]
        else:
            img_display = img_name[:55]
        print(f"{dest.name[:28].ljust(28)} | {state_name[:20].ljust(20)} | {img_display}")

if __name__ == "__main__":
    fix_data()
