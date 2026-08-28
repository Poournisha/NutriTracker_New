from typing import Dict, Any

def estimate_portion(bbox_area_ratio: float, food_name: str) -> Dict[str, Any]:
    """
    Estimates food portion weight (in grams) and portion category based on bounding-box area ratio relative to image/plate.
    Standard serving baseline for 1.0 (100% plate coverage) is ~300g-400g depending on food density.
    """
    # Base density modifier (grams per standard full plate)
    density_map = {
        'rice': 350,
        'curd rice': 350,
        'lemon rice': 320,
        'tomato rice': 320,
        'sambar': 250,
        'rasam': 250,
        'dal': 250,
        'vegetable curry': 220,
        'potato curry': 250,
        'chapati': 100, # per piece/serving
        'dosa': 120,
        'idli': 80,
        'poori': 90,
        'vada': 70,
        'curd': 150,
        'milk': 200,
        'banana': 100,
        'apple': 120,
        'egg': 50,
        'chicken': 180
    }

    base_weight = density_map.get(food_name.lower(), 200)

    # Classify portion size based on bounding box ratio
    if bbox_area_ratio < 0.15:
        category = "Small"
        multiplier = 0.6
    elif 0.15 <= bbox_area_ratio < 0.35:
        category = "Medium"
        multiplier = 1.0
    elif 0.35 <= bbox_area_ratio < 0.55:
        category = "Large"
        multiplier = 1.4
    else:
        category = "Very Large"
        multiplier = 1.8

    estimated_grams = round(base_weight * multiplier, 0)

    return {
        "estimated_grams": estimated_grams,
        "portion_category": category,
        "is_estimate": True
    }
