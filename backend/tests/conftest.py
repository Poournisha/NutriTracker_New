import pytest
import uuid
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.food import FoodItem

class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SECRET_KEY = 'test-secret-key-must-be-32-bytes-long-for-security'
    JWT_SECRET_KEY = 'test-jwt-secret-key-must-be-32-bytes-long-for-security'
    JWT_ACCESS_TOKEN_EXPIRES = 3600
    DEMO_MODE = True
    CHATBOT_DEMO_MODE = True
    UPLOAD_FOLDER = 'tests/uploads'
    CORS_ORIGINS = ['http://localhost:5173']

@pytest.fixture
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        # Seed reference foods for testing
        foods = [
            FoodItem(food_name="Dosa", category="Breakfast", calories_per_100g=185, protein_per_100g=4.5, carbs_per_100g=29, fat_per_100g=6, iron_per_100g=1.1, calcium_per_100g=25),
            FoodItem(food_name="Sambar", category="Curry", calories_per_100g=75, protein_per_100g=3.8, carbs_per_100g=11, fat_per_100g=2, iron_per_100g=1.2, calcium_per_100g=35),
            FoodItem(food_name="Dal", category="Curry", calories_per_100g=115, protein_per_100g=6.8, carbs_per_100g=18, fat_per_100g=2.5, iron_per_100g=2.1, calcium_per_100g=28)
        ]
        for f in foods:
            db.session.add(f)
        db.session.commit()

        yield app

        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    unique_email = f"user_{uuid.uuid4().hex[:8]}@nutrimeasure.ai"
    res = client.post('/api/auth/register', json={
        'name': 'Test Student',
        'email': unique_email,
        'password': 'Password123!'
    })
    token = res.get_json()['data']['token']
    return {'Authorization': f'Bearer {token}'}
