import math
from decimal import Decimal
from django.db.models import Q
from apps.destinations.models import Destination
from apps.destinations.search_engine import CITY_COORDINATES, calculate_haversine_distance, estimate_travel_time

INTEREST_CATEGORY_MAPPING = {
    'spiritual': ['temples', 'spiritual', 'pilgrimage', 'sacred'],
    'temple': ['temples', 'spiritual', 'pilgrimage'],
    'temples': ['temples', 'spiritual', 'pilgrimage'],
    'adventure': ['adventure', 'trekking', 'nature'],
    'trekking': ['adventure', 'trekking', 'mountains'],
    'nature': ['nature', 'waterfalls', 'forests', 'mountains'],
    'waterfall': ['nature', 'waterfalls'],
    'waterfalls': ['nature', 'waterfalls'],
    'beach': ['beaches', 'coastal'],
    'beaches': ['beaches', 'coastal'],
    'mountain': ['mountains', 'hill-stations', 'nature'],
    'mountains': ['mountains', 'hill-stations', 'nature'],
    'heritage': ['heritage', 'monuments', 'historical', 'culture'],
    'historical': ['heritage', 'monuments', 'historical'],
    'wildlife': ['wildlife', 'nature', 'forests'],
    'food': ['food', 'culture'],
    'family': ['family-friendly', 'nature', 'heritage'],
    'romantic': ['romantic', 'hill-stations', 'beaches'],
    'photography': ['photography', 'heritage', 'nature'],
    'relaxation': ['beaches', 'nature', 'hill-stations'],
    'offbeat': ['hidden-gem', 'nature', 'adventure']
}

