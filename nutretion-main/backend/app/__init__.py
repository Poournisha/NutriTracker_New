import os
from flask import Flask, send_from_directory
from app.config import Config
from app.extensions import db, cors
from app.ml.model_manager import model_manager

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    # Initialize ML Model Manager
    with app.app_context():
        model_manager.init_app(app)

    # Register blueprints
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

    # Serve static uploaded files
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    # Global error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return {"success": False, "error": {"code": "NOT_FOUND", "message": "Requested endpoint not found."}}, 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {"success": False, "error": {"code": "INTERNAL_SERVER_ERROR", "message": "An internal server error occurred."}}, 500

    return app
