import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient

client = APIClient()

test_cases = [
    {
        "name": "CASE 1: Hyderabad (3 Days, ₹10k, Temple+Nature)",
        "payload": {
            "starting_location": "Hyderabad",
            "duration": 3,
            "budget": 10000,
            "interests": ["temples", "nature"],
            "companion": "family",
            "region": "south-india"
        }
    },
    {
        "name": "CASE 2: Bangalore (2 Days, Trekking)",
        "payload": {
            "starting_location": "Bangalore",
            "duration": 2,
            "budget": 6000,
            "interests": ["trekking", "adventure"],
            "companion": "friends"
        }
    },
    {
        "name": "CASE 3: Chennai (4 Days, Beach+Nature)",
        "payload": {
            "starting_location": "Chennai",
            "duration": 4,
            "budget": 15000,
            "interests": ["beaches", "nature"],
            "companion": "couple"
        }
    },
    {
        "name": "CASE 4: Delhi (5 Days, Heritage+Historical)",
        "payload": {
            "starting_location": "Delhi",
            "duration": 5,
            "budget": 25000,
            "interests": ["heritage", "historical"],
            "companion": "solo",
            "region": "north-india"
        }
    },
    {
        "name": "CASE 5: South India (Spiritual)",
        "payload": {
            "starting_location": "Hyderabad",
            "duration": 3,
            "budget": 12000,
            "interests": ["spiritual"],
            "companion": "family",
            "region": "south-india"
        }
    }
]

print("=" * 65)
print("TESTING 5 AI TRAVEL PLANNER SCENARIOS")
print("=" * 65)

for tc in test_cases:
    res = client.post('/api/trips/plan/', tc['payload'], format='json')
    if res.status_code == 200:
        data = res.json().get('data', {})
        summary = data.get('summary', {})
        itinerary = data.get('itinerary', [])
        budget_est = data.get('budget_estimate', {})
        print(f"\n[PASS] {tc['name'].replace('₹', 'Rs. ')}")
        print(f"  * Trip Title:  {summary.get('title')}")
        print(f"  * Primary Spot: {summary.get('primary_destination')}")
        print(f"  * Total Est.:   Rs. {int(budget_est.get('total')):,} ({budget_est.get('currency')})")
        print(f"  * Days Count:   {len(itinerary)} days planned")
        print(f"  * Day 1 Title:  {itinerary[0].get('title') if itinerary else 'N/A'}")
    else:
        print(f"\n[FAIL] {tc['name']} -> HTTP {res.status_code}: {res.content}")

print("\n" + "=" * 65)
