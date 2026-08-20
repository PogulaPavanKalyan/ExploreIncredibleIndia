import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient

client = APIClient()

queries = [
    ('best trekking places near Hyderabad', {}),
    ('temples near Vijayawada', {}),
    ('best beaches in Kerala', {}),
    ('Jyotirlingas in India', {}),
    ('places to visit in Tamil Nadu', {}),
    ('best waterfalls near Bangalore', {}),
    ('historical places in Rajasthan', {}),
    ('best Himalayan destinations', {}),
    ('wildlife places near Mumbai', {}),
    ('weekend trips from Hyderabad', {}),
    ('spiritual places in South India', {}),
    ('places near my location', {'lat': '17.3850', 'lng': '78.4867'})
]

print("=" * 70)
print("TESTING 12 NLP & GEOLOCATION SEARCH QUERIES")
print("=" * 70)

for idx, (q, params) in enumerate(queries, 1):
    p = dict(params)
    p['q'] = q
    res = client.get('/api/search/', p)
    data = res.json().get('data', {})
    dests = data.get('destinations', [])
    top_matches = []
    for d in dests[:3]:
        dist = d.get('distance_km')
        name = d.get('name')
        top_matches.append(f"{name} (~{dist} km)" if dist is not None else name)
    print(f"[{idx:02d}/12] \"{q}\" -> {len(dests)} results | Top: {top_matches}")

print("=" * 70)
