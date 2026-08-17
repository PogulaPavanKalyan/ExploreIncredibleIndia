import random
from apps.destinations.models import Destination
from apps.categories.models import Category
from apps.states.models import State

class TravelPlannerEngine:
    @staticmethod
    def generate_itinerary(starting_location, destination_name, duration_days, budget, num_travelers, interests_str, transport_preference):
        days_count = max(1, min(int(duration_days), 14))
        total_budget = float(budget) if budget else 15000.0
        travelers = max(1, int(num_travelers))

        # Query matching destinations from DB
        qs = Destination.objects.filter(published=True).select_related('state', 'city').prefetch_related('attractions', 'categories')
        
        target = (destination_name or '').strip().lower()
        if target:
            matched_qs = qs.filter(
                models.Q(name__icontains=target) |
                models.Q(state__name__icontains=target) |
                models.Q(city__name__icontains=target) |
                models.Q(categories__name__icontains=target)
            ).distinct()
            if matched_qs.exists():
                qs = matched_qs

        dest_list = list(qs[:10])
        if not dest_list:
            dest_list = list(Destination.objects.filter(published=True)[:5])

        primary_dest = dest_list[0] if dest_list else None
        dest_title = primary_dest.name if primary_dest else (destination_name or "Incredible India")
        state_title = primary_dest.state.name if (primary_dest and primary_dest.state) else "India"

        # Calculate budget ratios
        est_hotel = round(total_budget * 0.35, 2)
        est_food = round(total_budget * 0.25, 2)
        est_transport = round(total_budget * 0.25, 2)
        est_misc = round(total_budget * 0.15, 2)

        # Build day-by-day itinerary
        day_by_day = []
        activities_pool = []
        for d in dest_list:
            for attr in d.attractions.all():
                activities_pool.append({
                    "name": attr.name,
                    "desc": attr.description or f"Explore the scenic beauty and heritage of {attr.name}.",
                    "cost": float(attr.ticket_price) if attr.ticket_price else 0.0
                })

        if not activities_pool:
            activities_pool = [
                {"name": f"Sightseeing in {dest_title}", "desc": "Visit popular viewpoints and cultural centers.", "cost": 100.0},
                {"name": "Local Cultural Market", "desc": "Shop for traditional handicrafts and local tea/coffee.", "cost": 200.0},
                {"name": "Nature & Landscape Walk", "desc": "Relaxing morning trail walk among pristine natural surroundings.", "cost": 0.0},
                {"name": "Heritage Monument Visit", "desc": "Explore historical landmarks and architectural legacy.", "cost": 150.0}
            ]

        for i in range(1, days_count + 1):
            act1 = activities_pool[(i * 2 - 2) % len(activities_pool)]
            act2 = activities_pool[(i * 2 - 1) % len(activities_pool)]
            
            day_by_day.append({
                "day": i,
                "title": f"Day {i}: {act1['name']} & {act2['name']}",
                "description": f"Morning visit to {act1['name']} ({act1['desc']}). Afternoon exploration of {act2['name']}. Evening local cuisine tasting.",
                "morning": f"Visit {act1['name']}",
                "afternoon": f"Explore {act2['name']}",
                "evening": "Sunset Viewpoint & Cultural Dinner",
                "estimated_travel_time": f"{random.randint(1, 3)} hours local commute",
                "distance_km": random.randint(15, 45),
                "suggested_food": f"Local regional thali and famous delicacies of {state_title}",
                "hotel": "Boutique Heritage Resort / Comfortable Stay",
                "estimated_daily_cost": round(total_budget / days_count, 2)
            })

        return {
            "title": f"{days_count}-Day Custom Travel Plan to {dest_title}",
            "starting_location": starting_location or "Hyderabad",
            "destination": f"{dest_title}, {state_title}",
            "duration_days": days_count,
            "num_travelers": travelers,
            "budget_breakdown": {
                "estimated_hotel_cost": est_hotel,
                "estimated_food_cost": est_food,
                "estimated_transport_cost": est_transport,
                "estimated_activities_cost": est_misc,
                "total_estimated_budget": round(total_budget, 2)
            },
            "day_by_day_itinerary": day_by_day
        }
