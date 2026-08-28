from datetime import date
from flask import Blueprint, request
from app.models.meal import Meal
from app.models.nutrition_target import NutritionTarget
from app.utils.security import token_required
from app.utils.responses import success_response, error_response
from app.services.bmi_service import calculate_bmi
from app.services.nutrition_service import calculate_daily_targets
from app.services.deficiency_service import detect_nutrient_deficiencies
from app.services.chatbot_service import query_ai_chatbot

chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/chat')

@chatbot_bp.route('', methods=['POST'])
@token_required
def chat(current_user):
    data = request.get_json() or {}
    message = data.get('message', '').strip()

    if not message:
        return error_response(code="EMPTY_MESSAGE", message="Chat message cannot be empty.", status_code=400)

    # Gather user context
    bmi_info = calculate_bmi(current_user.height, current_user.weight)
    
    target_rec = NutritionTarget.query.filter_by(user_id=current_user.id).first()
    targets = target_rec.to_dict() if target_rec else calculate_daily_targets(current_user)

    today = date.today()
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

    deficiencies = detect_nutrient_deficiencies(intake, targets)

    context = {
        "user": current_user.to_dict(),
        "bmi": bmi_info,
        "targets": targets,
        "intake": intake,
        "deficiencies": deficiencies
    }

    result = query_ai_chatbot(message, context)

    return success_response(data=result, message="Chatbot response generated")
