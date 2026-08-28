import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'nutrimeasure-dev-secret-key-2026')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'nutrimeasure-jwt-secret-key-2026')
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 86400)) # 24 hours
    
    # SQLAlchemy configuration
    db_url = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    if db_url.startswith("sqlite:///") and not db_url.startswith("sqlite:////"):
        # Make relative SQLite path absolute to backend directory
        db_path = db_url.replace("sqlite:///", "")
        db_url = f"sqlite:///{os.path.join(basedir, db_path)}"
    
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload folder
    UPLOAD_FOLDER = os.path.join(basedir, os.environ.get('UPLOAD_FOLDER', 'uploads'))
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
    
    # AI / ML Demo mode options
    DEMO_MODE = os.environ.get('DEMO_MODE', 'true').lower() == 'true'
    CHATBOT_DEMO_MODE = os.environ.get('CHATBOT_DEMO_MODE', 'true').lower() == 'true'
    
    # Model File Paths
    YOLO_MODEL_PATH = os.environ.get('YOLO_MODEL_PATH', os.path.join(basedir, 'app', 'ml', 'weights', 'yolov8_food.pt'))
    EFFICIENTNET_MODEL_PATH = os.environ.get('EFFICIENTNET_MODEL_PATH', os.path.join(basedir, 'app', 'ml', 'weights', 'efficientnet_food.h5'))
    
    # OpenAI Chatbot Integration
    LLM_PROVIDER = os.environ.get('LLM_PROVIDER', 'openai')
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
    LLM_MODEL = os.environ.get('LLM_MODEL', 'gpt-3.5-turbo')
    
    # CORS
    CORS_ORIGINS = [origin.strip() for origin in os.environ.get('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')]
