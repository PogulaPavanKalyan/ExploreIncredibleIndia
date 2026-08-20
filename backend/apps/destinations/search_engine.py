import re
import math
from decimal import Decimal
from django.db.models import Q
from .models import Destination

# ═════════════════════════════════════════════════════════════════════════════
# 1. INDIAN CITIES & STATES COORDINATE GEODATABASE
# ═════════════════════════════════════════════════════════════════════════════
CITY_COORDINATES = {
    'hyderabad': (17.3850, 78.4867, 'Telangana'),
    'vijayawada': (16.5062, 80.6480, 'Andhra Pradesh'),
    'visakhapatnam': (17.6868, 83.2185, 'Andhra Pradesh'),
    'vizag': (17.6868, 83.2185, 'Andhra Pradesh'),
    'tirupati': (13.6288, 79.4192, 'Andhra Pradesh'),
    'srisailam': (16.0739, 78.8687, 'Andhra Pradesh'),
    'guntur': (16.3067, 80.4365, 'Andhra Pradesh'),
    'warangal': (17.9689, 79.5941, 'Telangana'),
    'bangalore': (12.9716, 77.5946, 'Karnataka'),
    'bengaluru': (12.9716, 77.5946, 'Karnataka'),
    'mysore': (12.2958, 76.6394, 'Karnataka'),
    'coorg': (12.3375, 75.8069, 'Karnataka'),
    'chennai': (13.0827, 80.2707, 'Tamil Nadu'),
    'madurai': (9.9252, 78.1198, 'Tamil Nadu'),
    'coimbatore': (11.0168, 76.9558, 'Tamil Nadu'),
    'mumbai': (19.0760, 72.8777, 'Maharashtra'),
    'pune': (18.5204, 73.8567, 'Maharashtra'),
    'nashik': (19.9975, 73.7898, 'Maharashtra'),
    'delhi': (28.6139, 77.2090, 'Delhi'),
    'kolkata': (22.5726, 88.3639, 'West Bengal'),
    'jaipur': (26.9124, 75.7873, 'Rajasthan'),
    'udaipur': (24.5854, 73.7125, 'Rajasthan'),
    'jodhpur': (26.2389, 73.0243, 'Rajasthan'),
    'ahmedabad': (23.0225, 72.5714, 'Gujarat'),
    'kochi': (9.9312, 76.2673, 'Kerala'),
    'munnar': (10.0889, 77.0595, 'Kerala'),
    'alleppey': (9.4981, 76.3388, 'Kerala'),
    'trivandrum': (8.5241, 76.9366, 'Kerala'),
    'thiruvananthapuram': (8.5241, 76.9366, 'Kerala'),
    'goa': (15.2993, 74.1240, 'Goa'),
    'panaji': (15.4909, 73.8278, 'Goa'),
    'bhubaneswar': (20.2961, 85.8245, 'Odisha'),
    'puri': (19.8135, 85.8312, 'Odisha'),
    'varanasi': (25.3176, 82.9739, 'Uttar Pradesh'),
    'agra': (27.1767, 78.0081, 'Uttar Pradesh'),
    'lucknow': (26.8467, 80.9462, 'Uttar Pradesh'),
    'rishikesh': (30.0869, 78.2676, 'Uttarakhand'),
    'dehradun': (30.3165, 78.0322, 'Uttarakhand'),
    'kedarnath': (30.7352, 79.0669, 'Uttarakhand'),
    'badrinath': (30.7433, 79.4938, 'Uttarakhand'),
    'guwahati': (26.1445, 91.7362, 'Assam'),
    'kaziranga': (26.5775, 93.1711, 'Assam'),
    'shillong': (25.5788, 91.8933, 'Meghalaya'),
    'gangtok': (27.3389, 88.6065, 'Sikkim'),
    'leh': (34.1526, 77.5771, 'Ladakh'),
    'srinagar': (34.0837, 74.7973, 'Jammu and Kashmir'),
    'shimla': (31.1048, 77.1734, 'Himachal Pradesh'),
    'manali': (32.2432, 77.1892, 'Himachal Pradesh'),
    'chandigarh': (30.7333, 76.7794, 'Chandigarh'),
}