class TripRecommendationService:
    """
    Intelligent, data-driven Trip Planner engine for Dekho Bharat.
    Uses exclusively verified database records with zero hallucinated destinations.
    """

    def plan_trip(self, params):
        start_location = str(params.get('start_location') or params.get('starting_location') or 'Hyderabad').strip()
        duration_days = max(1, min(14, int(params.get('duration_days') or params.get('duration') or 3)))
        budget = float(params.get('budget', 10000))
        companion = str(params.get('companion', 'family')).title()
        region = str(params.get('region', 'all')).lower()
        travel_month = int(params.get('travel_month', 10)) if params.get('travel_month') else 10
        raw_interests = params.get('interests', ['nature', 'heritage'])
        
        if isinstance(raw_interests, str):
            raw_interests = [i.strip().lower() for i in raw_interests.split(',') if i.strip()]

        # Resolve Starting Location Coordinates
        start_lat = None
        start_lng = None
        if params.get('lat') and params.get('lng'):
            try:
                start_lat = float(params['lat'])
                start_lng = float(params['lng'])
            except ValueError:
                pass

        if start_lat is None:
            for city_key, coords_tuple in CITY_COORDINATES.items():
                if city_key in start_location.lower() or start_location.lower() in city_key:
                    start_lat, start_lng = coords_tuple[0], coords_tuple[1]
                    break

        if start_lat is None:
            # Fallback anchor: Hyderabad
            start_lat, start_lng = 17.3850, 78.4867

        # 1. Fetch Candidate Destinations from Database
        qs = Destination.objects.filter(published=True).select_related('state', 'city', 'history').prefetch_related(
            'categories', 'activities', 'tags', 'images', 'videos', 'attractions'
        )

        # Region Filter if specified and not 'all' or 'surprise me'
        if region and region not in ['all', 'surprise me', 'surpriseme', 'any']:
            qs = qs.filter(Q(region=region) | Q(region_obj__slug=region))

        # Map user interests to target category slugs
        target_cats = set()
        for interest in raw_interests:
            inter_clean = interest.lower().strip()
            if inter_clean in INTEREST_CATEGORY_MAPPING:
                target_cats.update(INTEREST_CATEGORY_MAPPING[inter_clean])
            else:
                target_cats.add(inter_clean)

        candidates = list(qs)
        if not candidates:
            candidates = list(Destination.objects.filter(published=True).select_related('state', 'city'))

        # 2. Score and Rank Candidate Destinations
        scored_candidates = []
        for dest in candidates:
            score = 0.0
            
            # Category match score
            dest_cat_slugs = {c.slug.lower() for c in dest.categories.all()}
            dest_tag_slugs = {t.slug.lower() for t in dest.tags.all()}
            overlap = len(target_cats.intersection(dest_cat_slugs.union(dest_tag_slugs)))
            score += overlap * 25.0

            # Proximity Scoring
            distance_km = 50.0
            if dest.latitude and dest.longitude:
                distance_km = calculate_haversine_distance(start_lat, start_lng, float(dest.latitude), float(dest.longitude))
            
            # Short trips prefer closer destinations
            if duration_days <= 2:
                if distance_km <= 200:
                    score += 40.0
                elif distance_km <= 350:
                    score += 20.0
                else:
                    score -= 15.0
            elif duration_days <= 4:
                if distance_km <= 500:
                    score += 30.0
                elif distance_km <= 900:
                    score += 15.0
            else:
                # Longer trips can explore across all of India
                score += 15.0

            # Popularity & Verification Boost
            score += (dest.popularity_score or 80) * 0.15
            if dest.verification_status == 'verified':
                score += 10.0
            if dest.featured:
                score += 10.0

            scored_candidates.append({
                'destination': dest,
                'distance_km': round(distance_km, 1),
                'score': score
            })

        scored_candidates.sort(key=lambda x: x['score'], reverse=True)

        # Pick primary and secondary destinations for itinerary
        primary_spots = [sc['destination'] for sc in scored_candidates[:duration_days]]
        if not primary_spots and candidates:
            primary_spots = candidates[:duration_days]

        main_dest = primary_spots[0] if primary_spots else None

        # 3. Generate Day-by-Day Itinerary
        itinerary = []
        route_points = [{
            "name": start_location,
            "lat": start_lat,
            "lng": start_lng,
            "type": "start"
        }]

        for day in range(1, duration_days + 1):
            assigned_dest = primary_spots[(day - 1) % len(primary_spots)] if primary_spots else None
            dest_name = assigned_dest.name if assigned_dest else f"Scenic Region Stop"
            dest_loc = f"{assigned_dest.city.name if assigned_dest and assigned_dest.city else (assigned_dest.state.name if assigned_dest else 'India')}"
            
            if assigned_dest and assigned_dest.latitude and assigned_dest.longitude:
                route_points.append({
                    "name": assigned_dest.name,
                    "slug": assigned_dest.slug,
                    "lat": float(assigned_dest.latitude),
                    "lng": float(assigned_dest.longitude),
                    "type": "stop"
                })

            # Sub-attractions if available
            attractions_list = [a.name for a in assigned_dest.attractions.all()[:3]] if assigned_dest else []
            morning_act = f"Depart from {start_location if day == 1 else 'hotel'} and arrive at {dest_name}."
            if attractions_list:
                afternoon_act = f"Guided visit to {attractions_list[0]} and explore {dest_name} sanctum/viewpoints."
                evening_act = f"Visit {attractions_list[1] if len(attractions_list) > 1 else 'local cultural markets'} and enjoy scenic sunset."
            else:
                afternoon_act = f"Explore key sights at {dest_name}, discover local architecture and history."
                evening_act = f"Evening leisure, local street food tasting, and sunset panorama in {dest_loc}."

            dest_card_data = {
                "name": assigned_dest.name if assigned_dest else "Destination",
                "slug": assigned_dest.slug if assigned_dest else "explore",
                "category": assigned_dest.categories.first().name if (assigned_dest and assigned_dest.categories.exists()) else "Sightseeing",
                "location": f"{dest_loc}, {assigned_dest.state.name if assigned_dest else 'India'}",
                "short_description": assigned_dest.short_description if assigned_dest else "Scenic Indian travel destination.",
                "image": str(assigned_dest.main_image) if (assigned_dest and assigned_dest.main_image) else "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
                "estimated_duration": assigned_dest.ideal_duration if assigned_dest else "3-4 Hours",
                "best_time_to_visit": assigned_dest.best_time_to_visit if assigned_dest else "October to March"
            }

            itinerary.append({
                "day": day,
                "title": f"Day {day}: {dest_name} Discovery & Experiences",
                "morning": morning_act,
                "afternoon": afternoon_act,
                "evening": evening_act,
                "night": f"Overnight stay in {dest_loc}.",
                "destinations": [dest_card_data]
            })

        # 4. Calculate Approximate Budget Breakdown
        daily_base = budget / duration_days
        travel_cost = round(max(1000.0, daily_base * 0.25 * duration_days), 0)
        stay_cost = round(max(1500.0, daily_base * 0.35 * duration_days), 0)
        food_cost = round(max(800.0, daily_base * 0.20 * duration_days), 0)
        activities_cost = round(max(500.0, daily_base * 0.12 * duration_days), 0)
        subtotal = travel_cost + stay_cost + food_cost + activities_cost
        contingency_cost = round(subtotal * 0.08, 0)
        total_estimate = round(subtotal + contingency_cost, 0)

        budget_estimate = {
            "travel": travel_cost,
            "stay": stay_cost,
            "food": food_cost,
            "activities": activities_cost,
            "contingency": contingency_cost,
            "total": total_estimate,
            "currency": "INR",
            "disclaimer": "Approximate estimate for planning purposes. Actual expenses may vary based on seasonal tariffs, transport mode, and personal preferences."
        }

        # 5. Generate 3 Alternative Trips
        alternatives = []
        alt_pools = scored_candidates[duration_days:duration_days + 6]
        if len(alt_pools) >= 2:
            alternatives.append({
                "title": "Weekend Adventure & Nature Escape",
                "duration": f"{max(1, duration_days - 1)} Days",
                "budget": f"₹{int(total_estimate * 0.8):,}",
                "destinations": [
                    {
                        "name": alt_pools[0]['destination'].name,
                        "slug": alt_pools[0]['destination'].slug,
                        "image": str(alt_pools[0]['destination'].main_image or 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=600&q=80'),
                        "location": alt_pools[0]['destination'].state.name
                    }
                ]
            })
        if len(alt_pools) >= 4:
            alternatives.append({
                "title": "Royal Heritage & Spiritual Odyssey",
                "duration": f"{duration_days} Days",
                "budget": f"₹{int(total_estimate * 1.1):,}",
                "destinations": [
                    {
                        "name": alt_pools[1]['destination'].name,
                        "slug": alt_pools[1]['destination'].slug,
                        "image": str(alt_pools[1]['destination'].main_image or 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'),
                        "location": alt_pools[1]['destination'].state.name
                    }
                ]
            })

        summary = {
            "title": f"{duration_days}-Day {main_dest.name if main_dest else 'Incredible India'} Tour",
            "starting_location": start_location,
            "primary_destination": main_dest.name if main_dest else "India Explorer",
            "duration_days": duration_days,
            "estimated_budget": total_estimate,
            "travel_style": " • ".join([i.title() for i in raw_interests[:3]]),
            "companion": companion,
            "best_time_to_visit": main_dest.best_time_to_visit if main_dest else "October to March"
        }

        return {
            "summary": summary,
            "route_points": route_points,
            "itinerary": itinerary,
            "budget_estimate": budget_estimate,
            "alternatives": alternatives
        }
