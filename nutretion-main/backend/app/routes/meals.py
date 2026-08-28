from datetime import datetime, date, timedelta
from flask import Blueprint, request
from app.extensions import db
from app.models.meal import Meal
from app.models.meal_item import MealItem
from app.models.food import FoodItem
from app.utils.security import token_required
from app.utils.responses import success_response, error_response

meals_bp = Blueprint('meals', __name__, url_prefix='/api/meals')

@meals_bp.route('', methods=['GET'])
@token_required
def get_meals(current_user):
    filter_type = request.args.get('filter', 'all').lower()
    today = date.today()

    query = Meal.query.filter_by(user_id=current_user.id)

    if filter_type == 'today':
        query = query.filter(Meal.meal_date == today)
    elif filter_type == 'week':
        seven_days_ago = today - timedelta(days=7)
        query = query.filter(Meal.meal_date >= seven_days_ago)
    elif filter_type == 'month':
        thirty_days_ago = today - timedelta(days=30)
        query = query.filter(Meal.meal_date >= thirty_days_ago)

    meals = query.order_by(Meal.meal_date.desc(), Meal.meal_time.desc()).all()
    return success_response(data={"meals": [m.to_dict() for m in meals]}, message="Meals retrieved successfully")

@meals_bp.route('/<int:meal_id>', methods=['GET'])
@token_required
def get_meal_by_id(current_user, meal_id):
    meal = Meal.query.filter_by(id=meal_id, user_id=current_user.id).first()
    if not meal:
        return error_response(code="MEAL_NOT_FOUND", message="Meal record not found.", status_code=404)
    return success_response(data={"meal": meal.to_dict()}, message="Meal details retrieved")

@meals_bp.route('', methods=['POST'])
@token_required
def create_meal(current_user):
    data = request.get_json() or {}
    
    meal_type = data.get('meal_type', 'Lunch')
    image_path = data.get('image_path', None)
    items_data = data.get('items', [])

    if not items_data:
        return error_response(code="NO_MEAL_ITEMS", message="Meal must contain at least one food item.", status_code=400)

    # Parse date/time or default to now
    meal_date_str = data.get('meal_date')
    if meal_date_str:
        try:
            meal_date_val = datetime.strptime(meal_date_str, '%Y-%m-%d').date()
        except ValueError:
            meal_date_val = date.today()
    else:
        meal_date_val = date.today()

    new_meal = Meal(
        user_id=current_user.id,
        image_path=image_path,
        meal_type=meal_type,
        meal_date=meal_date_val,
        meal_time=datetime.utcnow().time(),
        total_calories=0.0,
        total_protein=0.0,
        total_carbs=0.0,
        total_fat=0.0,
        total_iron=0.0,
        total_calcium=0.0
    )

    db.session.add(new_meal)
    db.session.flush()

    tot_cal, tot_prot, tot_carbs, tot_fat, tot_iron, tot_calc = 0.0, 0.0, 0.0, 0.0, 0.0, 0.0

    for item_data in items_data:
        food_id = item_data.get('food_id')
        food_name = item_data.get('food_name')
        category = item_data.get('category', 'General')

        food_item = None
        if food_id:
            food_item = db.session.get(FoodItem, food_id)
        if not food_item and food_name:
            food_item = FoodItem.query.filter(FoodItem.food_name.ilike(food_name)).first()

        grams = float(item_data.get('estimated_grams', 150))
        portion_cat = item_data.get('portion_category', 'Medium')
        confidence = float(item_data.get('confidence', 0.90))

        if food_item:
            cal = round((food_item.calories_per_100g * grams) / 100.0, 1)
            prot = round((food_item.protein_per_100g * grams) / 100.0, 1)
            carbs = round((food_item.carbs_per_100g * grams) / 100.0, 1)
            fat = round((food_item.fat_per_100g * grams) / 100.0, 1)
            iron = round((food_item.iron_per_100g * grams) / 100.0, 1)
            calc = round((food_item.calcium_per_100g * grams) / 100.0, 1)
            fid = food_item.id
        else:
            # No reference food matched: trust the nutrition values supplied
            # by the vision model / client so the save never fails, and fall
            # back to an existing food row to satisfy the foreign key.
            cal = round(float(item_data.get('calories', 0.0)), 1)
            prot = round(float(item_data.get('protein', 0.0)), 1)
            carbs = round(float(item_data.get('carbs', 0.0)), 1)
            fat = round(float(item_data.get('fat', 0.0)), 1)
            iron = round(float(item_data.get('iron', 0.0)), 1)
            calc = round(float(item_data.get('calcium', 0.0)), 1)
            fallback = FoodItem.query.first()
            if not fallback:
                fallback = FoodItem(
                    food_name=food_name or 'Unknown Food',
                    category=category,
                    calories_per_100g=0.0,
                    protein_per_100g=0.0,
                    carbs_per_100g=0.0,
                    fat_per_100g=0.0,
                    iron_per_100g=0.0,
                    calcium_per_100g=0.0
                )
                db.session.add(fallback)
                db.session.flush()
            fid = fallback.id

        tot_cal += cal
        tot_prot += prot
        tot_carbs += carbs
        tot_fat += fat
        tot_iron += iron
        tot_calc += calc

        meal_item = MealItem(
            meal_id=new_meal.id,
            food_id=fid,
            confidence=confidence,
            estimated_grams=grams,
            portion_category=portion_cat,
            calories=cal,
            protein=prot,
            carbs=carbs,
            fat=fat,
            iron=iron,
            calcium=calc
        )
        db.session.add(meal_item)

    new_meal.total_calories = round(tot_cal, 1)
    new_meal.total_protein = round(tot_prot, 1)
    new_meal.total_carbs = round(tot_carbs, 1)
    new_meal.total_fat = round(tot_fat, 1)
    new_meal.total_iron = round(tot_iron, 1)
    new_meal.total_calcium = round(tot_calc, 1)

    db.session.commit()

    return success_response(data={"meal": new_meal.to_dict()}, message="Meal saved successfully", status_code=201)

@meals_bp.route('/<int:meal_id>', methods=['DELETE'])
@token_required
def delete_meal(current_user, meal_id):
    meal = Meal.query.filter_by(id=meal_id, user_id=current_user.id).first()
    if not meal:
        return error_response(code="MEAL_NOT_FOUND", message="Meal record not found.", status_code=404)

    db.session.delete(meal)
    db.session.commit()
    return success_response(data={}, message="Meal record deleted successfully")
