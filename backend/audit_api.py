import json, urllib.request

endpoints = [
    ('Featured Destinations', 'http://127.0.0.1:8000/api/places/?featured=true&page_size=3'),
    ('Trending Destinations', 'http://127.0.0.1:8000/api/places/?trending=true&page_size=3'),
    ('Regions API', 'http://127.0.0.1:8000/api/regions/'),
]

for label, url in endpoints:
    print(f'\n=== {label} ===')
    try:
        with urllib.request.urlopen(url, timeout=5) as r:
            data = json.loads(r.read())
            if isinstance(data, dict):
                items = data.get('data') or data.get('results') or []
                print(f'  Count: {len(items)}')
                for d in items[:3]:
                    name = d.get('name', '?')
                    img = str(d.get('main_image') or d.get('poster_image') or '')[:65]
                    print(f'  - {name} | img={img}')
            elif isinstance(data, list):
                print(f'  Count: {len(data)}')
                for d in data[:3]:
                    name = d.get('name', '?')
                    img = str(d.get('main_image') or d.get('poster_image') or '')[:65]
                    print(f'  - {name} | img={img}')
    except Exception as e:
        print(f'  ERROR: {e}')
