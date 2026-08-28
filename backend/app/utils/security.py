import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from functools import wraps
from flask import request, current_app
from app.extensions import db
from app.models.user import User

def hash_password(password: str) -> str:
    """Hashes a plaintext password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def check_password(password: str, password_hash: str) -> bool:
    """Verifies a password against the stored bcrypt hash."""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

def generate_jwt_token(user_id: int, role: str = 'USER') -> str:
    """Generates a JWT token for a user."""
    now = datetime.now(timezone.utc)
    payload = {
        'sub': str(user_id),
        'role': role,
        'iat': now,
        'exp': now + timedelta(seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES'])
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

def decode_jwt_token(token: str):
    """Decodes and validates a JWT token."""
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        return payload
    except Exception as e:
        print(f"[JWT DECODE EXCEPTION] {type(e).__name__}: {str(e)}")
        return None

def token_required(f):
    """Decorator to protect routes requiring JWT authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return {'success': False, 'error': {'code': 'AUTH_TOKEN_MISSING', 'message': 'Authentication token missing'}}, 401
        
        payload = decode_jwt_token(token)
        if not payload:
            return {'success': False, 'error': {'code': 'AUTH_TOKEN_INVALID', 'message': 'Token is invalid or expired'}}, 401
        
        user_id = int(payload['sub'])
        current_user = db.session.get(User, user_id) if hasattr(db.session, 'get') else User.query.get(user_id)
        if not current_user:
            return {'success': False, 'error': {'code': 'USER_NOT_FOUND', 'message': 'User associated with token not found'}}, 401
            
        request.current_user = current_user
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    """Decorator to restrict access to ADMIN role users."""
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'ADMIN':
            return {'success': False, 'error': {'code': 'FORBIDDEN', 'message': 'Admin access required'}}, 403
        return f(current_user, *args, **kwargs)
    return decorated
