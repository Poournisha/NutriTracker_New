import re
from typing import Tuple, Optional

EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

def validate_email(email: str) -> bool:
    if not email or not isinstance(email, str):
        return False
    return bool(re.match(EMAIL_REGEX, email.strip()))

def validate_password(password: str) -> Tuple[bool, Optional[str]]:
    if not password or len(password) < 8:
        return False, "Password must be at least 8 characters long."
    return True, None

def validate_profile_input(data: dict) -> Tuple[bool, Optional[str]]:
    if 'age' in data and data['age'] is not None:
        try:
            age = int(data['age'])
            if age < 1 or age > 120:
                return False, "Age must be between 1 and 120."
        except (ValueError, TypeError):
            return False, "Age must be a valid integer."
            
    if 'height' in data and data['height'] is not None:
        try:
            height = float(data['height'])
            if height < 50.0 or height > 250.0:
                return False, "Height must be between 50 cm and 250 cm."
        except (ValueError, TypeError):
            return False, "Height must be a valid number."

    if 'weight' in data and data['weight'] is not None:
        try:
            weight = float(data['weight'])
            if weight < 20.0 or weight > 300.0:
                return False, "Weight must be between 20 kg and 300 kg."
        except (ValueError, TypeError):
            return False, "Weight must be a valid number."

    valid_activities = {'Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'}
    if 'activity_level' in data and data['activity_level']:
        if data['activity_level'] not in valid_activities:
            return False, f"Activity level must be one of: {', '.join(valid_activities)}"

    valid_goals = {'Weight Loss', 'Weight Maintenance', 'Muscle Building', 'General Health'}
    if 'fitness_goal' in data and data['fitness_goal']:
        if data['fitness_goal'] not in valid_goals:
            return False, f"Fitness goal must be one of: {', '.join(valid_goals)}"

    valid_workouts = {'None', 'Walking', 'Running', 'Gym', 'Sports', 'Other'}
    if 'workout_type' in data and data['workout_type']:
        if data['workout_type'] not in valid_workouts:
            return False, f"Workout type must be one of: {', '.join(valid_workouts)}"

    return True, None

def allowed_file(filename: str, allowed_extensions: set) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions
