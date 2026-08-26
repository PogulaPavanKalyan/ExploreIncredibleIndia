import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.states.models import State
from apps.cities.models import City
from apps.destinations.models import Destination
from django.utils.text import slugify

OFFICIAL_12_JYOTIRLINGAS = [
    {
        'num': 1,
        'name': 'Somnath Jyotirlinga',
        'location': 'Prabhas Patan, Gir Somnath',
        'district': 'Gir Somnath',
        'state': 'Gujarat',
        'lat': 20.8880,
        'lng': 70.4012,
        'desc': 'First among the 12 sacred Jyotirlingas of Lord Shiva, located on the western coast of Gujarat at Prabhas Patan.',
        'img': 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=1200'
    },
    {
        'num': 2,
        'name': 'Mallikarjuna Jyotirlinga',
        'location': 'Srisailam',
        'district': 'Nandyal',
        'state': 'Andhra Pradesh',
        'lat': 16.0740,
        'lng': 78.8687,
        'desc': 'Sacred shrine located on the Nallamala Hills in Srisailam along the Krishna River, celebrating Lord Shiva and Goddess Parvati.',
        'img': 'https://images.unsplash.com/photo-1621831971712-421714207865?w=1200'
    },
    {
        'num': 3,
        'name': 'Mahakaleshwar Jyotirlinga',
        'location': 'Ujjain',
        'district': 'Ujjain',
        'state': 'Madhya Pradesh',
        'lat': 23.1827,
        'lng': 75.7682,
        'desc': 'Unique south-facing (Dakshinamurti) Jyotirlinga located on the banks of Kshipra River in ancient Ujjain, world-famous for its Bhasma Aarti.',
        'img': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200'
    },
    {
        'num': 4,
        'name': 'Omkareshwar Jyotirlinga',
        'location': 'Mandhata',
        'district': 'Khandwa',
        'state': 'Madhya Pradesh',
        'lat': 22.2436,
        'lng': 76.1517,
        'desc': 'Located on Mandhata island in the Narmada River shaped naturally in the sacred Hindu symbol of Om (ॐ).',
        'img': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200'
    },
    {
        'num': 5,
        'name': 'Kedarnath Jyotirlinga',
        'location': 'Kedarnath',
        'district': 'Rudraprayag',
        'state': 'Uttarakhand',
        'lat': 30.7346,
        'lng': 79.0669,
        'desc': 'Highest among the 12 Jyotirlingas nestled at 3,583 meters altitude near Mandakini river in the snow-capped Garhwal Himalayas.',
        'img': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200'
    },
    {
        'num': 6,
        'name': 'Bhimashankar Jyotirlinga',
        'location': 'Bhimashankar',
        'district': 'Pune',
        'state': 'Maharashtra',
        'lat': 19.0720,
        'lng': 73.5357,
        'desc': 'Surrounded by the dense Western Ghats wildlife sanctuary near Khed, source of the sacred Bhima River.',
        'img': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200'
    },
    {
        'num': 7,
        'name': 'Kashi Vishwanath Jyotirlinga',
        'location': 'Varanasi',
        'district': 'Varanasi',
        'state': 'Uttar Pradesh',
        'lat': 25.3109,
        'lng': 83.0107,
        'desc': 'The golden-spired spiritual heart of the holy city of Kashi along the western bank of the sacred Ganges River.',
        'img': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200'
    },
    {
        'num': 8,
        'name': 'Trimbakeshwar Jyotirlinga',
        'location': 'Trimbak, Nashik',
        'district': 'Nashik',
        'state': 'Maharashtra',
        'lat': 19.9322,
        'lng': 73.5303,
        'desc': 'Ancient black stone shrine at the foothills of Brahmagiri mountain, origin of the holy Godavari River featuring three lingas of Brahma, Vishnu and Shiva.',
        'img': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200'
    },
    {
        'num': 9,
        'name': 'Vaidyanath Jyotirlinga',
        'location': 'Deoghar',
        'district': 'Deoghar',
        'state': 'Jharkhand',
        'lat': 24.4926,
        'lng': 86.7001,
        'desc': 'Sacred shrine where Lord Shiva resides as Vaidya (Divine Healer), celebrated for the annual Shravani Mela pilgrimage.',
        'img': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200'
    },
    {
        'num': 10,
        'name': 'Nageshwar Jyotirlinga',
        'location': 'Near Dwarka',
        'district': 'Devbhumi Dwarka',
        'state': 'Gujarat',
        'lat': 22.3339,
        'lng': 69.0858,
        'desc': 'Enshrines Lord Shiva as Nageshwar (Lord of Serpents), featuring a towering 85-foot statue of Lord Shiva near Dwarka.',
        'img': 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=1200'
    },
    {
        'num': 11,
        'name': 'Rameshwaram Jyotirlinga',
        'location': 'Rameswaram',
        'district': 'Ramanathapuram',
        'state': 'Tamil Nadu',
        'lat': 9.2876,
        'lng': 79.3129,
        'desc': 'Southernmost Jyotirlinga established by Lord Rama on Pamban Island, famous for its magnificent outer corridors and 22 holy wells (tirthams).',
        'img': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200'
    },
    {
        'num': 12,
        'name': 'Grishneshwar Jyotirlinga',
        'location': 'Verul (Ellora), Chhatrapati Sambhajinagar',
        'district': 'Chhatrapati Sambhajinagar',
        'state': 'Maharashtra',
        'lat': 20.0249,
        'lng': 75.1687,
        'desc': 'The 12th and last Jyotirlinga constructed in red basalt stone, situated adjacent to the UNESCO World Heritage Ellora Caves.',
        'img': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200'
    }
]

