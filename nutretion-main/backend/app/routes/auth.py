from flask import Blueprint, request
from app.utils.security import token_required
from app.utils.responses import success_response, error_response
from app.services.auth_service import register_user, login_user

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    success, res_data, status = register_user(data)
    if not success:
        return error_response(code=res_data.get('code'), message=res_data.get('message'), status_code=status)
    return success_response(data=res_data, message="Registration successful", status_code=status)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    success, res_data, status = login_user(data)
    if not success:
        return error_response(code=res_data.get('code'), message=res_data.get('message'), status_code=status)
    return success_response(data=res_data, message="Login successful", status_code=status)

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return success_response(data={"user": current_user.to_dict()}, message="User details retrieved successfully")

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    return success_response(data={}, message="Successfully logged out")
