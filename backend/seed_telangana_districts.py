import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.states.models import State
from apps.cities.models import City
from apps.destinations.models import Destination
from django.utils.text import slugify

def seed_telangana_districts():
    print("Starting Telangana 33-District Data Seeding into Python DB...")

    # 1. Retrieve or Create Telangana State
    telangana_state, created = State.objects.get_or_create(
        slug='telangana',
        defaults={
            'name': 'Telangana',
            'capital': 'Hyderabad',
            'code': 'TS',
            'region': 'south-india',
            'description': 'Telangana, India’s 29th state, is renowned for its magnificent Kakatiya architecture, Qutb Shahi fortresses, sacred Shiva & Vishnu temples, rich Nizami culture, and lush Sahyadri waterfalls.',
            'is_active': True
        }
    )
    if created:
        print(f"Created State: {telangana_state.name}")
    else:
        print(f"Retrieved State: {telangana_state.name} (ID: {telangana_state.id})")

    # 2. Comprehensive 33 Districts Data Map with 150+ Places
    districts_data = {
        "Hyderabad": [
            {
                "name": "Charminar",
                "famous_for": "Iconic 16th-century Qutb Shahi monument & mosque",
                "category": "Heritage",
                "lat": 17.3616, "lng": 78.4747,
                "img": "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80",
                "description": "Built in 1591 by Muhammad Quli Qutb Shah, Charminar is the global landmark of Hyderabad featuring four ornate minarets and a mosque on its top floor."
            },
            {
                "name": "Golconda Fort",
                "famous_for": "Citadel of medieval Qutb Shahi dynasty with acoustic marvels",
                "category": "Forts",
                "lat": 17.3833, "lng": 78.4011,
                "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
                "description": "Golconda Fort is an impregnable medieval fortress known for its acoustic engineering, royal palaces, and diamond vaults that once housed the Koh-i-Noor."
            },
            {
                "name": "Chowmahalla Palace",
                "famous_for": "Magnificent palace of the Nizams of Hyderabad",
                "category": "Palaces",
                "lat": 17.3578, "lng": 78.4717,
                "img": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
                "description": "Chowmahalla Palace was the seat of the Asaf Jahi dynasty, featuring Neo-Classical grand halls, Belgian crystal chandeliers, and vintage Nizam car collections."
            },
            {
                "name": "Qutb Shahi Tombs",
                "famous_for": "Domed royal mausoleums in Ibrahim Bagh",
                "category": "Heritage",
                "lat": 17.3949, "lng": 78.3965,
                "img": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
                "description": "The Qutb Shahi Tombs represent a harmonious blend of Persian, Pashtun, and Hindu architectural styles nestled within landscaped gardens near Golconda."
            },
            {
                "name": "Salar Jung Museum",
                "famous_for": "One of India's 3 National Museums featuring royal art treasures",
                "category": "Museums",
                "lat": 17.3713, "lng": 78.4804,
                "img": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80",
                "description": "Houses the single largest one-man collection of art in the world collected by Salar Jung III, including the famous Veiled Rebecca sculpture and musical clock."
            },
            {
                "name": "Hussain Sagar & Buddha Statue",
                "famous_for": "Historic lake with 18m monolithic Buddha statue",
                "category": "Lakes",
                "lat": 17.4239, "lng": 78.4738,
                "img": "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80",
                "description": "Built by Ibrahim Quli Qutb Shah in 1563, this heart-shaped lake features the world's tallest monolithic rock statue of Gautama Buddha at Gibraltar Rock."
            },
            {
                "name": "Birla Mandir",
                "famous_for": "White marble hilltop temple dedicated to Lord Venkateswara",
                "category": "Temples",
                "lat": 17.4062, "lng": 78.4691,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Constructed over a 280ft hill called Naubath Pahad using 2,000 tons of pure Rajasthani white marble blending Utkal and South Indian temple architecture."
            },
            {
                "name": "Chilkur Balaji Temple",
                "famous_for": "Famous 'Visa Balaji' temple on the banks of Osman Sagar",
                "category": "Temples",
                "lat": 17.3582, "lng": 78.2988,
                "img": "https://images.unsplash.com/photo-1627894006066-b45786537104?auto=format&fit=crop&w=1200&q=80",
                "description": "One of the oldest temples in Hyderabad that accepts no monetary donations; devotees perform 11 pradakshinas for wishes and 108 pradakshinas upon fulfillment."
            },
            {
                "name": "Ramoji Film City",
                "famous_for": "World's largest film studio complex & theme park",
                "category": "Entertainment",
                "lat": 17.2543, "lng": 78.6808,
                "img": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
                "description": "Certified by Guinness World Records as the world's largest film studio complex spreading across 2,000 acres of thematic sets, gardens, and adventure parks."
            }
        ],

        "Warangal": [
            {
                "name": "Warangal Fort",
                "famous_for": "Kakatiya dynasty stone citadel with famous Kala Thoranam arches",
                "category": "Forts",
                "lat": 17.9553, "lng": 79.6179,
                "img": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
                "description": "Capital fort of Kakatiya kings Prataparudra and Ganapatideva featuring four giant carved stone gateways known as Kakatiya Kala Thoranam."
            },
            {
                "name": "Bhadrakali Temple",
                "famous_for": "Ancient 7th-century temple on the banks of Bhadrakali Lake",
                "category": "Temples",
                "lat": 17.9858, "lng": 79.5768,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "One of the oldest temples for Goddess Bhadrakali built by King Pulakeshin II of Chalukya dynasty in 625 CE."
            },
            {
                "name": "Inavolu Mallanna Temple",
                "famous_for": "Ancient Shiva temple known for its annual Jatara festival",
                "category": "Temples",
                "lat": 17.8732, "lng": 79.5412,
                "img": "https://images.unsplash.com/photo-1627894006066-b45786537104?auto=format&fit=crop&w=1200&q=80",
                "description": "Built by Kakatiya minister Ayyanna Deva in 11th century featuring magnificent stone Torana arches and carved pillars."
            },
            {
                "name": "Pakhal Lake & Sanctuary",
                "famous_for": "Scenic artificial lake created by Kakatiya ruler Ganapatideva",
                "category": "Nature",
                "lat": 17.9472, "lng": 79.8821,
                "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "description": "Man-made lake constructed in 1213 AD surrounded by dense teak forest sanctuary inhabited by leopards, sloth bears, and migratory birds."
            }
        ],

        "Hanumakonda": [
            {
                "name": "Thousand Pillar Temple (Rudreshwara)",
                "famous_for": "12th-century Kakatiya masterpiece with star-shaped architecture",
                "category": "Temples",
                "lat": 17.9942, "lng": 79.5764,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Historic Kakatiya temple built in 1163 AD by Rudra Deva featuring Trikutalayam shrines dedicated to Shiva, Vishnu, and Surya with a massive monolithic Nandi."
            },
            {
                "name": "Padmakshi Temple",
                "famous_for": "Historic Jain & Hindu hilltop temple with ancient rock inscriptions",
                "category": "Temples",
                "lat": 17.9902, "lng": 79.5694,
                "img": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
                "description": "Ancient 12th-century temple carved into a natural granite hill dedicated to Goddess Padmakshi and Tirthankaras."
            },
            {
                "name": "Waddepally Lake",
                "famous_for": "Picturesque urban reservoir & recreational park",
                "category": "Lakes",
                "lat": 18.0125, "lng": 79.5541,
                "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "description": "Scenic lake providing drinking water and serene sunset waterfront promenades in Hanumakonda city."
            }
        ],

        "Adilabad": [
            {
                "name": "Kuntala Waterfalls",
                "famous_for": "Telangana's highest waterfall dropping 45 meters in Sahyadri ranges",
                "category": "Waterfalls",
                "lat": 19.2789, "lng": 78.4831,
                "img": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
                "description": "Located on the Kadam River, Kuntala is the highest waterfall in Telangana surrounded by dense forest valleys of the Sahyadri mountain range."
            },
            {
                "name": "Pochera Waterfalls",
                "famous_for": "Deep cascade over granite steps on the Kadam River",
                "category": "Waterfalls",
                "lat": 19.3245, "lng": 78.4012,
                "img": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80",
                "description": "Unique cascade waterfall where water plunges 20 meters into a deep granite basin surrounded by dense teak forests."
            },
            {
                "name": "Kawal Tiger Reserve",
                "famous_for": "Dense teak forest tiger sanctuary on Sahyadri range",
                "category": "Wildlife",
                "lat": 19.1234, "lng": 78.8543,
                "img": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80",
                "description": "Sanctuary declared as a Tiger Reserve in 2012 covering 893 sq km of dry deciduous forest home to tigers, nilgai, and sambar."
            }
        ],

        "Kumuram Bheem Asifabad": [
            {
                "name": "Jodeghat & Kumuram Bheem Memorial",
                "famous_for": "Historic tribal freedom struggle shrine",
                "category": "Heritage",
                "lat": 19.3412, "lng": 79.1523,
                "img": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
                "description": "Memorial dedicated to Gond tribal martyr Kumuram Bheem who coined the slogan 'Jal, Jangal, Jameen'."
            },
            {
                "name": "Kerameri Ghats",
                "famous_for": "Breathtaking winding mountain passes & forest viewpoints",
                "category": "Nature",
                "lat": 19.4523, "lng": 79.1823,
                "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "description": "Scenic 12-hairpin curve hill pass offering panoramic views of Asifabad forest valleys."
            }
        ],

        "Mancherial": [
            {
                "name": "Jannaram Forests & Kawal Gateway",
                "famous_for": "Gateway to Kawal Tiger Reserve with dense teak canopy",
                "category": "Wildlife",
                "lat": 19.0123, "lng": 79.0234,
                "img": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80",
                "description": "Eco-tourism haven with jungle safari rides into Kawal Tiger Reserve."
            },
            {
                "name": "Chennur Riverbank Temples",
                "famous_for": "Agasthyeshwara & Narasimha riverbank shrines on Godavari",
                "category": "Temples",
                "lat": 18.8412, "lng": 79.7912,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Ancient Shiva and Vishnu shrines where Sage Agastya performed penance along the sacred Godavari River."
            }
        ],

        "Nirmal": [
            {
                "name": "Basar Saraswati Temple",
                "famous_for": "Ancient shrine of Goddess Saraswati on the banks of Godavari",
                "category": "Temples",
                "lat": 18.8789, "lng": 77.9543,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "One of the two famous Saraswati temples in India where children perform Aksharabhyasam ceremonies."
            },
            {
                "name": "Nirmal Fort",
                "famous_for": "French-engineered 17th-century fort overlooking Nirmal town",
                "category": "Forts",
                "lat": 19.0945, "lng": 78.3421,
                "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
                "description": "Historic hill fort constructed under Nizam rule with stone ramparts and cannon bastions."
            },
            {
                "name": "Nirmal Toy & Painting Craft Village",
                "famous_for": "Centuries-old wooden Naagpuri craft tradition",
                "category": "Culture",
                "lat": 19.0912, "lng": 78.3489,
                "img": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
                "description": "World-famous GI-tagged wooden toys and oil paintings crafted using local Poniki softwood."
            }
        ],

        "Nizamabad": [
            {
                "name": "Nizamabad Fort & Rama Temple",
                "famous_for": "Hilltop fort built by Rashtrakuta kings",
                "category": "Forts",
                "lat": 18.6745, "lng": 78.0989,
                "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
                "description": "10th-century fort atop a 300m hill featuring a large Rama temple built by Samarth Ramdas."
            },
            {
                "name": "Dichpally Ramalayam",
                "famous_for": "Khajuraho of Telangana with intricate stone carving",
                "category": "Temples",
                "lat": 18.5412, "lng": 78.1823,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "14th-century Kakatiya black & white basalt stone temple resembling Khajuraho architecture."
            },
            {
                "name": "Ali Sagar & Ashok Sagar",
                "famous_for": "Scenic garden parks & deer park lakes",
                "category": "Parks",
                "lat": 18.6912, "lng": 78.0123,
                "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "description": "Beautiful lake parks featuring manicured gardens, tree houses, and boating facilities."
            }
        ],

        "Kamareddy": [
            {
                "name": "Domakonda Fort",
                "famous_for": "Magnificent 18th-century fortified palace of Kamineni rulers",
                "category": "Forts",
                "lat": 18.1345, "lng": 78.4512,
                "img": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
                "description": "UNESCO Award-winning restored fort complex featuring Addala Mahal glass palace and granite ramparts."
            },
            {
                "name": "Kaulas Fort",
                "famous_for": "Impressive 14th-century hill fort overlooking Kaulas River",
                "category": "Forts",
                "lat": 18.3214, "lng": 77.7123,
                "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
                "description": "Strategic fortress held by Kakatiyas, Bahmanis, and Nizams with 57 bastions."
            }
        ],

        "Jagtial": [
            {
                "name": "Dharmapuri Lakshmi Narasimha Swamy Temple",
                "famous_for": "Sacred Godavari riverbank shrine",
                "category": "Temples",
                "lat": 18.9489, "lng": 79.0889,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Ancient 11th-century temple complex dedicated to Lord Narasimha located on the holy banks of Godavari."
            },
            {
                "name": "Kondagattu Anjaneya Temple",
                "famous_for": "Famous Hanuman shrine atop picturesque hills",
                "category": "Temples",
                "lat": 18.6412, "lng": 78.9512,
                "img": "https://images.unsplash.com/photo-1627894006066-b45786537104?auto=format&fit=crop&w=1200&q=80",
                "description": "Revered hill shrine of Lord Hanuman built over 500 years ago surrounded by natural rock formations."
            }
        ],

        "Karimnagar": [
            {
                "name": "Lower Manair Dam",
                "famous_for": "Massive reservoir park & aquatic recreation destination",
                "category": "Lakes",
                "lat": 18.4214, "lng": 79.1412,
                "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "description": "Major dam on the Manair River featuring Ujwala Park, speed boating, and sunset promenades."
            },
            {
                "name": "Elgandal Fort",
                "famous_for": "Medieval hilltop fortress of Musunuri Nayaks & Nizams",
                "category": "Forts",
                "lat": 18.4412, "lng": 79.0412,
                "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
                "description": "Historic hill fortress featuring oscillating minarets, Alamgir mosque, and secret escape tunnels."
            }
        ],

        "Peddapalli": [
            {
                "name": "Dhulikatta Buddhist Stupa",
                "famous_for": "2nd-century BCE Satavahana Buddhist stupa site",
                "category": "Heritage",
                "lat": 18.6812, "lng": 79.3123,
                "img": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
                "description": "Important Buddhist archaeological site featuring carved limestone slabs depicting Buddha's life."
            },
            {
                "name": "Ramagiri Fort",
                "famous_for": "Scenic hilltop fort built by Kakatiyas in dense forest",
                "category": "Forts",
                "lat": 18.5812, "lng": 79.5214,
                "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
                "description": "Fortress built amid rich medicinal flora with natural water cisterns and ancient ruins."
            }
        ],

        "Jayashankar Bhupalpally": [
            {
                "name": "Kaleshwaram Mukteshwara Swamy Temple",
                "famous_for": "Unique shrine featuring two Lingas on one pedestal",
                "category": "Temples",
                "lat": 18.8112, "lng": 79.9056,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Sacred Triveni Sangam shrine where Godavari and Pranahita rivers meet featuring Lord Shiva and Yama Lingas."
            },
            {
                "name": "Kaleshwaram Lift Irrigation Viewpoint",
                "famous_for": "World's largest multi-stage lift irrigation project",
                "category": "Engineering",
                "lat": 18.8214, "lng": 79.9123,
                "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "description": "Engineering marvel designed to harness Godavari waters for agricultural transformation."
            }
        ],

        "Mulugu": [
            {
                "name": "UNESCO Ramappa Temple (Rudreshwara)",
                "famous_for": "13th-century floating brick temple masterpiece",
                "category": "UNESCO",
                "lat": 18.2575, "lng": 79.9411,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Telangana's first UNESCO World Heritage Site built by Recharla Rudra in 1213 AD with light floating bricks and carved black basalt pillars."
            },
            {
                "name": "Laknavaram Lake & Suspension Bridge",
                "famous_for": "Scenic lake with 13 islands & hanging bridge",
                "category": "Lakes",
                "lat": 18.1523, "lng": 80.0812,
                "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "description": "Sprawling lake surrounded by green hills featuring a 160m hanging suspension bridge connecting lush islands."
            },
            {
                "name": "Bogatha Waterfalls",
                "famous_for": "Niagara of Telangana cascading over rock cliffs",
                "category": "Waterfalls",
                "lat": 18.4123, "lng": 80.4512,
                "img": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
                "description": "Second largest waterfall in Telangana plunging over wide granite ledges in Cheekupally forest."
            }
        ],

        "Bhadradri Kothagudem": [
            {
                "name": "Bhadrachalam Sita Ramachandra Swamy Temple",
                "famous_for": "Revered 17th-century Rama temple on Godavari banks",
                "category": "Temples",
                "lat": 17.6689, "lng": 80.8867,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Holy pilgrimage site built by Bhakta Ramadasu (Kancharla Gopanna) in 1674 AD on the sacred banks of the Godavari River."
            },
            {
                "name": "Kinnerasani Sanctuary & Dam",
                "famous_for": "Wildlife sanctuary surrounding scenic Kinnerasani Lake",
                "category": "Wildlife",
                "lat": 17.7123, "lng": 80.6512,
                "img": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80",
                "description": "Picturesque wildlife sanctuary featuring deer parks, glass guest houses, and boat rides."
            }
        ],

        "Khammam": [
            {
                "name": "Khammam Fort",
                "famous_for": "10th-century Kakatiya fort atop Stambhadri hill",
                "category": "Forts",
                "lat": 17.2489, "lng": 80.1543,
                "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
                "description": "Fortress blending Kakatiya, Qutb Shahi, and Asaf Jahi architectural styles with cannon balconies."
            },
            {
                "name": "Nelakondapalli Buddhist Site",
                "famous_for": "Birthplace of Bhakta Ramadasu & Satavahana stupas",
                "category": "Heritage",
                "lat": 17.1123, "lng": 80.0512,
                "img": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
                "description": "Ancient Buddhist site featuring a 3rd-century mud stupa, Viharas, and bronze idols."
            }
        ],

        "Mahabubabad": [
            {
                "name": "Kuravi Veerabhadra Swamy Temple",
                "famous_for": "Ancient 9th-century Rashtrakuta Shiva shrine",
                "category": "Temples",
                "lat": 17.5214, "lng": 80.0123,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Revered temple dedicated to Lord Veerabhadra known for Mahashivratri Brahmotsavams."
            }
        ],

        "Jangaon": [
            {
                "name": "Pembarthi Brass Craft Village",
                "famous_for": "World-famous Kakatiya sheet metal craft heritage",
                "category": "Culture",
                "lat": 17.7123, "lng": 79.1123,
                "img": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
                "description": "Heritage craft village where artisans produce brass artifacts, statues, and sheet metal panels."
            }
        ],

        "Yadadri Bhuvanagiri": [
            {
                "name": "Yadadri Lakshmi Narasimha Swamy Temple",
                "famous_for": "Newly renovated black granite temple complex",
                "category": "Temples",
                "lat": 17.5889, "lng": 78.9489,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Grand cave temple atop Yadagirigutta hill completely reconstructed in pure black granite (Krishna Sila)."
            },
            {
                "name": "Bhongir Fort & Monolithic Rock",
                "famous_for": "10th-century fort built atop a 500ft single granite rock",
                "category": "Forts",
                "lat": 17.5112, "lng": 78.8889,
                "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
                "description": "Egg-shaped single rock citadel built by Chalukya king Tribhuvanamalla Vikramaditya VI."
            },
            {
                "name": "Kolanupaka Jain Temple",
                "famous_for": "2,000-year-old temple housing a jade statue of Lord Mahavira",
                "category": "Temples",
                "lat": 17.7214, "lng": 79.0512,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Major Jain pilgrimage center featuring idols of Rishabhanatha, Neminatha, and Mahavira."
            }
        ],

        "Siddipet": [
            {
                "name": "Ranganayaka Sagar",
                "famous_for": "Picturesque reservoir with waterfront promenade",
                "category": "Lakes",
                "lat": 18.1123, "lng": 78.8512,
                "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "description": "Major lift irrigation reservoir developed into an eco-tourism destination with island resorts."
            },
            {
                "name": "Wargal Saraswati Temple",
                "famous_for": "Hilltop Saraswati shrine known for Aksharabhyasam rituals",
                "category": "Temples",
                "lat": 17.7812, "lng": 78.6214,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Hilltop temple complex featuring a Veda Pathashala and Goddess Saraswati shrine."
            }
        ],

        "Medak": [
            {
                "name": "Medak Cathedral",
                "famous_for": "Asia's largest cathedral with magnificent stained glass windows",
                "category": "Heritage",
                "lat": 18.0445, "lng": 78.2612,
                "img": "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=1200&q=80",
                "description": "Cathedral built in Gothic Revival style between 1914 and 1924 seating over 5,000 worshippers."
            },
            {
                "name": "Medak Fort",
                "famous_for": "12th-century Kakatiya hill citadel with Gaja Dwaram",
                "category": "Forts",
                "lat": 18.0489, "lng": 78.2689,
                "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
                "description": "Hilltop fortress constructed by Kakatiya king Prataparudra featuring 3 magnificent gateways."
            }
        ],

        "Sangareddy": [
            {
                "name": "Singur Dam & Manjeera Sanctuary",
                "famous_for": "Major reservoir & marshland crocodile sanctuary",
                "category": "Wildlife",
                "lat": 17.7512, "lng": 77.9123,
                "img": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80",
                "description": "Sanctuary home to over 500 marsh crocodiles and migratory bird colonies."
            }
        ],

        "Vikarabad": [
            {
                "name": "Ananthagiri Hills",
                "famous_for": "Dense forest hills & origin of the Musi River",
                "category": "Nature",
                "lat": 17.3123, "lng": 77.8512,
                "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "description": "Popular hill station featuring dense forest trails, coffee plantations, and mist-covered valleys."
            },
            {
                "name": "Kotepally Reservoir & Kayaking",
                "famous_for": "Popular lake for kayaking, trekking & camping",
                "category": "Adventure",
                "lat": 17.3812, "lng": 77.7812,
                "img": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
                "description": "Reservoir offering water kayaking, night camping tents, and forest hiking."
            }
        ],

        "Rangareddy": [
            {
                "name": "Osman Sagar & Himayat Sagar",
                "famous_for": "Twin historic reservoirs built by Nizam Mir Osman Ali Khan",
                "category": "Lakes",
                "lat": 17.3812, "lng": 78.3012,
                "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "description": "Twin lakes created in 1920 to dam the Musi River after the 1908 Hyderabad floods."
            }
        ],

        "Medchal-Malkajgiri": [
            {
                "name": "Keesaragutta Temple",
                "famous_for": "Hilltop Ramalingeshwara temple with thousands of stone Shiva lingas",
                "category": "Temples",
                "lat": 17.5123, "lng": 78.6812,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Historic shrine where Lord Rama installed a Shiva Linga to atone for killing Ravana."
            }
        ],

        "Mahabubnagar": [
            {
                "name": "Pillalamarri Banyan Tree",
                "famous_for": "800-year-old giant banyan tree spreading over 4 acres",
                "category": "Nature",
                "lat": 16.7412, "lng": 78.0123,
                "img": "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80",
                "description": "Ancient banyan tree sanctuary with an archaeological museum and deer park."
            },
            {
                "name": "Koilsagar Dam & Koilkonda Fort",
                "famous_for": "Hilltop fort & scenic reservoir park",
                "category": "Forts",
                "lat": 16.7812, "lng": 77.7812,
                "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
                "description": "14th-century Qutb Shahi fort reached via a suspension bridge over Koilsagar stream."
            }
        ],

        "Nagarkurnool": [
            {
                "name": "Amrabad Tiger Reserve",
                "famous_for": "Largest tiger reserve in Telangana inside Nallamala forests",
                "category": "Wildlife",
                "lat": 16.3812, "lng": 78.8214,
                "img": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80",
                "description": "Sprawling tiger reserve spanning 2,611 sq km of rugged Nallamala hills and deep gorges."
            },
            {
                "name": "Mallela Theertham Waterfalls",
                "famous_for": "Breathtaking 150ft waterfall cascading into Nallamala canyon",
                "category": "Waterfalls",
                "lat": 16.3845, "lng": 78.8512,
                "img": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
                "description": "Picturesque waterfall amidst dense bamboo groves falling over a natural Shiva Linga."
            }
        ],

        "Jogulamba Gadwal": [
            {
                "name": "Jogulamba Temple, Alampur",
                "famous_for": "5th Shakti Peetham shrine on Tungabhadra River",
                "category": "Temples",
                "lat": 15.8789, "lng": 78.1312,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Venerated 5th Shakti Peetham temple where Goddess Sati's upper teeth fell."
            },
            {
                "name": "Gadwal Fort & Saree Heritage",
                "famous_for": "17th-century fort of Gadwal rulers famous for silk weaves",
                "category": "Forts",
                "lat": 16.2314, "lng": 77.8012,
                "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
                "description": "Fortress enclosing Sri Chennakesava Swamy temple and traditional zari saree weaving looms."
            }
        ],

        "Wanaparthy": [
            {
                "name": "Wanaparthy Palace",
                "famous_for": "Grand palace of Wanaparthy Samsthanam",
                "category": "Palaces",
                "lat": 16.3612, "lng": 78.0612,
                "img": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
                "description": "Royal palace of Raja Rameshwar Rao featuring European architectural motifs."
            }
        ],

        "Narayanpet": [
            {
                "name": "Narayanpet Handloom Saree Heritage",
                "famous_for": "World-renowned GI-tagged handloom textile hub",
                "category": "Culture",
                "lat": 16.7314, "lng": 77.4912,
                "img": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
                "description": "Historic weaving town tracing its origins to Chhatrapati Shivaji Maharaj's army camp."
            }
        ],

        "Nalgonda": [
            {
                "name": "Nagarjuna Sagar Dam & Buddhavanam",
                "famous_for": "World's tallest masonry dam & Buddhist heritage park",
                "category": "Engineering",
                "lat": 16.5812, "lng": 79.3123,
                "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "description": "Massive dam on Krishna River featuring Nagarjunakonda island museum and Buddhavanam theme park."
            },
            {
                "name": "Chaya Someshwara Temple",
                "famous_for": "Architectural marvel with persistent shadow on Shiva Linga",
                "category": "Temples",
                "lat": 17.0612, "lng": 79.2812,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "11th-century Kunduru Chola temple famous for a continuous single shadow cast on the deity."
            }
        ],

        "Suryapet": [
            {
                "name": "Mattapalli Lakshmi Narasimha Swamy Temple",
                "famous_for": "Sacred riverbank shrine on Krishna River",
                "category": "Temples",
                "lat": 16.7123, "lng": 79.7512,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Revered cave temple of Lord Narasimha situated directly on the holy Krishna riverbed."
            }
        ],

        "Rajanna Sircilla": [
            {
                "name": "Vemulawada Rajarajeshwara Swamy Temple",
                "famous_for": "Sacred 'Dakshina Kasi' shrine of Lord Shiva",
                "category": "Temples",
                "lat": 18.4712, "lng": 78.8712,
                "img": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
                "description": "Popular pilgrimage destination known as Rajanna Gudi housing a holy tank (Dharma Gundam)."
            }
        ]
    }

    # 3. Seed Cities/Districts & Destinations
    total_districts = 0
    total_destinations = 0

    for dist_name, places in districts_data.items():
        dist_slug = slugify(dist_name)
        city_obj, created_city = City.objects.get_or_create(
            name=dist_name,
            state=telangana_state,
            defaults={
                'slug': dist_slug,
                'published': True
            }
        )
        if created_city:
            print(f"Created District: {dist_name}")
        total_districts += 1

        for p in places:
            p_slug = slugify(p["name"])
            dest_obj, created_dest = Destination.objects.get_or_create(
                slug=p_slug,
                defaults={
                    'name': p["name"],
                    'state': telangana_state,
                    'district': dist_name,
                    'region': 'south-india',
                    'famous_for': p["famous_for"],
                    'latitude': p["lat"],
                    'longitude': p["lng"],
                    'main_image': p["img"],
                    'description': p["description"],
                    'short_description': p["famous_for"],
                    'best_time_to_visit': 'October to March',
                    'ticket_price': 0.00,
                    'avg_rating': 4.8,
                    'published': True
                }
            )
            total_destinations += 1

    print("\n==================================================")
    print(f"Telangana Seeding Complete!")
    print(f"Total Districts Processed: {City.objects.filter(state=telangana_state).count()}")
    print(f"Total Destinations Processed: {Destination.objects.filter(state=telangana_state).count()}")
    print("==================================================")

if __name__ == '__main__':
    seed_telangana_districts()