def clean_and_seed_jyotirlingas():
    print("==================================================")
    print("Clean Seeding 12 Sacred Jyotirlingas...")
    print("==================================================")

    # 1. Reset all pilgrimage_collection='jyotirlinga' to 'none' first to remove unwanted duplicates
    reset_count = Destination.objects.filter(pilgrimage_collection='jyotirlinga').update(
        pilgrimage_collection='none',
        jyotirlinga_number=None
    )
    print(f"Reset {reset_count} existing destinations with pilgrimage_collection='jyotirlinga'.")

    # 2. Add / Update exact 12 Jyotirlingas
    created_count = 0
    updated_count = 0

    for item in OFFICIAL_12_JYOTIRLINGAS:
        st_obj, _ = State.objects.get_or_create(
            name=item['state'],
            defaults={'slug': slugify(item['state']), 'is_active': True}
        )

        dist_slug = slugify(f"{item['district']}-{item['state']}")
        city_obj = City.objects.filter(slug=dist_slug).first() or City.objects.filter(name=item['district'], state=st_obj).first()
        if not city_obj:
            city_obj = City.objects.create(
                name=item['district'],
                state=st_obj,
                slug=dist_slug,
                published=True
            )

        dest_slug = slugify(f"{item['name']}-{item['state']}")
        
        # Look up by slug or exact name
        dest = Destination.objects.filter(slug=dest_slug).first() or Destination.objects.filter(name__icontains=item['name'].replace(' Jyotirlinga', '')).first()

        if not dest:
            dest = Destination.objects.create(
                name=item['name'],
                slug=dest_slug,
                state=st_obj,
                district=item['district'],
                city=city_obj,
                region=st_obj.region,
                pilgrimage_collection='jyotirlinga',
                jyotirlinga_number=item['num'],
                famous_for=f"Sacred Jyotirlinga #{item['num']} located in {item['location']}, {item['state']}",
                short_description=item['desc'],
                description=f"{item['name']} ({item['location']}, {item['state']}). {item['desc']}",
                latitude=item['lat'],
                longitude=item['lng'],
                main_image=item['img'],
                published=True
            )
            created_count += 1
        else:
            dest.name = item['name']
            dest.state = st_obj
            dest.district = item['district']
            dest.city = city_obj
            dest.pilgrimage_collection = 'jyotirlinga'
            dest.jyotirlinga_number = item['num']
            dest.famous_for = f"Sacred Jyotirlinga #{item['num']} located in {item['location']}, {item['state']}"
            dest.short_description = item['desc']
            dest.latitude = item['lat']
            dest.longitude = item['lng']
            if not dest.main_image:
                dest.main_image = item['img']
            dest.published = True
            dest.save()
            updated_count += 1

    print("\n==================================================")
    print("12 SACRED JYOTIRLINGAS CLEAN SEEDING COMPLETED!")
    final_qs = Destination.objects.filter(pilgrimage_collection='jyotirlinga').order_by('jyotirlinga_number')
    print(f"Total Jyotirlingas in DB: {final_qs.count()}")
    for d in final_qs:
        print(f"  #{d.jyotirlinga_number}: {d.name} | {d.district}, {d.state.name}")
    print("==================================================")

if __name__ == '__main__':
    clean_and_seed_jyotirlingas()
