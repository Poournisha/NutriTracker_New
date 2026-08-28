from flask import Blueprint
from app.ml.model_manager import model_manager
from app.utils.responses import success_response

system_bp = Blueprint('system', __name__, url_prefix='/api')

@system_bp.route('/system/model-status', methods=['GET'])
def model_status():
    status = model_manager.get_status()
    return success_response(data=status, message="ML model status retrieved")

@system_bp.route('/health', methods=['GET'])
def health():
    return success_response(data={"status": "healthy", "service": "NutriMeasure AI Backend"}, message="Service operational")
