import os
import django
import sys
from django.test import Client

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def test_apis():
    client = Client()
    endpoints = [
        '/api/places/',
        '/api/regions/',
        '/api/states/',
        '/api/categories/',
        '/api/journey/locations/',
        '/api/search/?q=kerala',
        '/api/experiences/',
    ]
    
    for ep in endpoints:
        resp = client.get(ep)
        status = resp.status_code
        if status == 200:
            print(f"[OK] {ep}")
        else:
            print(f"[ERROR] {ep} returned {status}")
            
if __name__ == "__main__":
    test_apis()