STATE_KEYWORDS = {
    'andhra pradesh': 'andhra-pradesh',
    'andhra': 'andhra-pradesh',
    'telangana': 'telangana',
    'kerala': 'kerala',
    'tamil nadu': 'tamil-nadu',
    'tamilnadu': 'tamil-nadu',
    'karnataka': 'karnataka',
    'goa': 'goa',
    'rajasthan': 'rajasthan',
    'himachal pradesh': 'himachal-pradesh',
    'himachal': 'himachal-pradesh',
    'uttarakhand': 'uttarakhand',
    'uttaranchal': 'uttarakhand',
    'maharashtra': 'maharashtra',
    'gujarat': 'gujarat',
    'odisha': 'odisha',
    'orissa': 'odisha',
    'west bengal': 'west-bengal',
    'bengal': 'west-bengal',
    'assam': 'assam',
    'meghalaya': 'meghalaya',
    'sikkim': 'sikkim',
    'ladakh': 'ladakh',
    'jammu and kashmir': 'jammu-and-kashmir',
    'kashmir': 'jammu-and-kashmir',
    'madhya pradesh': 'madhya-pradesh',
    'uttar pradesh': 'uttar-pradesh',
    'delhi': 'delhi',
    'punjab': 'punjab',
}

REGION_KEYWORDS = {
    'south india': 'south-india',
    'south': 'south-india',
    'southern india': 'south-india',
    'north india': 'north-india',
    'north': 'north-india',
    'northern india': 'north-india',
    'west india': 'west-india',
    'western india': 'west-india',
    'east india': 'east-india',
    'eastern india': 'east-india',
    'central india': 'central-india',
    'northeast india': 'northeast-india',
    'northeast': 'northeast-india',
    'north east': 'northeast-india',
    'himalayas': 'north-india',
    'himalayan': 'north-india',
}

# ═════════════════════════════════════════════════════════════════════════════
# 2. TYPO NORMALIZATION DICTIONARY
# ═════════════════════════════════════════════════════════════════════════════
TYPO_CORRECTIONS = {
    r'\bhydrabad\b': 'hyderabad',
    r'\bhyderbad\b': 'hyderabad',
    r'\bhyd\b': 'hyderabad',
    r'\btirupathi\b': 'tirupati',
    r'\bsrishailam\b': 'srisailam',
    r'\bsrisylam\b': 'srisailam',
    r'\bvijaywada\b': 'vijayawada',
    r'\bvijyawada\b': 'vijayawada',
    r'\bbanglore\b': 'bangalore',
    r'\bbengaluru\b': 'bangalore',
    r'\bchenai\b': 'chennai',
    r'\bmadras\b': 'chennai',
    r'\bbombay\b': 'mumbai',
    r'\bcalcutta\b': 'kolkata',
    r'\bbanaras\b': 'varanasi',
    r'\bkashi\b': 'varanasi',
    r'\btreking\b': 'trekking',
    r'\bwater\s+fall\b': 'waterfall',
    r'\bwater\s+falls\b': 'waterfalls',
    r'\bhill\s+station\b': 'mountains',
    r'\bjyothirlinga\b': 'jyotirlinga',
    r'\bjyothirlingam\b': 'jyotirlinga',
    r'\bjyotirlingas\b': 'jyotirlinga',
    r'\bchardham\b': 'char dham',
}

def normalize_query(query_str: str) -> str:
    normalized = query_str.strip().lower()
    for pattern, repl in TYPO_CORRECTIONS.items():
        normalized = re.sub(pattern, repl, normalized, flags=re.IGNORECASE)
    return normalized

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates geodesic distance in kilometers between two coordinates."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def estimate_travel_time(distance_km: float) -> str:
    """Estimates average driving time based on terrain and Indian road speeds."""
    if distance_km <= 0:
        return "Under 15 min"
    if distance_km < 40:
        mins = max(15, int((distance_km / 35) * 60))
        return f"{mins} min drive"
    hours = distance_km / 50.0
    h = int(hours)
    m = int((hours - h) * 60)
    if m < 10:
        return f"~{h} hr drive"
    return f"~{h} hr {m} min drive"


