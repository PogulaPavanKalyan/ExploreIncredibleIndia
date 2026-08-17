import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.contrib.auth import get_user_model
from apps.states.models import State
from apps.cities.models import City
from apps.categories.models import Category
from apps.destinations.models import Destination, DestinationImage, DestinationVideo, Attraction, TravelTip
from apps.reviews.models import Review
from apps.favorites.models import Favorite
from apps.itineraries.models import Itinerary, ItineraryDay, ItineraryPlace
from apps.hotels.models import Hotel
from apps.restaurants.models import Restaurant
from apps.festivals.models import Festival
from apps.travel_guides.models import TravelGuide

User = get_user_model()

def seed_database():
    print("Starting database seeding...")

    # 1. Admin & Users
    admin_user, _ = User.objects.get_or_create(
        username="admin",
        defaults={
            "email": "admin@dekhobharat.com",
            "role": "ADMIN",
            "is_staff": True,
            "is_superuser": True,
            "first_name": "System",
            "last_name": "Admin"
        }
    )
    admin_user.set_password("AdminPass123!")
    admin_user.save()

    demo_user, _ = User.objects.get_or_create(
        username="demouser",
        defaults={
            "email": "user@dekhobharat.com",
            "role": "USER",
            "first_name": "Rahul",
            "last_name": "Sharma",
            "bio": "Passionate travel photographer and nature explorer based in Hyderabad."
        }
    )
    demo_user.set_password("UserPass123!")
    demo_user.save()

    # 2. States & UTs
    states_data = [
        {"name": "Andhra Pradesh", "code": "AP", "capital": "Amaravati", "banner_image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200", "thumbnail_image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400", "featured": True, "short_description": "Land of ancient temples, sun-kissed beaches, scenic Eastern Ghats, and rich cultural heritage."},
        {"name": "Telangana", "code": "TS", "capital": "Hyderabad", "banner_image": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200", "thumbnail_image": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", "featured": True, "short_description": "Nizamate royalty, tech hubs, monumental forts, and mouthwatering Hyderabadi Biryani."},
        {"name": "Kerala", "code": "KL", "capital": "Thiruvananthapuram", "banner_image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200", "thumbnail_image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400", "featured": True, "short_description": "God's Own Country with serene backwaters, lush tea plantations, and pristine beaches."},
        {"name": "Karnataka", "code": "KA", "capital": "Bengaluru", "banner_image": "https://images.unsplash.com/photo-1600100397608-f010e423b971?w=1200", "thumbnail_image": "https://images.unsplash.com/photo-1600100397608-f010e423b971?w=400", "featured": True, "short_description": "Architectural wonders of Hampi, royal palaces of Mysuru, and lush Coffee hills of Coorg."},
        {"name": "Goa", "code": "GA", "capital": "Panaji", "banner_image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200", "thumbnail_image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400", "featured": True, "short_description": "Tropical paradise famed for golden sands, vibrant nightlife, and Portuguese colonial charm."},
        {"name": "Rajasthan", "code": "RJ", "capital": "Jaipur", "banner_image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200", "thumbnail_image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400", "featured": True, "short_description": "Land of Rajput kings, majestic fortresses, desert safaris, and opulent palaces."},
        {"name": "Himachal Pradesh", "code": "HP", "capital": "Shimla", "banner_image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200", "thumbnail_image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400", "featured": True, "short_description": "Snow-capped Himalayan peaks, valley rivers, alpine meadows, and thrill adventures."}
    ]

    states_dict = {}
    for st in states_data:
        obj, _ = State.objects.get_or_create(name=st["name"], defaults=st)
        states_dict[st["name"]] = obj

    # 3. Cities
    cities_data = [
        {"name": "Visakhapatnam", "state": states_dict["Andhra Pradesh"], "is_popular": True, "image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600", "latitude": 17.6868, "longitude": 83.2185, "description": "The City of Destiny along the Bay of Bengal coast with beautiful beaches and hills."},
        {"name": "Araku Valley", "state": states_dict["Andhra Pradesh"], "is_popular": True, "image": "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600", "latitude": 18.3273, "longitude": 82.8775, "description": "Enchanting hill station in Eastern Ghats known for coffee plantations and tribal culture."},
        {"name": "Hyderabad", "state": states_dict["Telangana"], "is_popular": True, "image": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600", "latitude": 17.3850, "longitude": 78.4867, "description": "Historic Pearl City featuring Charminar, Golconda Fort, and Cyberabad."},
        {"name": "Kochi", "state": states_dict["Kerala"], "is_popular": True, "image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600", "latitude": 9.9312, "longitude": 76.2673, "description": "Vibrant port city with Chinese fishing nets and historic Fort Kochi streets."},
        {"name": "Munnar", "state": states_dict["Kerala"], "is_popular": True, "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600", "latitude": 10.0889, "longitude": 77.0595, "description": "Breathtaking hill resort wrapped in emerald green tea plantations."},
        {"name": "Jaipur", "state": states_dict["Rajasthan"], "is_popular": True, "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600", "latitude": 26.9124, "longitude": 75.7873, "description": "The Pink City of India adorned with royal palaces and grand architecture."},
        {"name": "Panaji", "state": states_dict["Goa"], "is_popular": True, "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600", "latitude": 15.4909, "longitude": 73.8278, "description": "Charming capital of Goa along the Mandovi river with Latin Quarter houses."}
    ]

    cities_dict = {}
    for ct in cities_data:
        obj, _ = City.objects.get_or_create(name=ct["name"], state=ct["state"], defaults=ct)
        cities_dict[ct["name"]] = obj

    # 4. Categories
    categories_data = [
        {"name": "Hill Stations", "icon": "Mountain", "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600", "description": "Cool, misty mountain retreats amidst pine forests and tea estates."},
        {"name": "Beaches", "icon": "Sun", "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600", "description": "Sunlit golden sands, soothing sea breeze, and vibrant coastal shores."},
        {"name": "Waterfalls", "icon": "Droplets", "image": "https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=600", "description": "Cascading freshwater falls set deep inside lush green rainforests."},
        {"name": "Temples & Spiritual", "icon": "Compass", "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600", "description": "Sacred shrines, ancient Dravidian architecture, and peaceful pilgrimage spots."},
        {"name": "Forts & Heritage", "icon": "Castle", "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600", "description": "Colossal stone fortresses, royal palaces, and timeless historic monuments."},
        {"name": "Wildlife & Nature", "icon": "Trees", "image": "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600", "description": "National parks, tiger sanctuaries, and pristine ecological habitats."},
        {"name": "Hidden Gems", "icon": "Sparkles", "image": "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600", "description": "Off-beat secret treasures, untamed natural spots, and untouched places."}
    ]

    cat_dict = {}
    for cat in categories_data:
        obj, _ = Category.objects.get_or_create(name=cat["name"], defaults=cat)
        cat_dict[cat["name"]] = obj

    # 5. Destinations
    dests_data = [
        {
            "name": "Araku Valley",
            "short_description": "Picturesque hill station in the Eastern Ghats famous for organic coffee, waterfalls, and tribal culture.",
            "description": "Araku Valley is an enchanting hill station situated in Visakhapatnam district of Andhra Pradesh. Surrounded by mountains, dense forests, and misty clouds, Araku is world-renowned for its aromatic organic coffee plantations, indigenous tribal museums, and serene weather throughout the year.",
            "history": "Inhabited for centuries by indigenous tribal communities, Araku Valley was introduced to coffee cultivation by the British in the 19th century.",
            "state": states_dict["Andhra Pradesh"],
            "city": cities_dict["Araku Valley"],
            "category": cat_dict["Hill Stations"],
            "best_time_to_visit": "October to March",
            "opening_time": "08:00 AM",
            "closing_time": "06:00 PM",
            "ticket_price": 50.00,
            "recommended_duration": "1-2 Days",
            "how_to_reach": "Reachable via scenic Vistadome train ride from Visakhapatnam railway station or via NH516E mountain road.",
            "latitude": 18.3273,
            "longitude": 82.8775,
            "featured": True,
            "trending": True,
            "is_hidden_gem": False,
            "budget_level": "medium",
            "travel_style": "nature",
            "avg_rating": 4.8,
            "total_reviews": 124,
            "main_image": "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1000"
        },
        {
            "name": "Borra Caves",
            "short_description": "Millions of years old speleothem limestone cave system situated in the Ananthagiri hills.",
            "description": "Borra Caves are one of the largest and deepest limestone caves in India. Discovered by William King of the Geological Survey of India in 1807, the caves exhibit magnificent stalactite and stalagmite formations illuminated with colorful spectral lighting.",
            "history": "Geologists estimate these speleothem formations date back over 150 million years, formed by the Gosthani River's subterranean flow.",
            "state": states_dict["Andhra Pradesh"],
            "city": cities_dict["Araku Valley"],
            "category": cat_dict["Hidden Gems"],
            "best_time_to_visit": "November to February",
            "opening_time": "10:00 AM",
            "closing_time": "05:00 PM",
            "ticket_price": 80.00,
            "recommended_duration": "2-3 Hours",
            "how_to_reach": "Located 29 km before Araku town on the Vizag-Araku highway. Borra Guhalu railway station is nearby.",
            "latitude": 18.2804,
            "longitude": 83.0392,
            "featured": True,
            "trending": True,
            "is_hidden_gem": True,
            "budget_level": "low",
            "travel_style": "adventure",
            "avg_rating": 4.7,
            "total_reviews": 98,
            "main_image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000"
        },
        {
            "name": "Rishikonda Beach",
            "short_description": "Clean, Blue Flag certified sandy beach in Visakhapatnam ideal for water sports and swimming.",
            "description": "Rishikonda Beach is a spectacular coastal haven flanked by emerald hills of the Eastern Ghats and the turquoise waters of the Bay of Bengal. It holds the prestigious Blue Flag eco-label certification and offers thrilling water sports including jet skiing, scuba diving, and sea kayaking.",
            "history": "Historically a serene fishing shore, Rishikonda was developed by APTDC into India's premiere east-coast water sports destination.",
            "state": states_dict["Andhra Pradesh"],
            "city": cities_dict["Visakhapatnam"],
            "category": cat_dict["Beaches"],
            "best_time_to_visit": "October to March",
            "opening_time": "05:00 AM",
            "closing_time": "08:00 PM",
            "ticket_price": 0.00,
            "recommended_duration": "3-4 Hours",
            "how_to_reach": "Located 15 km from Visakhapatnam city center along Beach Road.",
            "latitude": 17.7816,
            "longitude": 83.3831,
            "featured": True,
            "trending": True,
            "is_hidden_gem": False,
            "budget_level": "low",
            "travel_style": "beach",
            "avg_rating": 4.6,
            "total_reviews": 145,
            "main_image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000"
        },
        {
            "name": "Charminar",
            "short_description": "Iconic 16th-century mosque and global symbol of Hyderabad situated in the heart of the Old City.",
            "description": "Built in 1591 by Muhammad Quli Qutb Shah, Charminar stands grandly as an architectural masterpiece featuring four grand arches and four 56-meter tall minarets overlooking bustling Laad Bazaar markets.",
            "history": "Constructed to commemorate the eradication of a devastating plague epidemics in Hyderabad.",
            "state": states_dict["Telangana"],
            "city": cities_dict["Hyderabad"],
            "category": cat_dict["Forts & Heritage"],
            "best_time_to_visit": "October to March",
            "opening_time": "09:30 AM",
            "closing_time": "05:30 PM",
            "ticket_price": 25.00,
            "recommended_duration": "2 Hours",
            "how_to_reach": "Easily accessible via Hyderabad Metro (Charminar/MGBS station) or local auto-rickshaws.",
            "latitude": 17.3616,
            "longitude": 78.4747,
            "featured": True,
            "trending": True,
            "is_hidden_gem": False,
            "budget_level": "low",
            "travel_style": "historical",
            "avg_rating": 4.8,
            "total_reviews": 320,
            "main_image": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1000"
        },
        {
            "name": "Tea Gardens of Munnar",
            "short_description": "Vast rolling hill slopes carpeted with vibrant green tea bushes in Kerala's Western Ghats.",
            "description": "Munnar is situated at 1,600 meters above sea level where three mountain streams meet. The endless expanse of tea plantations, mist-covered valleys, and rare flora like Neelakurinji flowers make Munnar a romantic paradise.",
            "history": "Tea cultivation was pioneered by John Daniel Munro in the 1870s and developed extensively by Tata Tea.",
            "state": states_dict["Kerala"],
            "city": cities_dict["Munnar"],
            "category": cat_dict["Hill Stations"],
            "best_time_to_visit": "September to March",
            "opening_time": "06:00 AM",
            "closing_time": "06:00 PM",
            "ticket_price": 0.00,
            "recommended_duration": "2 Days",
            "how_to_reach": "110 km drive from Cochin International Airport via scenic Aluva-Munnar road.",
            "latitude": 10.0889,
            "longitude": 77.0595,
            "featured": True,
            "trending": True,
            "is_hidden_gem": False,
            "budget_level": "medium",
            "travel_style": "couple",
            "avg_rating": 4.9,
            "total_reviews": 210,
            "main_image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000"
        },
        {
            "name": "Hawa Mahal",
            "short_description": "Palace of Winds in Jaipur constructed with pink and red sandstone with 953 intricate jharokha windows.",
            "description": "Hawa Mahal was constructed in 1799 by Maharaja Sawai Pratap Singh. Designed like the crown of Lord Krishna, its honeycomb structure allowed royal women to observe street festivals without being seen.",
            "history": "Designed by Lal Chand Ustad, the 5-story facade remains naturally cooled by air currents through its 953 latticework windows.",
            "state": states_dict["Rajasthan"],
            "city": cities_dict["Jaipur"],
            "category": cat_dict["Forts & Heritage"],
            "best_time_to_visit": "October to March",
            "opening_time": "09:00 AM",
            "closing_time": "05:00 PM",
            "ticket_price": 50.00,
            "recommended_duration": "2 Hours",
            "how_to_reach": "Situated in Badi Choupad in Jaipur pink city center, 12 km from Jaipur Airport.",
            "latitude": 26.9239,
            "longitude": 75.8267,
            "featured": True,
            "trending": True,
            "is_hidden_gem": False,
            "budget_level": "low",
            "travel_style": "cultural",
            "avg_rating": 4.8,
            "total_reviews": 280,
            "main_image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000"
        }
    ]

    for d_data in dests_data:
        dest_obj, created = Destination.objects.get_or_create(
            name=d_data["name"],
            defaults=d_data
        )
        if created:
            # Add images
            DestinationImage.objects.create(
                destination=dest_obj,
                image_url=dest_obj.main_image,
                caption=f"Panaromic view of {dest_obj.name}"
            )
            # Add Travel tips
            TravelTip.objects.create(
                destination=dest_obj,
                tip="Plan your visit early in the morning to beat tourist crowds and enjoy cool weather."
            )
            # Add sample review
            Review.objects.create(
                user=demo_user,
                destination=dest_obj,
                rating=5,
                title=f"Unforgettable experience at {dest_obj.name}!",
                comment="Absolute stunning place! Highly recommended for families and couples.",
                is_approved=True
            )
            # Add favorite
            Favorite.objects.create(
                user=demo_user,
                destination=dest_obj
            )

    print("Seeded States, Cities, Categories, Destinations, Reviews, and Favorites successfully!")

if __name__ == '__main__':
    seed_database()
