from flask import Blueprint, request
from app.extensions import db
from app.models.user import User
from app.models.food import FoodItem
from app.utils.security import token_required, admin_required
from app.utils.responses import success_response, error_response

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/users', methods=['GET'])
@token_required
@admin_required
def get_all_users(current_user):
    users = User.query.order_by(User.created_at.desc()).all()
    return success_response(data={"users": [u.to_dict() for u in users]}, message="Users list retrieved")

@admin_bp.route('/foods', methods=['POST'])
@token_required
@admin_required
def add_food(current_user):
    data = request.get_json() or {}
    food_name = data.get('food_name', '').strip()
    category = data.get('category', 'General').strip()

    if not food_name:
        return error_response(code="INVALID_INPUT", message="Food name is required.", status_code=400)

    if FoodItem.query.filter(FoodItem.food_name.ilike(food_name)).first():
        return error_response(code="FOOD_EXISTS", message="Food item with this name already exists.", status_code=400)

    new_food = FoodItem(
        food_name=food_name,
        category=category,
        calories_per_100g=float(data.get('calories_per_100g', 0.0)),
        protein_per_100g=float(data.get('protein_per_100g', 0.0)),
        carbs_per_100g=float(data.get('carbs_per_100g', 0.0)),
        fat_per_100g=float(data.get('fat_per_100g', 0.0)),
        iron_per_100g=float(data.get('iron_per_100g', 0.0)),
        calcium_per_100g=float(data.get('calcium_per_100g', 0.0))
    )

    db.session.add(new_food)
    db.session.commit()

    return success_response(data={"food": new_food.to_dict()}, message="Food item created successfully", status_code=201)

@admin_bp.route('/foods/<int:food_id>', methods=['PUT'])
@token_required
@admin_required
def update_food(current_user, food_id):
    food = FoodItem.query.get(food_id)
    if not food:
        return error_response(code="FOOD_NOT_FOUND", message="Food item not found.", status_code=404)

    data = request.get_json() or {}
    if 'food_name' in data: food.food_name = data['food_name'].strip()
    if 'category' in data: food.category = data['category'].strip()
    if 'calories_per_100g' in data: food.calories_per_100g = float(data['calories_per_100g'])
    if 'protein_per_100g' in data: food.protein_per_100g = float(data['protein_per_100g'])
    if 'carbs_per_100g' in data: food.carbs_per_100g = float(data['carbs_per_100g'])
    if 'fat_per_100g' in data: food.fat_per_100g = float(data['fat_per_100g'])
    if 'iron_per_100g' in data: food.iron_per_100g = float(data['iron_per_100g'])
    if 'calcium_per_100g' in data: food.calcium_per_100g = float(data['calcium_per_100g'])

    db.session.commit()
    return success_response(data={"food": food.to_dict()}, message="Food item updated successfully")

@admin_bp.route('/foods/<int:food_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_food(current_user, food_id):
    food = FoodItem.query.get(food_id)
    if not food:
        return error_response(code="FOOD_NOT_FOUND", message="Food item not found.", status_code=404)

    db.session.delete(food)
    db.session.commit()
    return success_response(data={}, message="Food item deleted successfully")
