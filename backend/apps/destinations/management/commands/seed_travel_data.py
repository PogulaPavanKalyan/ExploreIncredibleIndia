from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.states.models import State
from apps.cities.models import City
from apps.categories.models import Category
import requests
from django.core.files.base import ContentFile
from apps.destinations.models import Destination, DestinationImage, DestinationVideo, Attraction, TravelTip

class Command(BaseCommand):
    help = 'Seeds initial sample travel data for states, cities, categories, destinations, attractions, and travel tips.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting Phase 2 Travel Data Seeding...'))

        # 1. States (5 states)
        states_data = [
            {
                "name": "Andhra Pradesh",
                "code": "AP",
                "capital": "Amaravati",
                "description": "Known as the Rice Bowl of India, Andhra Pradesh boasts scenic hill stations, ancient shrines, and pristine coastlines along the Bay of Bengal.",
                "latitude": 15.9129,
                "longitude": 79.7400,
                "published": True
            },
            {
                "name": "Telangana",
                "code": "TG",
                "capital": "Hyderabad",
                "description": "A vibrant South Indian state rich in Nizam heritage, historic monuments, bustling tech hubs, and delicious Hyderabadi cuisine.",
                "latitude": 18.1124,
                "longitude": 79.0193,
                "published": True
            },
            {
                "name": "Kerala",
                "code": "KL",
                "capital": "Thiruvananthapuram",
                "description": "God's Own Country, famed for backwaters, lush green hill stations, tea plantations, and rich Ayurvedic traditions.",
                "latitude": 10.8505,
                "longitude": 76.2711,
                "published": True
            },
            {
                "name": "Karnataka",
                "code": "KA",
                "capital": "Bengaluru",
                "description": "A state blending ancient heritage like Hampi and Mysuru with modern tech centers, wildlife sanctuaries, and Western Ghats beauty.",
                "latitude": 15.3173,
                "longitude": 75.7139,
                "published": True
            },
            {
                "name": "Rajasthan",
                "code": "RJ",
                "capital": "Jaipur",
                "description": "The Land of Kings, world-famous for majestic forts, royal palaces, golden deserts, vibrant colorful attire, and rich folklore.",
                "latitude": 27.0238,
                "longitude": 74.2179,
                "published": True
            }
        ]

        states_dict = {}
        for sdata in states_data:
            state, created = State.objects.update_or_create(
                name=sdata["name"],
                defaults={
                    "slug": slugify(sdata["name"]),
                    "code": sdata["code"],
                    "capital": sdata["capital"],
                    "description": sdata["description"],
                    "latitude": sdata["latitude"],
                    "longitude": sdata["longitude"],
                    "published": sdata["published"]
                }
            )
            states_dict[state.name] = state
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} State: {state.name}")

        # 2. Cities (10 cities)
        cities_data = [
            {"name": "Araku", "state": states_dict["Andhra Pradesh"], "description": "Picturesque valley surrounded by Eastern Ghats.", "latitude": 18.3273, "longitude": 82.8775},
            {"name": "Visakhapatnam", "state": states_dict["Andhra Pradesh"], "description": "Coastal port city known for beaches and naval presence.", "latitude": 17.6868, "longitude": 83.2185},
            {"name": "Hyderabad", "state": states_dict["Telangana"], "description": "Historic city of pearls, monuments, and biryani.", "latitude": 17.3850, "longitude": 78.4867},
            {"name": "Warangal", "state": states_dict["Telangana"], "description": "Heritage city known for Kakatiya dynasty structures.", "latitude": 17.9689, "longitude": 79.5941},
            {"name": "Kochi", "state": states_dict["Kerala"], "description": "Major port city blending Portuguese, Dutch, and Indian culture.", "latitude": 9.9312, "longitude": 76.2673},
            {"name": "Munnar", "state": states_dict["Kerala"], "description": "Famous hill station adorned with sprawling tea plantations.", "latitude": 10.0889, "longitude": 77.0595},
            {"name": "Bengaluru", "state": states_dict["Karnataka"], "description": "Garden city of India and IT capital.", "latitude": 12.9716, "longitude": 77.5946},
            {"name": "Mysuru", "state": states_dict["Karnataka"], "description": "Royal city celebrated for Mysuru Palace and Dasara festival.", "latitude": 12.2958, "longitude": 76.6394},
            {"name": "Jaipur", "state": states_dict["Rajasthan"], "description": "The Pink City of magnificent forts and palaces.", "latitude": 26.9124, "longitude": 75.7873},
            {"name": "Udaipur", "state": states_dict["Rajasthan"], "description": "The City of Lakes surrounded by Aravalli hills.", "latitude": 24.5854, "longitude": 73.7125}
        ]

        cities_dict = {}
        for cdata in cities_data:
            city, created = City.objects.update_or_create(
                name=cdata["name"],
                state=cdata["state"],
                defaults={
                    "slug": slugify(f"{cdata['name']}-{cdata['state'].name}"),
                    "description": cdata["description"],
                    "latitude": cdata["latitude"],
                    "longitude": cdata["longitude"],
                    "published": True
                }
            )
            cities_dict[cdata["name"]] = city
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} City: {city.name}")

        # 3. Categories (19 categories)
        categories_list = [
            "Temples", "Beaches", "Waterfalls", "Hill Stations", "Forts",
            "Historical Places", "Wildlife", "National Parks", "Museums", "Lakes",
            "Adventure", "Spiritual", "Cultural", "Heritage", "Hidden Gems",
            "Family", "Couple", "Solo", "Photography"
        ]

        categories_dict = {}
        for cat_name in categories_list:
            cat, created = Category.objects.update_or_create(
                name=cat_name,
                defaults={
                    "slug": slugify(cat_name),
                    "description": f"Explore tourist places categorized under {cat_name}.",
                    "published": True
                }
            )
            categories_dict[cat_name] = cat

        self.stdout.write(f"Processed {len(categories_dict)} Categories.")

        # 4. Destinations (20 destinations)
        destinations_list = [
            {
                "name": "Araku Valley",
                "state": states_dict["Andhra Pradesh"],
                "city": cities_dict["Araku"],
                "cats": ["Hill Stations", "Nature", "Hidden Gems", "Family"],
                "image_url": "https://images.unsplash.com/photo-1622308644420-b3118ef5565f?w=800",
                "short_description": "A tranquil hill station nestled in the Eastern Ghats of Andhra Pradesh.",
                "description": "Araku Valley is a breathtaking hill station famed for its lush green coffee plantations, tribal culture, cool climate, and scenic waterfall cascades.",
                "history": "Inhabited by various indigenous tribal communities for centuries, Araku coffee was introduced by the British in the early 1900s.",
                "best_time_to_visit": "October to March",
                "ticket_price": 0.00,
                "latitude": 18.3273,
                "longitude": 82.8775,
                "featured": True,
                "trending": True,
                "attractions": [
                    {"name": "Coffee Museum", "description": "Showcases the origin and processing of local organic coffee."},
                    {"name": "Chaparai Waterfalls", "description": "Natural water sliding rock spot popular among visitors."}
                ],
                "tips": [
                    {"title": "Footwear", "description": "Carry comfortable walking shoes for valley exploration."},
                    {"title": "Local Craft", "description": "Purchase freshly roasted organic Araku coffee powder."}
                ]
            },
            {
                "name": "Borra Caves",
                "state": states_dict["Andhra Pradesh"],
                "city": cities_dict["Araku"],
                "cats": ["Historical Places", "Adventure", "Hidden Gems"],
                "image_url": "https://images.unsplash.com/photo-1629196914569-b5f7e7f7223e?w=800",
                "short_description": "One of the deepest and largest limestone caves in India.",
                "description": "Borra Caves feature spectacular stalactite and stalagmites rock formations formed over millions of years.",
                "history": "Discovered by William King of the Geological Survey of India in 1807.",
                "best_time_to_visit": "November to February",
                "ticket_price": 80.00,
                "latitude": 18.2804,
                "longitude": 83.0392,
                "featured": True,
                "trending": False,
                "attractions": [
                    {"name": "Stalactite Formations", "description": "Naturally formed limestone structures mimicking revered shapes."}
                ],
                "tips": [
                    {"title": "Safety", "description": "Watch your step as cave walkways can be slippery."}
                ]
            },
            {
                "name": "RK Beach",
                "state": states_dict["Andhra Pradesh"],
                "city": cities_dict["Visakhapatnam"],
                "cats": ["Beaches", "Family", "Couple"],
                "image_url": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800",
                "short_description": "Popular beachfront promenade in Visakhapatnam along the Bay of Bengal.",
                "description": "Ramakrishna Beach offers golden sands, coastal street food, submarine museum exhibits, and sunrise views.",
                "history": "Named after the Ramakrishna Mission ashram situated near the seafront.",
                "best_time_to_visit": "October to March",
                "ticket_price": 0.00,
                "latitude": 17.7101,
                "longitude": 83.3164,
                "featured": False,
                "trending": True,
                "attractions": [
                    {"name": "INS Kursura Submarine Museum", "description": "Decommissioned submarine converted into a museum."}
                ],
                "tips": [
                    {"title": "Swimming Warning", "description": "Strong currents make swimming dangerous; stay near shoreline."}
                ]
            },
            {
                "name": "Kailasagiri",
                "state": states_dict["Andhra Pradesh"],
                "city": cities_dict["Visakhapatnam"],
                "cats": ["Hill Stations", "Family", "Photography"],
                "image_url": "https://images.unsplash.com/photo-1588661668205-d069002224b7?w=800",
                "short_description": "Hilltop park overlooking the Bay of Bengal and Vizag city skyline.",
                "description": "Features massive statues of Lord Shiva and Parvathi, ropeway rides, floral clock, and panoramic viewpoints.",
                "history": "Developed by Visakhapatnam Metropolitan Region Development Authority as a premiere tourist park.",
                "best_time_to_visit": "September to March",
                "ticket_price": 20.00,
                "latitude": 17.7492,
                "longitude": 83.3422,
                "featured": False,
                "trending": False,
                "attractions": [
                    {"name": "Ropeway Ride", "description": "Scenic cable car trip from foothills to the hill summit."}
                ],
                "tips": [
                    {"title": "Timing", "description": "Visit during sunset for breathtaking ocean views."}
                ]
            },
            {
                "name": "Charminar",
                "state": states_dict["Telangana"],
                "city": cities_dict["Hyderabad"],
                "cats": ["Historical Places", "Heritage", "Cultural"],
                "image_url": "https://images.unsplash.com/photo-1513415713437-0fdb2df32467?w=800",
                "short_description": "Iconic 16th-century mosque with four grand minarets in Old Hyderabad.",
                "description": "Charminar stands as a global symbol of Hyderabad, surrounded by vibrant bangles and spice markets.",
                "history": "Built in 1591 by Quli Qutb Shah to commemorate the eradication of a devastating plague.",
                "best_time_to_visit": "October to March",
                "ticket_price": 25.00,
                "latitude": 17.3616,
                "longitude": 78.4747,
                "featured": True,
                "trending": True,
                "attractions": [
                    {"name": "Laad Bazaar", "description": "Famous market renowned for traditional lac bangles."}
                ],
                "tips": [
                    {"title": "Food", "description": "Try Irani Chai and Osmania biscuits at nearby cafes."}
                ]
            },
            {
                "name": "Golconda Fort",
                "state": states_dict["Telangana"],
                "city": cities_dict["Hyderabad"],
                "cats": ["Forts", "Heritage", "Historical Places"],
                "image_url": "https://images.unsplash.com/photo-1625807963286-90c749970c9f?w=800",
                "short_description": "Massive medieval fortress renowned for acoustic architecture and diamond vault history.",
                "description": "Golconda Fort was the capital of the Qutb Shahi dynasty and home to legendary diamonds like Koh-i-Noor.",
                "history": "Originally constructed as a mud fort by the Kakatiya rulers in the 12th century.",
                "best_time_to_visit": "November to February",
                "ticket_price": 25.00,
                "latitude": 17.3833,
                "longitude": 78.4011,
                "featured": True,
                "trending": False,
                "attractions": [
                    {"name": "Fateh Darwaza Acoustic Point", "description": "Handclap at the gate reverberates at the highest hilltop citadel."}
                ],
                "tips": [
                    {"title": "Guided Tour", "description": "Hire an official guide to appreciate the complex acoustic engineering."}
                ]
            },
            {
                "name": "Hussain Sagar Lake",
                "state": states_dict["Telangana"],
                "city": cities_dict["Hyderabad"],
                "cats": ["Lakes", "Family", "Couple"],
                "image_url": "https://images.unsplash.com/photo-1596708761007-8e65e6d616d6?w=800",
                "short_description": "Heart-shaped lake featuring a monolith Buddha statue at Gibraltar Rock.",
                "description": "Connects Hyderabad and Secunderabad, offering speed boating, water sports, and evening promenades along Marine Drive.",
                "history": "Excavated in 1563 by Ibrahim Quli Qutb Shah.",
                "best_time_to_visit": "October to March",
                "ticket_price": 0.00,
                "latitude": 17.4239,
                "longitude": 78.4738,
                "featured": False,
                "trending": False,
                "attractions": [
                    {"name": "Monolith Buddha Statue", "description": "18-meter tall granite statue situated in the center of the lake."}
                ],
                "tips": [
                    {"title": "Boating", "description": "Take the ferry ride to visit the central statue pedestal."}
                ]
            },
            {
                "name": "Thousand Pillar Temple",
                "state": states_dict["Telangana"],
                "city": cities_dict["Warangal"],
                "cats": ["Temples", "Heritage", "Historical Places"],
                "image_url": "https://images.unsplash.com/photo-1555581122-c36399b9ddda?w=800",
                "short_description": "Architectural marvel of the Kakatiya period dedicated to Shiva, Vishnu, and Surya.",
                "description": "Features finely carved star-shaped rock pillars, a massive monolithic Nandi bull, and intricate rock sculptures.",
                "history": "Constructed in 1163 AD under the patronage of King Rudra Deva.",
                "best_time_to_visit": "October to March",
                "ticket_price": 0.00,
                "latitude": 17.9866,
                "longitude": 79.5841,
                "featured": False,
                "trending": False,
                "attractions": [
                    {"name": "Monolithic Nandi Bull", "description": "Carved from a single black basalt rock."}
                ],
                "tips": [
                    {"title": "Photography", "description": "Capture morning sunlight falling on the carved pillars."}
                ]
            },
            {
                "name": "Mattupetty Dam",
                "state": states_dict["Kerala"],
                "city": cities_dict["Munnar"],
                "cats": ["Lakes", "Hill Stations", "Family"],
                "image_url": "https://images.unsplash.com/photo-1593693397690-362cb9666c6b?w=800",
                "short_description": "Scenic concrete gravity dam surrounded by tea gardens and mist-covered hills.",
                "description": "Mattupetty offers speed boating, elephant sightings near water edges, and fresh dairy farm visits nearby.",
                "history": "Constructed under the Pallivasal Hydro-electric project in the 1940s.",
                "best_time_to_visit": "September to May",
                "ticket_price": 10.00,
                "latitude": 10.1062,
                "longitude": 77.1242,
                "featured": True,
                "trending": True,
                "attractions": [
                    {"name": "Mattupetty Lake Boating", "description": "Speedboat tours navigating through tea estate backdrops."}
                ],
                "tips": [
                    {"title": "Warm Clothing", "description": "Temperatures drop significantly in late evenings."}
                ]
            },
            {
                "name": "Anamudi Peak",
                "state": states_dict["Kerala"],
                "city": cities_dict["Munnar"],
                "cats": ["Hill Stations", "Adventure", "Wildlife"],
                "image_url": "https://images.unsplash.com/photo-1592397940256-424a919246df?w=800",
                "short_description": "Highest peak in South India located inside Eravikulam National Park.",
                "description": "Standing at 2,695 meters, Anamudi is home to the endangered Nilgiri Tahr and rare Neelakurinji flowers.",
                "history": "Name translates to 'Elephant's Forehead' owing to its shape.",
                "best_time_to_visit": "November to April",
                "ticket_price": 125.00,
                "latitude": 10.1700,
                "longitude": 77.0600,
                "featured": True,
                "trending": False,
                "attractions": [
                    {"name": "Eravikulam National Park Safari", "description": "Park safari buses traversing grassland slopes."}
                ],
                "tips": [
                    {"title": "Passes", "description": "Book park entry tickets online in advance to avoid long queues."}
                ]
            },
            {
                "name": "Fort Kochi Beach",
                "state": states_dict["Kerala"],
                "city": cities_dict["Kochi"],
                "cats": ["Beaches", "Cultural", "Heritage"],
                "image_url": "https://images.unsplash.com/photo-1627914856017-f5847e0cb39d?w=800",
                "short_description": "Historic beachfront famous for iconic Chinese Fishing Nets.",
                "description": "A tranquil walkway framed by colonial heritage buildings, art cafes, and sunset views over Arabian Sea trade routes.",
                "history": "Chinese fishing nets were introduced by trader court emissaries of Kublai Khan.",
                "best_time_to_visit": "October to March",
                "ticket_price": 0.00,
                "latitude": 9.9656,
                "longitude": 76.2427,
                "featured": False,
                "trending": True,
                "attractions": [
                    {"name": "Chinese Fishing Nets", "description": "Cantilevered wooden structures operated by local fishermen."}
                ],
                "tips": [
                    {"title": "Art Biennale", "description": "Check event dates if visiting during Kochi-Muziris Biennale."}
                ]
            },
            {
                "name": "Willingdon Island",
                "state": states_dict["Kerala"],
                "city": cities_dict["Kochi"],
                "cats": ["Heritage", "Solo", "Cultural"],
                "image_url": "https://images.unsplash.com/photo-1624584288019-3545dfc7c724?w=800",
                "short_description": "Largest artificial island in India, headquarters of the Southern Naval Command.",
                "description": "Surrounded by Kochi backwaters, housing luxury port hotels, maritime infrastructure, and historic docks.",
                "history": "Created in 1936 during port dredging overseen by Lord Willingdon.",
                "best_time_to_visit": "October to April",
                "ticket_price": 0.00,
                "latitude": 9.9450,
                "longitude": 76.2680,
                "featured": False,
                "trending": False,
                "attractions": [
                    {"name": "Port Heritage Tour", "description": "Scenic ferry journeys linking island docks with Fort Kochi."}
                ],
                "tips": [
                    {"title": "Ferry", "description": "Utilize state passenger ferries for affordable scenic transport."}
                ]
            },
            {
                "name": "Lalbagh Botanical Garden",
                "state": states_dict["Karnataka"],
                "city": cities_dict["Bengaluru"],
                "cats": ["National Parks", "Family", "Photography"],
                "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?w=800",
                "short_description": "240-acre botanical haven housing centuries-old trees and a famous Glass House.",
                "description": "Lalbagh features over 1,000 species of flora, a serene lake, bonsai garden, and bi-annual flower shows.",
                "history": "Commissioned by Hyder Ali in 1760 and completed by his son Tipu Sultan.",
                "best_time_to_visit": "All Year (Flowers in Jan & Aug)",
                "ticket_price": 30.00,
                "latitude": 12.9507,
                "longitude": 77.5848,
                "featured": True,
                "trending": True,
                "attractions": [
                    {"name": "Glass House", "description": "Modelled after London's Crystal Palace for flower exhibitions."}
                ],
                "tips": [
                    {"title": "Morning Walk", "description": "Free entry for morning walkers before 8:00 AM."}
                ]
            },
            {
                "name": "Cubbon Park",
                "state": states_dict["Karnataka"],
                "city": cities_dict["Bengaluru"],
                "cats": ["Family", "Solo", "Cultural"],
                "image_url": "https://images.unsplash.com/photo-1602737648316-db5fa295c276?w=800",
                "short_description": "Sprawling green landmark in the heart of Bengaluru city.",
                "description": "Shaded by bamboo groves and heritage trees, accommodating High Court buildings, central library, and play zones.",
                "history": "Created in 1870 under Major General Richard Sankey.",
                "best_time_to_visit": "All Year",
                "ticket_price": 0.00,
                "latitude": 12.9757,
                "longitude": 77.5929,
                "featured": False,
                "trending": False,
                "attractions": [
                    {"name": "Seshadri Iyer Memorial Hall", "description": "Classic red brick building housing the Central Library."}
                ],
                "tips": [
                    {"title": "Traffic-Free Sundays", "description": "Roads inside the park are closed to motor vehicles on Sundays."}
                ]
            },
            {
                "name": "Mysuru Palace",
                "state": states_dict["Karnataka"],
                "city": cities_dict["Mysuru"],
                "cats": ["Heritage", "Historical Places", "Cultural"],
                "image_url": "https://images.unsplash.com/photo-1600021323381-8067b453e059?w=800",
                "short_description": "Grand Indo-Saracenic royal residence of the Wadiyar dynasty.",
                "description": "Adorned with stained glass, carved mahogany doors, golden royal thrones, and illuminated by 100,000 bulbs on holidays.",
                "history": "Current palace structure was designed by Henry Irwin and completed in 1912.",
                "best_time_to_visit": "October to March",
                "ticket_price": 100.00,
                "latitude": 12.3052,
                "longitude": 76.6552,
                "featured": True,
                "trending": True,
                "attractions": [
                    {"name": "Durbar Hall", "description": "Grand ceremonial hall with ornate pillars and ceiling paintings."}
                ],
                "tips": [
                    {"title": "Illumination", "description": "Witness the spectacular palace lighting on Sunday evenings."}
                ]
            },
            {
                "name": "Chamundi Hill Temple",
                "state": states_dict["Karnataka"],
                "city": cities_dict["Mysuru"],
                "cats": ["Temples", "Spiritual", "Heritage"],
                "image_url": "https://images.unsplash.com/photo-1623058866388-6dfa61cc3807?w=800",
                "short_description": "Ancient hilltop temple dedicated to Goddess Chamundeshwari overlooking Mysuru.",
                "description": "Features a towering 7-tier gopuram, giant Nandi statue on stone steps, and panoramic city views.",
                "history": "Patronized by Maharajas of Mysuru for centuries.",
                "best_time_to_visit": "September to February",
                "ticket_price": 0.00,
                "latitude": 12.2747,
                "longitude": 76.6706,
                "featured": False,
                "trending": False,
                "attractions": [
                    {"name": "Giant Nandi Monolith", "description": "16-foot tall carved bull statue halfway up the hill steps."}
                ],
                "tips": [
                    {"title": "Dress Code", "description": "Wear conservative attire appropriate for temple entry."}
                ]
            },
            {
                "name": "Amber Fort",
                "state": states_dict["Rajasthan"],
                "city": cities_dict["Jaipur"],
                "cats": ["Forts", "Heritage", "Historical Places"],
                "image_url": "https://images.unsplash.com/photo-1599661559868-d0fbc185906d?w=800",
                "short_description": "Majestic hilltop fort crafted from yellow and pink sandstone above Maota Lake.",
                "description": "Renowned for Sheesh Mahal (Mirror Palace), grand courtyards, subterranean passages, and Mughal garden layouts.",
                "history": "Constructed by Raja Man Singh I in 1592.",
                "best_time_to_visit": "October to March",
                "ticket_price": 100.00,
                "latitude": 26.9855,
                "longitude": 75.8513,
                "featured": True,
                "trending": True,
                "attractions": [
                    {"name": "Sheesh Mahal", "description": "Palace of mirrors where candlelight reflects across thousands of tiny convex mirrors."}
                ],
                "tips": [
                    {"title": "Sound & Light Show", "description": "Attend the evening light show detailing Rajput history."}
                ]
            },
            {
                "name": "Hawa Mahal",
                "state": states_dict["Rajasthan"],
                "city": cities_dict["Jaipur"],
                "cats": ["Historical Places", "Heritage", "Photography"],
                "image_url": "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=800",
                "short_description": "Palace of Winds built with 953 intricate honeycomb lattice windows.",
                "description": "Constructed so royal ladies could observe everyday street festivals unobserved from behind latticed jharokhas.",
                "history": "Built in 1799 by Maharaja Sawai Pratap Singh.",
                "best_time_to_visit": "October to March",
                "ticket_price": 50.00,
                "latitude": 26.9239,
                "longitude": 75.8267,
                "featured": True,
                "trending": False,
                "attractions": [
                    {"name": "Jharokha Viewpoints", "description": "Narrow stone corridors offering views over Pink City bazars."}
                ],
                "tips": [
                    {"title": "Best Photo Spot", "description": "Photograph the facade from across the main street cafes."}
                ]
            },
            {
                "name": "City Palace Udaipur",
                "state": states_dict["Rajasthan"],
                "city": cities_dict["Udaipur"],
                "cats": ["Heritage", "Museums", "Cultural"],
                "image_url": "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800",
                "short_description": "Sprawling palace complex built over 400 years on the eastern bank of Lake Pichola.",
                "description": "Features granite and marble towers, peacock courtyards, crystal galleries, and royal balconies.",
                "history": "Initiated by Maharana Udai Singh II in 1559.",
                "best_time_to_visit": "October to March",
                "ticket_price": 300.00,
                "latitude": 24.5764,
                "longitude": 73.6835,
                "featured": True,
                "trending": True,
                "attractions": [
                    {"name": "Mor Chowk", "description": "Peacock courtyard decorated with elaborate glass mosaic peacocks."}
                ],
                "tips": [
                    {"title": "Time Required", "description": "Allocate at least 3 hours to tour all museum corridors."}
                ]
            },
            {
                "name": "Lake Pichola",
                "state": states_dict["Rajasthan"],
                "city": cities_dict["Udaipur"],
                "cats": ["Lakes", "Couple", "Photography"],
                "image_url": "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=800",
                "short_description": "Picturesque freshwater lake housing the famous Lake Palace island.",
                "description": "Famous for romantic boat cruises passing Jag Mandir island, City Palace waterfront, and heritage ghats.",
                "history": "Created in 1362 AD by a local Banjara tribal grain merchant.",
                "best_time_to_visit": "October to March",
                "ticket_price": 0.00,
                "latitude": 24.5714,
                "longitude": 73.6781,
                "featured": True,
                "trending": True,
                "attractions": [
                    {"name": "Jag Mandir Island", "description": "Island palace known as the Garden of Heaven."}
                ],
                "tips": [
                    {"title": "Sunset Cruise", "description": "Book a boat ride during sunset for golden reflection photography."}
                ]
            }
        ]

        count = 0
        for ddata in destinations_list:
            dest, created = Destination.objects.update_or_create(
                name=ddata["name"],
                state=ddata["state"],
                defaults={
                    "slug": slugify(ddata["name"]),
                    "city": ddata["city"],
                    "short_description": ddata["short_description"],
                    "description": ddata["description"],
                    "history": ddata["history"],
                    "best_time_to_visit": ddata["best_time_to_visit"],
                    "ticket_price": ddata["ticket_price"],
                    "latitude": ddata["latitude"],
                    "longitude": ddata["longitude"],
                    "featured": ddata["featured"],
                    "trending": ddata["trending"],
                    "published": True
                }
            )

            # Assign categories
            cat_objs = [categories_dict[cname] for cname in ddata["cats"] if cname in categories_dict]
            dest.categories.set(cat_objs)

            # Add sample image
            if "image_url" in ddata and not dest.images.exists():
                try:
                    response = requests.get(ddata["image_url"], timeout=10)
                    if response.status_code == 200:
                        image_name = f"{dest.slug}-primary.jpg"
                        dest_image = DestinationImage(destination=dest, is_primary=True, caption=f"{dest.name} view", alt_text=dest.name)
                        dest_image.image.save(image_name, ContentFile(response.content), save=True)
                        self.stdout.write(f"  + Downloaded and saved image for {dest.name}")
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"  - Failed to download image for {dest.name}: {e}"))

            # Add sample attractions
            for attr_info in ddata.get("attractions", []):
                Attraction.objects.update_or_create(
                    destination=dest,
                    name=attr_info["name"],
                    defaults={
                        "slug": slugify(attr_info["name"]),
                        "description": attr_info["description"],
                        "published": True
                    }
                )

            # Add sample travel tips
            for tip_info in ddata.get("tips", []):
                TravelTip.objects.update_or_create(
                    destination=dest,
                    title=tip_info["title"],
                    defaults={
                        "description": tip_info["description"],
                        "published": True
                    }
                )

            count += 1
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} Destination: {dest.name}")

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {count} destinations, 10 cities, 5 states, and 19 categories!"))
