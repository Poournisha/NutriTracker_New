from typing import Dict, Any

def calculate_bmi(height_cm: float, weight_kg: float) -> Dict[str, Any]:
    """
    Calculates Body Mass Index (BMI) and returns value and classification category.
    Formula: BMI = weight_kg / (height_m ^ 2)
    """
    if not height_cm or not weight_kg or height_cm <= 0 or weight_kg <= 0:
        return {
            "bmi": None,
            "category": "Unknown",
            "message": "Valid weight and height are required to calculate BMI."
        }

    height_m = height_cm / 100.0
    bmi_value = round(weight_kg / (height_m * height_m), 1)

    if bmi_value < 18.5:
        category = "Underweight"
    elif 18.5 <= bmi_value < 24.9:
        category = "Normal"
    elif 25.0 <= bmi_value < 29.9:
        category = "Overweight"
    else:
        category = "Obese"

    return {
        "bmi": bmi_value,
        "category": category,
        "disclaimer": "Nutrition estimates are informational and are not a substitute for professional medical or dietary advice."
    }
