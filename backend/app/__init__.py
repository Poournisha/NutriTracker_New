import os
from flask import Flask, send_from_directory

from app.config import Config
from app.extensions import db, cors
from app.ml.model_manager import model_manager


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # ---------------------------------------------------------
    # Initialize database
    # ---------------------------------------------------------
    db.init_app(app)

    # ---------------------------------------------------------
    # CORS CONFIGURATION
    # Allow the deployed Vercel frontend to access Flask API
    # ---------------------------------------------------------
    cors.init_app(
        app,
        resources={
            r"/*": {
                "origins": app.config["CORS_ORIGINS"]
            }
        },
        supports_credentials=True
    )

    # ---------------------------------------------------------
    # Initialize ML Model Manager
    # ---------------------------------------------------------
    with app.app_context():
        model_manager.init_app(app)

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

    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(food_bp)
    app.register_blueprint(meals_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(recommendations_bp)
    app.register_blueprint(chatbot_bp)
    app.register_blueprint(system_bp)
    app.register_blueprint(admin_bp)

    # ---------------------------------------------------------
    # IMPORT DATABASE MODELS
    # This ensures SQLAlchemy knows about the models before
    # db.create_all() is executed.
    # ---------------------------------------------------------
    from app.models.user import User
    from app.models.meal import Meal
    from app.models.nutrition_target import NutritionTarget
    from app.models.recommendation import Recommendation

    # ---------------------------------------------------------
    # CREATE DATABASE TABLES
    # ---------------------------------------------------------
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables initialized successfully.")
        except Exception as e:
            print("❌ Database initialization failed:")
            print(e)

    # ---------------------------------------------------------
    # Serve static uploaded files
    # ---------------------------------------------------------
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(
            app.config['UPLOAD_FOLDER'],
            filename
        )

    # ---------------------------------------------------------
    # Global 404 error handler
    # ---------------------------------------------------------
    @app.errorhandler(404)
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
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()

        return {
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Internal server error occurred."
            }
        }, 500

    return app
