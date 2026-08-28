from flask import Blueprint, request
from app.extensions import db
from app.models.nutrition_target import NutritionTarget
from app.utils.security import token_required
from app.utils.validators import validate_profile_input
from app.utils.responses import success_response, error_response
from app.services.bmi_service import calculate_bmi
from app.services.nutrition_service import calculate_daily_targets

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')

@profile_bp.route('', methods=['GET'])
@token_required
def get_profile(current_user):
    bmi_data = calculate_bmi(current_user.height, current_user.weight)
    
    target_record = NutritionTarget.query.filter_by(user_id=current_user.id).first()
    if not target_record:
        targets_data = calculate_daily_targets(current_user)
        target_record = NutritionTarget(user_id=current_user.id, **targets_data)
        db.session.add(target_record)
        db.session.commit()

    return success_response(data={
        "user": current_user.to_dict(),
        "bmi": bmi_data,
        "targets": target_record.to_dict()
    }, message="Profile fetched successfully")

@profile_bp.route('', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json() or {}
    
    is_valid, err_msg = validate_profile_input(data)
    if not is_valid:
        return error_response(code="INVALID_PROFILE_DATA", message=err_msg, status_code=400)

    if 'name' in data: current_user.name = data['name'].strip()
    if 'age' in data: current_user.age = int(data['age']) if data['age'] is not None else None
    if 'gender' in data: current_user.gender = data['gender']
    if 'height' in data: current_user.height = float(data['height']) if data['height'] is not None else None
    if 'weight' in data: current_user.weight = float(data['weight']) if data['weight'] is not None else None
    if 'activity_level' in data: current_user.activity_level = data['activity_level']
    if 'workout_type' in data: current_user.workout_type = data['workout_type']
    if 'fitness_goal' in data: current_user.fitness_goal = data['fitness_goal']

    # Recalculate daily targets automatically
    new_targets = calculate_daily_targets(current_user)
    target_record = NutritionTarget.query.filter_by(user_id=current_user.id).first()
    if not target_record:
        target_record = NutritionTarget(user_id=current_user.id, **new_targets)
        db.session.add(target_record)
    else:
        for k, v in new_targets.items():
            setattr(target_record, k, v)

    db.session.commit()

    bmi_data = calculate_bmi(current_user.height, current_user.weight)

    return success_response(data={
        "user": current_user.to_dict(),
        "bmi": bmi_data,
        "targets": target_record.to_dict()
    }, message="Profile updated and nutritional targets recalculated successfully")
