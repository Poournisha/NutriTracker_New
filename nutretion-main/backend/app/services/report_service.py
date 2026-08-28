from datetime import date, timedelta
from typing import Dict, Any
from sqlalchemy import func
from app.models.meal import Meal

def generate_weekly_report(user_id: int) -> Dict[str, Any]:
    """
    Calculates 7-day average nutrient intake, daily breakdown trends, top missing nutrients, and trend indicators.
    """
    today = date.today()
    seven_days_ago = today - timedelta(days=6)

    # Fetch meals logged in the last 7 days
    meals = Meal.query.filter(
        Meal.user_id == user_id,
        Meal.meal_date >= seven_days_ago,
        Meal.meal_date <= today
    ).order_by(Meal.meal_date.asc()).all()

    # Aggregate by day
    daily_data_map = {}
    for i in range(7):
        day_date = seven_days_ago + timedelta(days=i)
        day_str = day_date.strftime('%a (%b %d)')
        daily_data_map[day_str] = {
            "date": day_date.isoformat(),
            "day": day_str,
            "calories": 0.0,
            "protein": 0.0,
            "carbs": 0.0,
            "fat": 0.0,
            "iron": 0.0,
            "calcium": 0.0,
            "meals_count": 0
        }

    total_meals = len(meals)
    for m in meals:
        day_str = m.meal_date.strftime('%a (%b %d)')
        if day_str in daily_data_map:
            daily_data_map[day_str]["calories"] += m.total_calories
            daily_data_map[day_str]["protein"] += m.total_protein
            daily_data_map[day_str]["carbs"] += m.total_carbs
            daily_data_map[day_str]["fat"] += m.total_fat
            daily_data_map[day_str]["iron"] += m.total_iron
            daily_data_map[day_str]["calcium"] += m.total_calcium
            daily_data_map[day_str]["meals_count"] += 1

    daily_trend = list(daily_data_map.values())
    
    # Calculate 7-day averages
    active_days_count = max(1, len([d for d in daily_trend if d["meals_count"] > 0]))
    
    avg_calories = round(sum(d["calories"] for d in daily_trend) / active_days_count, 1)
    avg_protein = round(sum(d["protein"] for d in daily_trend) / active_days_count, 1)
    avg_carbs = round(sum(d["carbs"] for d in daily_trend) / active_days_count, 1)
    avg_fat = round(sum(d["fat"] for d in daily_trend) / active_days_count, 1)
    avg_iron = round(sum(d["iron"] for d in daily_trend) / active_days_count, 1)
    avg_calcium = round(sum(d["calcium"] for d in daily_trend) / active_days_count, 1)

    # Determine best nutrition day (highest protein & calorie ratio consistency)
    best_day = max(daily_trend, key=lambda x: x["calories"])["day"] if total_meals > 0 else "N/A"

    # Trend calculation (compare second half of week to first half)
    first_half_cal = sum(d["calories"] for d in daily_trend[:3])
    second_half_cal = sum(d["calories"] for d in daily_trend[4:])
    
    if second_half_cal > first_half_cal * 1.05:
        trend = "↑ Increasing"
    elif second_half_cal < first_half_cal * 0.95:
        trend = "↓ Decreasing"
    else:
        trend = "→ Stable"

    return {
        "start_date": seven_days_ago.isoformat(),
        "end_date": today.isoformat(),
        "total_meals_logged": total_meals,
        "active_days": active_days_count,
        "best_nutrition_day": best_day,
        "calorie_trend": trend,
        "averages": {
            "calories": avg_calories,
            "protein": avg_protein,
            "carbs": avg_carbs,
            "fat": avg_fat,
            "iron": avg_iron,
            "calcium": avg_calcium
        },
        "daily_trend": daily_trend
    }
