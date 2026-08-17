import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.destinations.models import Destination

print('=== FEATURED DESTINATIONS ===')
featured = Destination.objects.filter(featured=True).select_related('state')[:8]
for d in featured:
    img = d.main_image
    img_str = str(img) if img else 'NONE'
    state_name = d.state.name if d.state else 'None'
    print(f'  [{d.id}] {d.name} | state={state_name} | main_image={img_str[:70]}')

print()
print(f'Total featured: {featured.count()}')

print()
print('=== REGIONS ===')
try:
    from apps.regions.models import Region
    regions = Region.objects.all()[:6]
    for r in regions:
        poster = str(r.poster_image) if r.poster_image else 'NONE'
        video = str(r.desktop_video) if r.desktop_video else 'NONE'
        print(f'  [{r.id}] {r.name} | poster={poster[:60]} | video={video[:60]}')
    print(f'Total regions: {regions.count()}')
except Exception as e:
    print(f'Region error: {e}')
