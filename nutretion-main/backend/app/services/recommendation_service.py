from typing import List, Dict, Any
from app.models.food import FoodItem
from app.services.deficiency_service import detect_nutrient_deficiencies

def generate_recommendations(user, daily_intake: Dict[str, float], targets: Dict[str, float]) -> List[Dict[str, Any]]:
    """
    Generates personalized food recommendations based on:
    - User fitness goal & BMI
    - Active nutrient gaps (Protein, Iron, Calcium)
    - Reference foods queried directly from the food database
    """
    deficiencies = detect_nutrient_deficiencies(daily_intake, targets)
    recommendations = []

    # Map of nutrient deficiency -> food database search terms
    food_mapping = {
        "protein": ["Egg", "Chicken", "Dal", "Curd", "Milk"],
        "iron": ["Dal", "Sambar", "Apple", "Vegetable Curry"],
        "calcium": ["Milk", "Curd", "Curd Rice"]
    }

    for defic in deficiencies:
        nutrient_key = defic["nutrient"]
        label = defic["label"]
        severity = defic["severity"]

        search_terms = food_mapping.get(nutrient_key, ["Dal", "Curd"])
        
        # Query database for matching foods
        suggested_foods = []
        for term in search_terms:
            item = FoodItem.query.filter(FoodItem.food_name.ilike(f"%{term}%")).first()
            if item:
                suggested_foods.append({
                    "id": item.id,
                    "food_name": item.food_name,
                    "category": item.category,
                    "calories_per_100g": item.calories_per_100g,
                    "nutrient_amount": getattr(item, f"{nutrient_key}_per_100g", 0.0)
                })

        goal_hint = f" to support your '{user.fitness_goal or 'General Health'}' goal"
        msg = f"Boost your intake of {label} with nutrient-rich hostel menu items{goal_hint}."

        recommendations.append({
            "nutrient": nutrient_key,
            "severity": severity,
            "message": msg,
            "suggested_foods": suggested_foods
        })

    # If no deficiencies, provide general balanced eating recommendation
    if not recommendations:
        all_foods = FoodItem.query.limit(4).all()
        recommendations.append({
            "nutrient": "general",
            "severity": "LOW",
            "message": "Great job! Your current dietary intake aligns well with your daily targets. Keep up the balanced diet!",
            "suggested_foods": [f.to_dict() for f in all_foods]
        })

    return recommendations
