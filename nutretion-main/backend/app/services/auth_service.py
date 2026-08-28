from typing import Dict, Any, Tuple
from app.extensions import db
from app.models.user import User
from app.models.nutrition_target import NutritionTarget
from app.utils.security import hash_password, check_password, generate_jwt_token
from app.utils.validators import validate_email, validate_password
from app.services.nutrition_service import calculate_daily_targets

def register_user(data: dict) -> Tuple[bool, Dict[str, Any], int]:
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not name:
        return False, {"code": "INVALID_NAME", "message": "Name is required."}, 400

    if not validate_email(email):
        return False, {"code": "INVALID_EMAIL", "message": "Please enter a valid email address."}, 400

    is_valid_pass, pass_err = validate_password(password)
    if not is_valid_pass:
        return False, {"code": "INVALID_PASSWORD", "message": pass_err}, 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return False, {"code": "EMAIL_EXISTS", "message": "An account with this email address already exists."}, 400

    password_hash = hash_password(password)
    
    # Check if first user to assign ADMIN role
    user_count = User.query.count()
    role = 'ADMIN' if user_count == 0 else 'USER'

    new_user = User(
        name=name,
        email=email,
        password_hash=password_hash,
        role=role,
        age=22,
        gender='male',
        height=170.0,
        weight=65.0,
        activity_level='Moderately Active',
        workout_type='Gym',
        fitness_goal='Weight Maintenance'
    )

    db.session.add(new_user)
    db.session.flush() # get new_user.id

    # Create default nutrition targets
    targets_data = calculate_daily_targets(new_user)
    target_record = NutritionTarget(user_id=new_user.id, **targets_data)
    db.session.add(target_record)

    db.session.commit()

    token = generate_jwt_token(new_user.id, new_user.role)

    return True, {
        "user": new_user.to_dict(),
        "token": token
    }, 201

def login_user(data: dict) -> Tuple[bool, Dict[str, Any], int]:
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return False, {"code": "MISSING_CREDENTIALS", "message": "Email and password are required."}, 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password(password, user.password_hash):
        return False, {"code": "INVALID_CREDENTIALS", "message": "Invalid email or password."}, 401

    token = generate_jwt_token(user.id, user.role)

    return True, {
        "user": user.to_dict(),
        "token": token
    }, 200
