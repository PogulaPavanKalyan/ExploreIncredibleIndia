export const destinations = [
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    state: "Uttar Pradesh",
    region: "North",
    theme: "Heritage",
    rating: 4.9,
    reviewsCount: 14200,
    heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    bestTime: "October to March",
    bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    ticket: {
      domestic: "₹50 (Main Complex) + ₹200 (Mausoleum)",
      foreigner: "₹1,100 + ₹200 (Mausoleum)",
      student: "₹50",
      camera: "Free (Still Camera) / ₹25 (Video)"
    },
    timings: "Sunrise to Sunset (6:00 AM - 6:30 PM), Closed every Friday",
    history: "Commissioned in 1631 by Mughal Emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal. Built completely out of white translucent Makrana marble imported from Rajasthan, it is considered the pinnacle of Mughal architecture and one of the Seven Wonders of the New World.",
    howToReach: {
      flight: "Indira Gandhi International Airport (Delhi, 220 km) or Agra Kheria Airport (13 km).",
      train: "Agra Cantt Railway Station (AGC) - 6 km away. Connected via Gatimaan Express & Shatabdi Express.",
      bus: "Yamuna Expressway connects Delhi to Agra in 3 hours by deluxe Volvo bus.",
      local: "Eco-friendly battery-operated rickshaws, auto-rickshaws, and electric buses operate around the monument."
    },
    nearbyAttractions: ["Agra Fort", "Fatehpur Sikri", "Mehtab Bagh", "Itimad-ud-Daulah (Baby Taj)"],
    localFood: [
      "Agra Petha (Pumpkin sweet with saffron & rose flavors)",
      "Bedai & Aloo (Puri stuffed with spiced lentils with tangy potato curry)",
      "Mughlai Kebabs & Biryani"
    ],
    tags: ["UNESCO World Heritage", "Wonder of the World", "Mughal Architecture", "Romantic"],
    coords: { lat: 27.1751, lng: 78.0421 }
  },
  {
    id: "varanasi-ghats",
    name: "Varanasi Ghats & Kashi Vishwanath",
    location: "Varanasi, Uttar Pradesh",
    state: "Uttar Pradesh",
    region: "North",
    theme: "Spiritual",
    rating: 4.8,
    reviewsCount: 9800,
    heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    bestTime: "November to February",
    bestMonths: ["Nov", "Dec", "Jan", "Feb"],
    ticket: {
      domestic: "Free Ghat Access (Kashi Vishwanath Sugam Darshan ₹300)",
      foreigner: "Free Ghat Access",
      student: "Free",
      camera: "Free"
    },
    timings: "Open 24 Hours. Ganga Aarti begins at 6:45 PM (Summer) / 6:00 PM (Winter) at Dashashwamedh Ghat.",
    history: "One of the oldest continuously inhabited cities in human history (over 3,000 years old). Known as Kashi, it is the spiritual heart of Hinduism situated along the sacred river Ganges. The 84 riverfront ghats host morning prayers, evening Ganga Aarti rituals, and traditional cremations at Manikarnika Ghat.",
    howToReach: {
      flight: "Lal Bahadur Shastri International Airport (VNS) - 25 km from Ghats.",
      train: "Varanasi Junction (BSB) / Banaras Station (BSBS) - 4 km from main ghats.",
      bus: "Direct buses from Delhi, Lucknow, Kanpur, and Allahabad.",
      local: "Hand-paddled wooden boats, cycle rickshaws, and walking through ancient narrow alleys."
    },
    nearbyAttractions: ["Sarnath Buddha Stupa", "Kashi Vishwanath Corridor", "Assi Ghat", "Banaras Hindu University (BHU)"],
    localFood: [
      "Banarasi Paan (Paan infused with gulkand & kattha)",
      "Malaiyo (Fluffy winter milk foam dessert with pistachios & saffron)",
      "Kachori Sabzi & Tamatar Chaat at Deena Chaat Bhandar"
    ],
    tags: ["Spiritual Capital", "Ganga Aarti", "Ancient City", "Temple Trail"],
    coords: { lat: 25.3176, lng: 83.0062 }
  },
  {
    id: "kerala-backwaters",
    name: "Alleppey Backwaters & Houseboats",
    location: "Alappuzha, Kerala",
    state: "Kerala",
    region: "South",
    theme: "Nature",
    rating: 4.9,
    reviewsCount: 11300,
    heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    bestTime: "September to March",
    bestMonths: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    ticket: {
      domestic: "Shikara Cruise: ₹800/hr | Private Houseboat: ₹7,500 - ₹18,000/night",
      foreigner: "Shikara Cruise: ₹800/hr | Private Houseboat: ₹7,500 - ₹18,000/night",
      student: "Govt Ferry: ₹20",
      camera: "Free"
    },
    timings: "Houseboat Check-in 12:00 PM - Check-out 9:00 AM. Day cruises: 8:00 AM - 6:00 PM.",
    history: "Alappuzha, known as the 'Venice of the East', features an intricate network of tranquil brackish lagoons, rivers, and canals parallel to the Arabian Sea coast. Traditional Kettuvallam (rice barges with thatched roofs) have been transformed into luxury floating villas.",
    howToReach: {
      flight: "Cochin International Airport (COK) - 75 km away.",
      train: "Alappuzha Railway Station (ALLP) - 4 km from jetty point.",
      bus: "KSRTC Volvo buses connect Alleppey to Kochi, Trivandrum, and Bangalore.",
      local: "Water taxis, public state ferry boats, and shikara boats."
    },
    nearbyAttractions: ["Marari Beach", "Kumarakom Bird Sanctuary", "Vembanad Lake", "Pathiramanal Island"],
    localFood: [
      "Karimeen Pollichathu (Pearlspot fish marinated & steamed in banana leaf)",
      "Kerala Sadya (28-item vegetarian feast served on banana leaf)",
      "Appam with Duck Roast or Coconut Stew"
    ],
    tags: ["God's Own Country", "Houseboat", "Tranquil", "Romantic"],
    coords: { lat: 9.4981, lng: 76.3388 }
  },
  {
    id: "jaipur-amber-fort",
    name: "Amber Fort & Pink City",
    location: "Jaipur, Rajasthan",
    state: "Rajasthan",
    region: "West",
    theme: "Heritage",
    rating: 4.8,
    reviewsCount: 12500,
    heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    bestTime: "October to March",
    bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    ticket: {
      domestic: "₹100 (Composite Ticket ₹300)",
      foreigner: "₹500 (Composite Ticket ₹1,000)",
      student: "₹20 (Indian) / ₹100 (Foreign)",
      camera: "₹100 (Video)"
    },
    timings: "8:00 AM - 5:30 PM & Light Show 6:30 PM - 9:15 PM",
    history: "Constructed in 1592 by Raja Man Singh I, Amber Fort is a majestic hilltop fortress made of pale yellow and pink sandstone and white marble. It features the Sheesh Mahal (Mirror Palace), Jai Mandir, and Diwan-e-Aam overlooking Maota Lake.",
    howToReach: {
      flight: "Jaipur International Airport (JAI) - 22 km from Amer.",
      train: "Jaipur Junction (JP) - 13 km away with Shatabdi & Vande Bharat links.",
      bus: "RSRTC buses connect Delhi, Agra, Jodhpur, and Udaipur to Sindhi Camp Bus Stand.",
      local: "Jeep safari up the fort hill, Pink City auto-rickshaws, and Hop-on Hop-off city tour buses."
    },
    nearbyAttractions: ["Hawa Mahal", "City Palace Jaipur", "Nahargarh Fort", "Jantar Mantar"],
    localFood: [
      "Dal Baati Churma (Baked wheat balls served with spiced lentils & ghee)",
      "Pyaaz Kachori at Rawat Mishtan Bhandar",
      "Ghevar (Disc-shaped sweet soaked in saffron sugar syrup)"
    ],
    tags: ["Royal Palaces", "Fortress", "UNESCO Heritage", "Pink City"],
    coords: { lat: 26.9855, lng: 75.8513 }
  },
  {
    id: "pangong-tso",
    name: "Pangong Lake & Ladakh Valleys",
    location: "Leh, Ladakh",
    state: "Ladakh",
    region: "North",
    theme: "Adventure",
    rating: 4.9,
    reviewsCount: 6700,
    heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    bestTime: "May to September",
    bestMonths: ["May", "Jun", "Jul", "Aug", "Sep"],
    ticket: {
      domestic: "Inner Line Permit (ILP): ₹400 + ₹20/day environment fee",
      foreigner: "Protected Area Permit (PAP): ₹600 + environment fee",
      student: "Standard rates apply",
      camera: "Free"
    },
    timings: "Open 24 hours (Day trips recommended due to high altitude night freezing).",
    history: "Situated at an altitude of 4,225 meters (13,862 ft) in the Himalayas, Pangong Tso is a endorheic lake extending 134 km from India into Tibet. Famous for changing colors from azure blue to deep green and violet throughout the day.",
    howToReach: {
      flight: "Kushok Bakula Rimpochee Airport (IXL) in Leh - 140 km away across Chang La Pass.",
      train: "Nearest major station: Jammu Tawi (680 km) or Chandigarh.",
      bus: "HRTC / JKSRTC buses operate seasonally via Manali-Leh Highway (May-Oct).",
      local: "4x4 SUVs (Scorpio, Innova) or rental Himalayan Royal Enfield bikes from Leh."
    },
    nearbyAttractions: ["Nubra Valley & Hunder Sand Dunes", "Khardung La Pass", "Thiksey Monastery", "Magnetic Hill"],
    localFood: [
      "Ladakhi Thukpa (Hot noodle soup with local wild herbs & yak meat/veg)",
      "Mommos with spicy red chili chutney",
      "Butter Tea (Gur Gur Chai made with yak butter & salt)"
    ],
    tags: ["High Altitude Lake", "Himalayan Bikers", "Stargazing", "Inner Line Permit"],
    coords: { lat: 33.7595, lng: 78.6674 }
  },
  {
    id: "madurai-meenakshi",
    name: "Meenakshi Amman Temple",
    location: "Madurai, Tamil Nadu",
    state: "Tamil Nadu",
    region: "South",
    theme: "Spiritual",
    rating: 4.9,
    reviewsCount: 10400,
    heroImage: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
    bestTime: "October to March",
    bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    ticket: {
      domestic: "Free Entry (Special Fast Track Darshan ₹50/₹100)",
      foreigner: "Free Entry (Museum Entry ₹50)",
      student: "Free",
      camera: "Mobiles/Cameras banned inside inner sanctum"
    },
    timings: "5:00 AM - 12:30 PM & 4:00 PM - 10:00 PM daily",
    history: "A historic Dravidian architectural masterpiece built primarily between 1623 and 1659 by Thirumalai Nayak. The complex houses 14 gopurams (gateway towers) towering up to 52 meters, adorned with over 33,000 colorful sculpted deities and mythological figures.",
    howToReach: {
      flight: "Madurai International Airport (IXM) - 12 km away.",
      train: "Madurai Junction (MDU) - 1.5 km from temple premises.",
      bus: "TNSTC Volvo buses connect Madurai with Chennai, Bangalore, and Coimbatore.",
      local: "Auto-rickshaws, city electric buses, and walking around heritage streets."
    },
    nearbyAttractions: ["Thirumalai Nayakkar Mahal", "Gandhi Memorial Museum", "Koodal Azhagar Temple", "Rameswaram"],
    localFood: [
      "Jigarthanda (Chilled refreshing drink made with almond gum, sarsaparilla syrup & ice cream)",
      "Madurai Kari Dosa (Multi-layered crispy dosa topped with minced mutton/masala)",
      "Bun Parotta with spicy Salna curry"
    ],
    tags: ["Dravidian Architecture", "Gopurams", "Ancient Temple", "Cultural Heart"],
    coords: { lat: 9.9195, lng: 78.1193 }
  },
  {
    id: "goa-beaches",
    name: "North & South Goa Beaches",
    location: "Panaji, Goa",
    state: "Goa",
    region: "West",
    theme: "Beaches",
    rating: 4.8,
    reviewsCount: 16800,
    heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    bestTime: "November to February",
    bestMonths: ["Nov", "Dec", "Jan", "Feb"],
    ticket: {
      domestic: "Free Beach Access (Water sports ₹500 - ₹3,000)",
      foreigner: "Free Beach Access",
      student: "Free",
      camera: "Free"
    },
    timings: "Open 24 Hours. Life guards on duty 7:00 AM - 6:30 PM.",
    history: "Goa presents a unique blend of Indian and Portuguese cultures, shaped by over 450 years of Portuguese colonial rule until 1961. Renowned for its 100+ km coastline featuring golden sand beaches, coconut groves, heritage Latin Quarters (Fontainhas), and UNESCO churches.",
    howToReach: {
      flight: "Mopa Airport (GOX) or Dabolim Airport (GOI) - 30 km to major beaches.",
      train: "Madgaon Junction (MAO) or Thivim (THVM) with Tejas Express connectivity.",
      bus: "Kadamba buses and private Volvo buses connect Goa with Mumbai, Pune, and Bangalore.",
      local: "Self-drive scooter rentals (₹350-₹600/day), black & yellow cabs, and pilot bikes."
    },
    nearbyAttractions: ["Dudhsagar Waterfalls", "Basilica of Bom Jesus", "Fontainhas Latin Quarter", "Fort Aguada"],
    localFood: [
      "Goan Fish Curry Rice with Kokum Sol Kadhi",
      "Pork Vindaloo / Chicken Xacuti",
      "Bebinca (Traditional 7-layer Goan dessert made with coconut milk & nutmeg)"
    ],
    tags: ["Beach Sunset", "Water Sports", "Portuguese Heritage", "Nightlife"],
    coords: { lat: 15.5494, lng: 73.7535 }
  },
  {
    id: "hampi-ruins",
    name: "Hampi Monuments & Boulders",
    location: "Vijayanagara, Karnataka",
    state: "Karnataka",
    region: "South",
    theme: "Heritage",
    rating: 4.9,
    reviewsCount: 8900,
    heroImage: "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
    bestTime: "October to March",
    bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    ticket: {
      domestic: "₹40 (Vittala Temple & Lotus Mahal Complex)",
      foreigner: "₹600",
      student: "Free (under 15)",
      camera: "₹25"
    },
    timings: "Sunrise to Sunset (6:00 AM - 6:00 PM)",
    history: "Hampi was the magnificent capital of the Vijayanagara Empire in the 14th century, once the second-largest city in the world. Scattered across a surreal landscape of giant granite boulders along the Tungabhadra River, it features over 1,600 surviving monuments including the famous Stone Chariot.",
    howToReach: {
      flight: "Jindal Vijayanagar Airport, Toranagallu (38 km) or Hubballi Airport (168 km).",
      train: "Hosapete Junction (HPT) - 13 km away connected by overnight express trains from Bangalore & Goa.",
      bus: "KSRTC buses connect Hospet/Hampi to Bangalore, Hyderabad, and Gokarna.",
      local: "Bicycle rentals (₹150/day), moped rentals, coracle boat rides across Tungabhadra, and auto-rickshaws."
    },
    nearbyAttractions: ["Virupaksha Temple", "Vittala Temple Stone Chariot", "Lotus Mahal & Elephant Stables", "Anjanadri Hill"],
    localFood: [
      "South Indian Thali served on fresh banana leaf",
      "Bisi Bele Bath with Boondi",
      "Coracle-side Israeli & Continental cafes in Hippie Island"
    ],
    tags: ["UNESCO World Heritage", "Stone Chariot", "Bouldering", "Ancient Empire"],
    coords: { lat: 15.3350, lng: 76.4600 }
  },
  {
    id: "darjeeling-tea",
    name: "Darjeeling Himalayan Railway & Tea Gardens",
    location: "Darjeeling, West Bengal",
    state: "West Bengal",
    region: "East",
    theme: "Nature",
    rating: 4.8,
    reviewsCount: 7900,
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    bestTime: "March to May & October to December",
    bestMonths: ["Mar", "Apr", "May", "Oct", "Nov", "Dec"],
    ticket: {
      domestic: "Toy Train Joy Ride: ₹1,000 (Diesel) / ₹1,500 (Steam)",
      foreigner: "Toy Train Joy Ride: ₹1,000 / ₹1,500",
      student: "Standard rates",
      camera: "Free"
    },
    timings: "Toy Train rides run 8:00 AM - 4:30 PM. Tiger Hill Sunrise: 4:00 AM.",
    history: "Nestled at 2,045 meters in the Lesser Himalayas, Darjeeling is world-famous for its aromatic champagne of teas and panoramic views of Mount Kanchenjunga (world's 3rd highest peak). The DHR Toy Train, built between 1879 and 1881, is a UNESCO World Heritage mountain railway.",
    howToReach: {
      flight: "Bagdogra Airport (IXB) - 68 km away (approx 3 hours by taxi).",
      train: "New Jalpaiguri Railway Station (NJP) - 70 km away.",
      bus: "NBSTC & private share jeeps run continuously between Siliguri and Darjeeling.",
      local: "Shared Tata Sumo jeeps, ropeway cable car, and heritage walking tours."
    },
    nearbyAttractions: ["Tiger Hill Kanchenjunga View", "Batasia Loop & War Memorial", "Happy Valley Tea Estate", "Padmaja Naidu Himalayan Zoo"],
    localFood: [
      "Authentic Darjeeling First Flush Tea",
      "Steamed Tibetan Momos with Dalle Khorsani chili dip",
      "Thukpa & Shaphaley (Fried meat pie)"
    ],
    tags: ["UNESCO Mountain Rail", "Kanchenjunga", "Tea Estate", "Queen of Hills"],
    coords: { lat: 27.0410, lng: 88.2663 }
  },
  {
    id: "kaziranga-rhino",
    name: "Kaziranga National Park",
    location: "Golaghat, Assam",
    state: "Assam",
    region: "NorthEast",
    theme: "Nature",
    rating: 4.9,
    reviewsCount: 5300,
    heroImage: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80",
    bestTime: "November to April (Closed during monsoon May-Oct)",
    bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    ticket: {
      domestic: "Jeep Safari: ₹2,200/jeep | Elephant Safari: ₹1,200/person",
      foreigner: "Jeep Safari: ₹4,500/jeep | Elephant Safari: ₹3,000/person",
      student: "Discounted student passes available",
      camera: "₹200 (Still) / ₹1,000 (Video)"
    },
    timings: "Morning Safari: 7:00 AM - 9:30 AM | Afternoon Safari: 1:30 PM - 3:30 PM",
    history: "A UNESCO World Heritage sanctuary hosting two-thirds of the world's great one-horned rhinoceroses. Located along the fertile floodplains of the Brahmaputra River, Kaziranga also boasts the highest density of tigers among protected areas in the world.",
    howToReach: {
      flight: "Jorhat Airport (97 km) or Guwahati International Airport (217 km).",
      train: "Furkating Junction (75 km) or Guwahati Station.",
      bus: "ASTC buses operate directly from ISBT Guwahati to Kohora Range, Kaziranga.",
      local: "Forest department 4x4 open safari jeeps and elephant safari mounts."
    },
    nearbyAttractions: ["Orchid & Biodiversity Park", "Brahmaputra River Island Cruise", "Kakochang Waterfalls", "Tea Gardens of Assam"],
    localFood: [
      "Assamese Thali with Joha rice & Masor Tenga (Tangy fish curry with elephant apple/lemon)",
      "Duck Curry with Ash Gourd (Kordo)",
      "Pitha (Rice powder snack filled with sesame & jaggery)"
    ],
    tags: ["One-Horned Rhino", "UNESCO World Heritage", "Wildlife Safari", "Brahmaputra"],
    coords: { lat: 26.5775, lng: 93.1711 }
  },
  {
    id: "khajuraho-temples",
    name: "Khajuraho Group of Monuments",
    location: "Chhatarpur, Madhya Pradesh",
    state: "Madhya Pradesh",
    region: "Central",
    theme: "Heritage",
    rating: 4.8,
    reviewsCount: 6100,
    heroImage: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80",
    bestTime: "October to March",
    bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    ticket: {
      domestic: "₹40 (Western Group)",
      foreigner: "₹600",
      student: "Free (under 15)",
      camera: "Free (Still) / ₹25 (Video)"
    },
    timings: "Sunrise to Sunset (6:00 AM - 6:00 PM) | Sound & Light Show: 6:30 PM",
    history: "Built between 950 and 1050 AD by the Chandela Dynasty, Khajuraho is world-renowned for its exquisite Nagara-style architectural symbolism and intricate erotic sculptures celebrating human life, devotion, and art.",
    howToReach: {
      flight: "Khajuraho Airport (HJR) - 5 km from western temple group.",
      train: "Khajuraho Railway Station (KURJ) - 8 km away connected to Delhi & Jhansi.",
      bus: "Buses connect Khajuraho to Jhansi, Satna, Harpalpur, and Varanasi.",
      local: "Auto-rickshaws, bicycle rentals, and walking inside temple gardens."
    },
    nearbyAttractions: ["Kandariya Mahadeva Temple", "Raneh Waterfalls & Canyon", "Panna National Park Tiger Reserve", "Light & Sound Show"],
    localFood: [
      "Bhutte Ka Kees (Grated corn cooked in milk & spices)",
      "Poha Jalebi",
      "Mawa Bati (Rich stuffed gulab jamun variant)"
    ],
    tags: ["UNESCO World Heritage", "Nagara Architecture", "Chandela Sculptures", "Heart of India"],
    coords: { lat: 24.8318, lng: 79.9199 }
  },
  {
    id: "golden-temple",
    name: "Golden Temple (Sri Harmandir Sahib)",
    location: "Amritsar, Punjab",
    state: "Punjab",
    region: "North",
    theme: "Spiritual",
    rating: 4.9,
    reviewsCount: 18500,
    heroImage: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=1200&q=80",
    bestTime: "October to March",
    bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    ticket: {
      domestic: "Free Entry (Free 24/7 Community Kitchen / Langar)",
      foreigner: "Free Entry",
      student: "Free Entry",
      camera: "Free (Photography restricted at inner pool perimeter)"
    },
    timings: "Open 24 Hours daily",
    history: "Founded in 1577 by the fourth Sikh Guru, Guru Ram Das. The temple sanctum is overlaid with 750 kg of pure gold foil, standing serenely in the middle of the Amrit Sarovar (Pool of Nectar). Its mega langar kitchen serves free vegetarian meals to over 100,000 people every single day regardless of religion or background.",
    howToReach: {
      flight: "Sri Guru Ram Dass Jee International Airport (ATQ) - 13 km away.",
      train: "Amritsar Junction (ASR) - 2 km from Golden Temple.",
      bus: "Direct Volvo buses from Delhi, Chandigarh, Jammu, and Shimla.",
      local: "Free SGPC shuttle buses from railway station, electric rickshaws, and pedestrian heritage street walk."
    },
    nearbyAttractions: ["Wagah Border Beating Retreat Ceremony", "Jallianwala Bagh", "Partition Museum", "Gobindgarh Fort"],
    localFood: [
      "Amritsari Kulcha with Chole & Tamarind Chutney",
      "Langar Ka Dal & Kaddah Prasad (Wheat halwa made with pure desi ghee)",
      "Creamy Amritsari Lassi served in brass kulhad"
    ],
    tags: ["Sikh Shrine", "Mega Langar", "Pure Gold Sanctum", "Peace & Unity"],
    coords: { lat: 31.6200, lng: 74.8765 }
  }
];