class TravelIntentEngine:
    @staticmethod
    def extract_intent(raw_query: str, user_lat=None, user_lng=None):
        """
        Extracts structured intent from natural language travel questions.
        """
        normalized = normalize_query(raw_query)
        intent = {
            'original_query': raw_query,
            'normalized_query': normalized,
            'location_name': None,
            'state_slug': None,
            'state_name': None,
            'region_slug': None,
            'origin_coords': None,
            'is_near_me': False,
            'category': None,
            'subcategory': None,
            'pilgrimage_collection': None,
            'max_distance_km': None,
            'difficulty': None,
            'duration_type': None,
            'budget_pref': None,
            'suitability_tags': [],
            'season_pref': None,
            'keywords': []
        }

        # 1. Detect "near me" or Geolocation
        if 'near me' in normalized or 'around me' in normalized or 'near my location' in normalized:
            intent['is_near_me'] = True
            intent['location_name'] = 'Your Current Location'
            if user_lat and user_lng:
                try:
                    intent['origin_coords'] = (float(user_lat), float(user_lng))
                except Exception:
                    pass

        # 2. Detect State from query
        for st_name, st_slug in STATE_KEYWORDS.items():
            pattern = rf'\b(?:in|of|visit|places|tour|trip)\s+{st_name}\b|\b{st_name}\b'
            if re.search(pattern, normalized):
                intent['state_slug'] = st_slug
                intent['state_name'] = st_name.title()
                break

        # 3. Detect Region from query
        for reg_name, reg_slug in REGION_KEYWORDS.items():
            pattern = rf'\b{reg_name}\b'
            if re.search(pattern, normalized):
                intent['region_slug'] = reg_slug
                break

        # 4. Detect City Location from query
        if not intent['origin_coords']:
            for city_key, (c_lat, c_lon, c_state) in CITY_COORDINATES.items():
                pattern = rf'\b(?:near|in|from|around|to)\s+{city_key}\b|\b{city_key}\b'
                if re.search(pattern, normalized):
                    intent['location_name'] = city_key.title()
                    intent['origin_coords'] = (c_lat, c_lon)
                    break

        # Fallback if user coordinates provided directly
        if not intent['origin_coords'] and user_lat and user_lng:
            try:
                intent['origin_coords'] = (float(user_lat), float(user_lng))
                if not intent['location_name']:
                    intent['location_name'] = 'Your Location'
            except Exception:
                pass

        # 5. Distance Radius Detection (e.g. "within 100 km", "under 50km", "50 kms")
        dist_match = re.search(r'(?:within|under|below|less\s+than|radius\s+of)?\s*(\d{1,4})\s*(?:km|kms|kilometer|kilometers)', normalized)
        if dist_match:
            intent['max_distance_km'] = float(dist_match.group(1))
        elif 'near' in normalized and intent['origin_coords']:
            intent['max_distance_km'] = 250.0  # Default weekend radius for "near <City>"

        # 6. Pilgrimage Collections
        if 'jyotirlinga' in normalized:
            intent['pilgrimage_collection'] = 'jyotirlinga'
            intent['category'] = 'Temples'
            intent['subcategory'] = 'Jyotirlinga'
        elif 'char dham' in normalized or 'chardham' in normalized:
            intent['pilgrimage_collection'] = 'char_dham'
            intent['category'] = 'Temples'
        elif 'shakti peetha' in normalized:
            intent['pilgrimage_collection'] = 'shakti_peetha'
            intent['category'] = 'Temples'

        # 7. Category & Subcategory Extraction
        if re.search(r'\b(?:trek|trekking|hike|hiking|trails?|climb|climbing)\b', normalized):
            intent['category'] = 'Adventure'
            intent['subcategory'] = 'Trekking'
        elif re.search(r'\b(?:waterfall|waterfalls|falls?|cascade)\b', normalized):
            intent['category'] = 'Nature'
            intent['subcategory'] = 'Waterfalls'
        elif re.search(r'\b(?:temple|temples|mandir|spiritual|pilgrimage|shrine|darshan)\b', normalized):
            if not intent['category']:
                intent['category'] = 'Temples'
                intent['subcategory'] = 'Spiritual'
        elif re.search(r'\b(?:beach|beaches|coastal|sea|seashore)\b', normalized):
            intent['category'] = 'Beaches'
            intent['subcategory'] = 'Coastal'
        elif re.search(r'\b(?:fort|forts|palace|palaces|heritage|ancient|ruins?|historical|monument|monuments)\b', normalized):
            intent['category'] = 'Heritage'
            intent['subcategory'] = 'Forts & Monuments'
        elif re.search(r'\b(?:wildlife|safari|tiger|animals?|sanctuary|national\s+park|forests?)\b', normalized):
            intent['category'] = 'Wildlife'
            intent['subcategory'] = 'Sanctuaries'
        elif re.search(r'\b(?:hill\s+station|hills?|mountain|mountains?|peaks?|himalayan|himalayas)\b', normalized):
            intent['category'] = 'Mountains'
            intent['subcategory'] = 'Hill Stations'

        # 8. Difficulty Extraction
        if re.search(r'\b(?:beginner|beginners|easy|starter|simple|kids)\b', normalized):
            intent['difficulty'] = 'easy'
        elif re.search(r'\b(?:moderate|medium|intermediate)\b', normalized):
            intent['difficulty'] = 'moderate'
        elif re.search(r'\b(?:experienced|difficult|hard|challenging|expert|extreme)\b', normalized):
            intent['difficulty'] = 'difficult'

        # 9. Duration Extraction
        if re.search(r'\b(?:half\s*day|quick|2\s*hours?|morning)\b', normalized):
            intent['duration_type'] = 'half_day'
        elif re.search(r'\b(?:1\s*day|one\s*day|day\s*trip|same\s*day)\b', normalized):
            intent['duration_type'] = '1_day'
        elif re.search(r'\b(?:weekend|2\s*days?|two\s*days?|overnight)\b', normalized):
            intent['duration_type'] = 'weekend'
            if not intent['max_distance_km'] and intent['origin_coords']:
                intent['max_distance_km'] = 300.0
        elif re.search(r'\b(?:3\s*days?|extended|vacation|week)\b', normalized):
            intent['duration_type'] = 'multi_day'

        # 10. Budget Extraction
        if re.search(r'\b(?:cheap|budget|affordable|low\s*cost|free)\b', normalized):
            intent['budget_pref'] = 'low'
        elif re.search(r'\b(?:luxury|resort|premium|5\s*star)\b', normalized):
            intent['budget_pref'] = 'high'

        # 11. Suitability & Travel Type Tags
        suitability_map = {
            'family': [r'\bfamily\b', r'\bfamilies\b', r'\bkids\b', r'\bparents\b'],
            'couple': [r'\bcouple\b', r'\bcouples\b', r'\bhoneymoon\b', r'\bromantic\b'],
            'solo': [r'\bsolo\b', r'\balone\b'],
            'photography': [r'\bphoto\b', r'\bphotography\b', r'\bphotoshoot\b', r'\binstagram\b'],
            'sunrise': [r'\bsunrise\b', r'\bdawn\b', r'\bearly\s*morning\b'],
            'sunset': [r'\bsunset\b', r'\bdusk\b', r'\bevening\b'],
            'camping': [r'\bcamp\b', r'\bcamping\b', r'\btents?\b', r'\bbonfire\b'],
            'monsoon': [r'\bmonsoon\b', r'\brain\b', r'\bgreenery\b'],
        }
        for tag, patterns in suitability_map.items():
            if any(re.search(p, normalized) for p in patterns):
                intent['suitability_tags'].append(tag)

        # 12. Season Detection
        if 'monsoon' in normalized or 'rainy' in normalized:
            intent['season_pref'] = 'monsoon'
        elif 'winter' in normalized or 'december' in normalized or 'january' in normalized:
            intent['season_pref'] = 'winter'
        elif 'summer' in normalized:
            intent['season_pref'] = 'summer'

        return intent

    @staticmethod
    def execute_search(intent, queryset=None, sort_by='relevance', explicit_filters=None):
        """
        Filters and scores destinations based on extracted intent, geolocation and sorting parameters.
        """
        if queryset is None:
            queryset = Destination.objects.filter(published=True).select_related('state', 'city', 'region_obj').prefetch_related('categories', 'images', 'activities')

        origin_coords = intent.get('origin_coords')
        max_dist = intent.get('max_distance_km')
        category = intent.get('category')
        subcategory = intent.get('subcategory')
        pilgrimage = intent.get('pilgrimage_collection')
        state_slug = intent.get('state_slug')
        region_slug = intent.get('region_slug')
        difficulty = intent.get('difficulty')
        duration_type = intent.get('duration_type')
        suitability_tags = intent.get('suitability_tags', [])
        norm_query = intent.get('normalized_query', '')

        # Apply explicit filters if passed
        if explicit_filters:
            if explicit_filters.get('state') and explicit_filters['state'] != 'all':
                state_slug = explicit_filters['state']
            if explicit_filters.get('region') and explicit_filters['region'] != 'all':
                region_slug = explicit_filters['region']
            if explicit_filters.get('category') and explicit_filters['category'] != 'all':
                category = explicit_filters['category']
            if explicit_filters.get('sort'):
                sort_by = explicit_filters['sort']

        # Base candidate filtering
        candidate_qs = queryset

        # State filter
        if state_slug:
            candidate_qs = candidate_qs.filter(
                Q(state__slug=state_slug) | Q(state__name__iexact=state_slug) | Q(state__code__iexact=state_slug)
            )

        # Region filter
        if region_slug:
            candidate_qs = candidate_qs.filter(
                Q(region=region_slug) | Q(region_obj__slug=region_slug) | Q(state__region__slug=region_slug)
            )

        # Pilgrimage collection filter
        if pilgrimage:
            candidate_qs = candidate_qs.filter(pilgrimage_collection=pilgrimage)

        # Category filter
        if category:
            cat_slug = category.lower()
            candidate_qs = candidate_qs.filter(
                Q(categories__name__icontains=cat_slug) |
                Q(categories__slug__icontains=cat_slug) |
                Q(famous_for__icontains=cat_slug) |
                Q(description__icontains=cat_slug) |
                Q(short_description__icontains=cat_slug)
            ).distinct()

        # Score & calculate distance for each candidate
        scored_results = []
        for dest in candidate_qs:
            distance_km = None
            travel_time_str = None
            dist_score = 0.0

            # Geodesic Distance
            if origin_coords and dest.latitude and dest.longitude:
                try:
                    d_km = calculate_haversine_distance(
                        origin_coords[0], origin_coords[1],
                        float(dest.latitude), float(dest.longitude)
                    )
                    distance_km = d_km
                    travel_time_str = estimate_travel_time(d_km)

                    # If radius constraint is specified and destination exceeds it, skip
                    if max_dist and d_km > max_dist:
                        continue

                    # Distance Proximity Score (Max 35 pts)
                    if d_km <= 50:
                        dist_score = 35.0
                    elif d_km <= 100:
                        dist_score = 28.0
                    elif d_km <= 200:
                        dist_score = 20.0
                    elif d_km <= 400:
                        dist_score = 12.0
                    else:
                        dist_score = 5.0
                except Exception:
                    pass
            elif max_dist and origin_coords:
                # If distance radius required but destination lacks coordinates, skip
                continue

            # 2. Rating & Popularity Score (Max 35 pts)
            rating_score = float(dest.avg_rating or 4.5) * 4.0  # Max 20 pts
            pop_score = (dest.popularity_score / 100.0) * 15.0  # Max 15 pts

            # 3. Category & Text Relevance Score (Max 25 pts)
            relevance_score = 0.0
            dest_text = f"{dest.name} {dest.short_description} {dest.famous_for} {dest.things_to_do} {dest.suitable_for_tags}".lower()
            
            tokens = [w for w in norm_query.split() if len(w) > 2]
            for t in tokens:
                if t in dest.name.lower():
                    relevance_score += 8.0
                elif t in dest_text:
                    relevance_score += 3.0
            relevance_score = min(25.0, relevance_score)

            # 4. Difficulty Alignment Score (Max 10 pts)
            diff_score = 0.0
            if difficulty:
                if dest.trekking_difficulty == difficulty:
                    diff_score = 10.0
                elif dest.trekking_difficulty != 'none':
                    diff_score = 4.0

            # 5. Suitability & Duration Score (Max 10 pts)
            suitability_score = 0.0
            if duration_type and dest.trip_duration_type == duration_type:
                suitability_score += 5.0
            for stag in suitability_tags:
                if stag in dest.suitable_for_tags.lower():
                    suitability_score += 3.0
            suitability_score = min(10.0, suitability_score)

            # Verification Bonus
            verif_score = 5.0 if dest.verification_status == 'verified' else 0.0

            total_rec_score = round(dist_score + rating_score + pop_score + relevance_score + diff_score + suitability_score + verif_score, 1)

            scored_results.append({
                'destination': dest,
                'distance_km': distance_km,
                'travel_time_str': travel_time_str,
                'recommendation_score': total_rec_score,
                'match_reasons': TravelIntentEngine.generate_match_reasons(dest, intent, distance_km)
            })

        # Apply Sorting
        if sort_by == 'nearest':
            scored_results.sort(key=lambda x: (x['distance_km'] if x['distance_km'] is not None else 999999, -x['recommendation_score']))
        elif sort_by == 'highest_rated':
            scored_results.sort(key=lambda x: (-float(x['destination'].avg_rating or 0), -x['recommendation_score']))
        elif sort_by == 'popular':
            scored_results.sort(key=lambda x: (-x['destination'].popularity_score, -x['recommendation_score']))
        elif sort_by == 'newest':
            scored_results.sort(key=lambda x: x['destination'].created_at, reverse=True)
        else: # relevance / recommended
            scored_results.sort(key=lambda x: (-x['recommendation_score'], x['distance_km'] if x['distance_km'] is not None else 999999))

        return scored_results

    @staticmethod
    def generate_match_reasons(dest, intent, distance_km):
        reasons = []
        loc_name = intent.get('location_name')
        if distance_km and loc_name:
            reasons.append(f"~{distance_km} km from {loc_name}")
        if dest.trekking_difficulty in ['easy', 'moderate', 'difficult']:
            reasons.append(f"{dest.get_trekking_difficulty_display()} trek level")
        if dest.trip_duration_type:
            reasons.append(f"Ideal for {dest.get_trip_duration_type_display()}")
        if dest.avg_rating >= Decimal('4.6'):
            reasons.append(f"Top rated (★ {dest.avg_rating})")
        if dest.famous_for:
            reasons.append(dest.famous_for[:60] + ("..." if len(dest.famous_for) > 60 else ""))
        return reasons[:3]

    @staticmethod
    def get_autocomplete_suggestions(partial_query: str, limit=8):
        """Generates contextual query completions from database."""
        pq = normalize_query(partial_query)
        suggestions = []
        
        # Match city
        matched_cities = [c.title() for c in CITY_COORDINATES if pq in c or any(c in pq for c in [c])]
        if not matched_cities:
            matched_cities = ['Hyderabad', 'Bangalore', 'Vijayawada', 'Mumbai', 'Chennai', 'Delhi', 'Jaipur', 'Kochi']

        if 'trek' in pq:
            suggestions.append("Trekking in India")
            suggestions.append("Best trekking places")
            for c in matched_cities[:3]:
                suggestions.append(f"Trekking near {c}")
            suggestions.append("Trekking in Himachal Pradesh")
            suggestions.append("Trekking in Kerala")
        elif 'temp' in pq:
            suggestions.append("Temples in India")
            suggestions.append("Temples in Tamil Nadu")
            suggestions.append("Temples in Andhra Pradesh")
            for c in matched_cities[:2]:
                suggestions.append(f"Temples near {c}")
            suggestions.append("Jyotirlinga temples in India")
        elif 'beach' in pq:
            suggestions.append("Best beaches in Goa")
            suggestions.append("Best beaches in Kerala")
            suggestions.append("Beaches in Andaman")
            suggestions.append("Beaches in South India")
        elif 'water' in pq:
            suggestions.append("Best waterfalls in Karnataka")
            for c in matched_cities[:2]:
                suggestions.append(f"Best waterfalls near {c}")
            suggestions.append("Waterfalls in Western Ghats")
        elif 'wild' in pq or 'safar' in pq:
            suggestions.append("Wildlife places in India")
            for c in matched_cities[:2]:
                suggestions.append(f"Wildlife places near {c}")
            suggestions.append("Tiger reserves in India")
        elif 'jyot' in pq or 'shiva' in pq:
            suggestions.append("12 Jyotirlingas in India")
            suggestions.append("Jyotirlingas in Maharashtra")
            suggestions.append("Jyotirlingas in Madhya Pradesh")
            suggestions.append("Kedarnath Temple")
            suggestions.append("Somnath Temple")
        elif 'week' in pq or 'trip' in pq:
            for c in matched_cities[:3]:
                suggestions.append(f"Weekend trips from {c}")
        elif 'himalay' in pq or 'mountain' in pq:
            suggestions.append("Best Himalayan destinations")
            suggestions.append("Mountains in Himachal Pradesh")
            suggestions.append("Hill stations in South India")
        elif 'spirit' in pq:
            suggestions.append("Spiritual places in South India")
            suggestions.append("Spiritual places in North India")
            suggestions.append("Char Dham pilgrimage")
        elif 'hist' in pq or 'fort' in pq or 'herit' in pq:
            suggestions.append("Historical places in Rajasthan")
            suggestions.append("Historical places near Delhi")
            suggestions.append("UNESCO heritage sites in India")
        else:
            for c in matched_cities[:3]:
                suggestions.append(f"Places to visit near {c}")
            suggestions.append("Best places to visit in Kerala")
            suggestions.append("Places to visit in Rajasthan")
            suggestions.append("Places to visit in Tamil Nadu")

        return list(dict.fromkeys(suggestions))[:limit]
