from flask import Flask, send_from_directory

from app.config import Config
from app.extensions import db, cors
from app.ml.model_manager import model_manager


def create_app(config_class=Config):
    flask_app = Flask(__name__)
    flask_app.config.from_object(config_class)

    # ---------------------------------------------------------
    # Initialize extensions
    # ---------------------------------------------------------
    db.init_app(flask_app)

    cors.init_app(
        flask_app,
        resources={
            r"/api/*": {
                "origins": flask_app.config['CORS_ORIGINS']
            }
        },
        supports_credentials=True
    )

    # ---------------------------------------------------------
    # Initialize ML Model Manager
    # ---------------------------------------------------------
    with flask_app.app_context():
        model_manager.init_app(flask_app)

    # ---------------------------------------------------------
    # Register blueprints
    # ---------------------------------------------------------
    from app.routes.auth import auth_bp
    from app.routes.profile import profile_bp
    from app.routes.food import food_bp
    from app.routes.meals import meals_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.reports import reports_bp
    from app.routes.recommendations import recommendations_bp
    from app.routes.chatbot import chatbot_bp
    from app.routes.system import system_bp
    from app.routes.admin import admin_bp

    flask_app.register_blueprint(auth_bp)
    flask_app.register_blueprint(profile_bp)
    flask_app.register_blueprint(food_bp)
    flask_app.register_blueprint(meals_bp)
    flask_app.register_blueprint(dashboard_bp)
    flask_app.register_blueprint(reports_bp)
    flask_app.register_blueprint(recommendations_bp)
    flask_app.register_blueprint(chatbot_bp)
    flask_app.register_blueprint(system_bp)
    flask_app.register_blueprint(admin_bp)

    # ---------------------------------------------------------
    # LOAD ALL DATABASE MODELS
    # ---------------------------------------------------------
    from app.models.user import User
    from app.models.food import FoodItem
    from app.models.meal import Meal
    from app.models.meal_item import MealItem
    from app.models.nutrition_target import NutritionTarget
    from app.models.recommendation import Recommendation

    # ---------------------------------------------------------
    # CREATE SQLITE DATABASE TABLES
    # ---------------------------------------------------------
    with flask_app.app_context():
        try:
            db.create_all()

            print("========================================")
            print("✅ DATABASE TABLES INITIALIZED")
            print("========================================")

        except Exception as e:
            print("========================================")
            print("❌ DATABASE INITIALIZATION FAILED")
            print(f"Error: {e}")
            print("========================================")

    # ---------------------------------------------------------
    # Serve uploaded files
    # ---------------------------------------------------------
    @flask_app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(
            flask_app.config['UPLOAD_FOLDER'],
            filename
        )

    # ---------------------------------------------------------
    # Global 404 error handler
    # ---------------------------------------------------------
    @flask_app.errorhandler(404)
    def not_found_error(error):
        return {
            "success": False,
            "error": {
                "code": "NOT_FOUND",
                "message": "Requested endpoint not found."
            }
        }, 404

    # ---------------------------------------------------------
    # Global 500 error handler
    # ---------------------------------------------------------
    @flask_app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()

        return {
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An internal server error occurred."
            }
        }, 500

    return flask_app
