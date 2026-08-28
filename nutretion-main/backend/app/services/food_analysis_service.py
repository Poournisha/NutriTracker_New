from typing import Dict, Any, List
from app.ml.preprocessing import validate_image_quality
from app.ml.model_manager import model_manager
from app.services.portion_service import estimate_portion
from app.models.food import FoodItem

def analyze_food_image(image_bytes: bytes) -> Dict[str, Any]:
    """
    Executes complete food analysis pipeline:
    Image -> Quality Verification -> YOLOv8 Detection -> EfficientNet Classification -> Portion Estimation -> Database Lookup -> Nutrient Calculation
    """
    # 1. Image quality check
    is_valid, quality_info = validate_image_quality(image_bytes)
    if not is_valid:
        return {
            "success": False,
            "error": {
                "code": quality_info.get("code", "IMAGE_QUALITY_LOW"),
                "message": quality_info.get("message", "Image quality is insufficient.")
            }
        }

    # 2. YOLOv8 Detection
    detector = model_manager.detector
    detections = detector.detect(image_bytes)

    if not detections:
        return {
            "success": False,
            "error": {
                "code": "NO_FOOD_DETECTED",
                "message": "No food items could be detected in the image. Please try capturing a clearer picture of your meal."
            }
        }

    detected_items = []
    meal_totals = {
        "calories": 0.0,
        "protein": 0.0,
        "carbs": 0.0,
        "fat": 0.0,
        "iron": 0.0,
        "calcium": 0.0
    }

    # 3. Process each detection
    for det in detections:
        food_name_raw = det["food"]
        confidence = det["confidence"]
        area_ratio = det.get("area_ratio", 0.25)
        bbox = det.get("bbox", [0, 0, 100, 100])

        # Match with reference database food item (case-insensitive substring or match)
        food_db = FoodItem.query.filter(FoodItem.food_name.ilike(f"%{food_name_raw}%")).first()
        if not food_db:
            food_db = FoodItem.query.filter(FoodItem.food_name.ilike("Rice")).first()

        db_food_name = food_db.food_name if food_db else food_name_raw

        # Portion estimation
        portion_info = estimate_portion(area_ratio, db_food_name)
        grams = portion_info["estimated_grams"]
        portion_category = portion_info["portion_category"]

        # Nutrient calculation: (value_per_100g * grams) / 100
        if food_db:
            item_calories = round((food_db.calories_per_100g * grams) / 100.0, 1)
            item_protein = round((food_db.protein_per_100g * grams) / 100.0, 1)
            item_carbs = round((food_db.carbs_per_100g * grams) / 100.0, 1)
            item_fat = round((food_db.fat_per_100g * grams) / 100.0, 1)
            item_iron = round((food_db.iron_per_100g * grams) / 100.0, 1)
            item_calcium = round((food_db.calcium_per_100g * grams) / 100.0, 1)
            food_id = food_db.id
            category = food_db.category
        else:
            item_calories, item_protein, item_carbs, item_fat, item_iron, item_calcium = 150.0, 5.0, 25.0, 3.0, 1.0, 20.0
            food_id = 1
            category = "General"

        meal_totals["calories"] += item_calories
        meal_totals["protein"] += item_protein
        meal_totals["carbs"] += item_carbs
        meal_totals["fat"] += item_fat
        meal_totals["iron"] += item_iron
        meal_totals["calcium"] += item_calcium

        detected_items.append({
            "food_id": food_id,
            "food_name": db_food_name,
            "category": category,
            "confidence": confidence,
            "bbox": bbox,
            "estimated_grams": grams,
            "portion_category": portion_category,
            "calories": item_calories,
            "protein": item_protein,
            "carbs": item_carbs,
            "fat": item_fat,
            "iron": item_iron,
            "calcium": item_calcium
        })

    # Round totals
    for k in meal_totals:
        meal_totals[k] = round(meal_totals[k], 1)

    return {
        "success": True,
        "data": {
            "image_quality": quality_info,
            "detected_items": detected_items,
            "meal_totals": meal_totals,
            "demo_mode": model_manager.demo_mode,
            "disclaimer": "Nutritional estimations are calculated based on image recognition and portion approximations."
        }
    }
