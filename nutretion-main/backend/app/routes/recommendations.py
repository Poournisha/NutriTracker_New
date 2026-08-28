from datetime import date
from flask import Blueprint
from app.models.meal import Meal
from app.models.nutrition_target import NutritionTarget
from app.utils.security import token_required
from app.utils.responses import success_response
from app.services.nutrition_service import calculate_daily_targets
from app.services.recommendation_service import generate_recommendations

recommendations_bp = Blueprint('recommendations', __name__, url_prefix='/api/recommendations')

@recommendations_bp.route('', methods=['GET'])
@token_required
def get_recommendations(current_user):
    today = date.today()
    
    # Calculate today's intake
    today_meals = Meal.query.filter(
        Meal.user_id == current_user.id,
        Meal.meal_date == today
    ).all()

    intake = {
        "calories": round(sum(m.total_calories for m in today_meals), 1),
        "protein": round(sum(m.total_protein for m in today_meals), 1),
        "carbs": round(sum(m.total_carbs for m in today_meals), 1),
        "fat": round(sum(m.total_fat for m in today_meals), 1),
        "iron": round(sum(m.total_iron for m in today_meals), 1),
        "calcium": round(sum(m.total_calcium for m in today_meals), 1)
    }

    target_rec = NutritionTarget.query.filter_by(user_id=current_user.id).first()
    targets = target_rec.to_dict() if target_rec else calculate_daily_targets(current_user)

    recommendations = generate_recommendations(current_user, intake, targets)
    
    return success_response(data={"recommendations": recommendations}, message="Recommendations generated successfully")
