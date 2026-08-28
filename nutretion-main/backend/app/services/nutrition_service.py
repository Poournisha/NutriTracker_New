from typing import Dict, Any

def calculate_daily_targets(user) -> Dict[str, float]:
    """
    Calculates personalized daily nutritional targets based on user metrics:
    - BMR via Mifflin-St Jeor equation
    - TDEE based on activity level multiplier
    - Fitness goal adjustment
    - Macro distribution: Protein, Carbs, Fat
    - Essential Micronutrients: Iron, Calcium
    """
    weight = user.weight or 65.0
    height = user.height or 170.0
    age = user.age or 22
    gender = (user.gender or 'male').lower()
    activity = user.activity_level or 'Moderately Active'
    goal = user.fitness_goal or 'Weight Maintenance'

    # Mifflin-St Jeor BMR equation
    if gender == 'female':
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
    else:
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5

    # Activity level multiplier
    activity_multipliers = {
        'Sedentary': 1.2,
        'Lightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725
    }
    tdee = bmr * activity_multipliers.get(activity, 1.55)

    # Goal adjustment
    goal_adjustments = {
        'Weight Loss': -500,
        'Weight Maintenance': 0,
        'Muscle Building': 350,
        'General Health': 0
    }
    calorie_target = max(1200, tdee + goal_adjustments.get(goal, 0))

    # Protein target (grams) based on goal & weight
    if goal == 'Muscle Building':
        protein_g = weight * 2.0
    elif goal == 'Weight Loss':
        protein_g = weight * 1.8
    else:
        protein_g = weight * 1.4

    # Fat target (~25% of total calories)
    fat_calories = calorie_target * 0.25
    fat_g = fat_calories / 9.0

    # Carbohydrate target (Remaining calories)
    protein_calories = protein_g * 4.0
    carb_calories = max(500, calorie_target - protein_calories - fat_calories)
    carbs_g = carb_calories / 4.0

    # Micronutrients (RDA baseline)
    # Iron: Women need ~18mg, Men need ~8-10mg
    iron_mg = 18.0 if gender == 'female' else 10.0
    # Calcium: General target ~1000mg
    calcium_mg = 1000.0

    return {
        "calorie_target": round(calorie_target, 0),
        "protein_target": round(protein_g, 1),
        "carbs_target": round(carbs_g, 1),
        "fat_target": round(fat_g, 1),
        "iron_target": round(iron_mg, 1),
        "calcium_target": round(calcium_mg, 1)
    }
