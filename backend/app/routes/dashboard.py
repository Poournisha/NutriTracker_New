from datetime import date
from flask import Blueprint
from sqlalchemy import func
from app.extensions import db
from app.models.meal import Meal
from app.models.nutrition_target import NutritionTarget
from app.utils.security import token_required
from app.utils.responses import success_response
from app.services.bmi_service import calculate_bmi
from app.services.nutrition_service import calculate_daily_targets
from app.services.deficiency_service import detect_nutrient_deficiencies
from app.services.recommendation_service import generate_recommendations

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('', methods=['GET'])
@token_required
def get_dashboard(current_user):
    today = date.today()

    # Calculate BMI
    bmi_info = calculate_bmi(current_user.height, current_user.weight)

    # Fetch or calculate Targets
    targets_rec = NutritionTarget.query.filter_by(user_id=current_user.id).first()
    if not targets_rec:
        targets_dict = calculate_daily_targets(current_user)
        targets_rec = NutritionTarget(user_id=current_user.id, **targets_dict)
        db.session.add(targets_rec)
        db.session.commit()
    
    targets = targets_rec.to_dict()

    # Query today's meals
    today_meals = Meal.query.filter(
        Meal.user_id == current_user.id,
        Meal.meal_date == today
    ).order_by(Meal.meal_time.desc()).all()

    # Sum consumed nutrients
    intake = {
        "calories": round(sum(m.total_calories for m in today_meals), 1),
        "protein": round(sum(m.total_protein for m in today_meals), 1),
        "carbs": round(sum(m.total_carbs for m in today_meals), 1),
        "fat": round(sum(m.total_fat for m in today_meals), 1),
        "iron": round(sum(m.total_iron for m in today_meals), 1),
        "calcium": round(sum(m.total_calcium for m in today_meals), 1)
    }

    # Deficiency alerts
    deficiencies = detect_nutrient_deficiencies(intake, targets)

    # Recommendations
    recommendations = generate_recommendations(current_user, intake, targets)

    # Recent meals (up to 5)
    recent_meals = [m.to_dict() for m in today_meals[:5]]

    return success_response(data={
        "user": current_user.to_dict(),
        "bmi": bmi_info,
        "targets": targets,
        "intake": intake,
        "deficiencies": deficiencies,
        "recommendations": recommendations,
        "recent_meals": recent_meals,
        "disclaimer": "Nutrition estimates are informational and are not a substitute for professional medical or dietary advice."
    }, message="Dashboard data loaded")
