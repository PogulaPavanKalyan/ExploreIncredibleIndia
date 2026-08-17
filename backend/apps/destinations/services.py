import random
from datetime import datetime, timedelta

class WeatherService:
    @staticmethod
    def get_destination_weather(destination):
        category = destination.category.name.lower() if hasattr(destination, 'category') and destination.category else ''
        dest_name = destination.name.lower()

        # Category-based climate defaults
        if 'hill' in dest_name or 'mountain' in dest_name or 'valley' in category:
            base_temp = 22
            condition = "Pleasant & Breezy"
            icon = "pleasant"
        elif 'beach' in dest_name or 'coastal' in category:
            base_temp = 29
            condition = "Sunny & Warm"
            icon = "sunny"
        elif 'fort' in dest_name or 'heritage' in category:
            base_temp = 26
            condition = "Clear Sky"
            icon = "clear"
        elif 'waterfall' in category:
            base_temp = 24
            condition = "Misty & Humid"
            icon = "misty"
        else:
            base_temp = 25
            condition = "Moderate & Pleasant"
            icon = "pleasant"

        today = datetime.now()
        forecast = []
        for i in range(5):
            day_date = today + timedelta(days=i)
            day_temp = base_temp + random.randint(-2, 3)
            forecast.append({
                "date": day_date.strftime("%a, %b %d"),
                "day_name": "Today" if i == 0 else day_date.strftime("%a"),
                "temp_c": day_temp,
                "temp_f": round(day_temp * 9/5 + 32, 1),
                "condition": condition,
                "icon": icon,
                "humidity_pct": random.randint(55, 78),
                "wind_kmh": random.randint(8, 18)
            })

        return {
            "current": forecast[0],
            "forecast_5_days": forecast,
            "best_season": destination.best_time_to_visit or "October to March"
        }
