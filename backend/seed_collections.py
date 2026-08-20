import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.destinations.models import Destination, TravelCollection
from apps.categories.models import Category

collections_seed = [
    {
        "name": "12 Sacred Jyotirlingas of India",
        "slug": "jyotirlingas",
        "subtitle": "The 12 Supreme Radiance Manifestations of Lord Shiva",
        "description": "Embark on India's most revered Shaivite spiritual odyssey across the 12 sacred Jyotirlinga shrines established across the subcontinent.",
        "cover_image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
        "featured": True,
        "display_order": 1,
        "query_filter": {"pilgrimage_collection": "jyotirlinga"}
    },
    {
        "name": "Maha Char Dham of India",
        "slug": "char-dham",
        "subtitle": "The Four Sacred Cardinal Abodes of Divine Liberation",
        "description": "Established by Adi Shankaracharya at the four corners of India: Badrinath (North), Puri (East), Rameswaram (South), and Dwarka (West).",
        "cover_image": "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80",
        "featured": True,
        "display_order": 2,
        "query_filter": {"pilgrimage_collection__in": ["char_dham", "chota_char_dham"]}
    },
    {
        "name": "Grand South Indian Temples",
        "slug": "south-indian-temples",
        "subtitle": "Architectural Marvels of Dravidian, Chola & Vijayanagara Dynasties",
        "description": "Experience towering gopurams, thousand-pillared stone corridors, and living traditions across Andhra Pradesh, Tamil Nadu, Telangana, and Karnataka.",
        "cover_image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        "featured": True,
        "display_order": 3,
        "query_filter": {"region": "south-india", "categories__slug__in": ["temples", "spiritual"]}
    },
    {
        "name": "Best Indian Beaches & Coastal Havens",
        "slug": "best-beaches",
        "subtitle": "Sun-Kissed Golden Sands from Goa to the Malabar & Coromandel Coasts",
        "description": "Discover idyllic palm-fringed coastlines, pristine watersports, clifftop cafes, and tranquil sunset bays.",
        "cover_image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
        "featured": True,
        "display_order": 4,
        "query_filter": {"categories__slug": "beaches"}
    },
    {
        "name": "Himalayan Peaks & High Altitude Treks",
        "slug": "himalayan-escapes",
        "subtitle": "Majestic Snow Peaks, Cold Deserts & Pine Valleys",
        "description": "From Kedarnath and Valley of Flowers to Spiti Valley and Gulmarg, explore the great mountain kingdom of India.",
        "cover_image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        "featured": True,
        "display_order": 5,
        "query_filter": {"categories__slug__in": ["mountains", "adventure", "trekking"]}
    },
    {
        "name": "UNESCO World Heritage of India",
        "slug": "unesco-heritage",
        "subtitle": "Centuries-Old Monolithic Monuments & Ancient Civilizations",
        "description": "Tour world-renowned rock-cut cave temples, royal empires, and bio-engineering wonders preserved for eternity.",
        "cover_image": "https://images.unsplash.com/photo-1600100397608-f010f443b718?auto=format&fit=crop&w=1200&q=80",
        "featured": True,
        "display_order": 6,
        "query_filter": {"tags__slug__in": ["unesco"]}
    }
]

for col in collections_seed:
    col_obj, created = TravelCollection.objects.update_or_create(
        slug=col['slug'],
        defaults={
            "name": col['name'],
            "subtitle": col['subtitle'],
            "description": col['description'],
            "cover_image": col['cover_image'],
            "featured": col['featured'],
            "display_order": col['display_order'],
            "published": True
        }
    )
    # Associate matching destinations
    matching_dests = Destination.objects.filter(published=True, **col['query_filter']).distinct()
    if matching_dests.exists():
        col_obj.destinations.set(matching_dests)
    print(f"Collection '{col_obj.name}' -> {col_obj.destinations.count()} destinations linked.")
