import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient
client = APIClient()

res = client.get('/api/collections/')
print('List Status:', res.status_code)
for item in res.json().get('data', []):
    print(f" - {item['name']} ({item['slug']}) -> {item['destination_count']} destinations")

res_detail = client.get('/api/collections/jyotirlingas/')
print('Detail Status:', res_detail.status_code, 'Destinations:', len(res_detail.json().get('data', {}).get('destinations', [])))
