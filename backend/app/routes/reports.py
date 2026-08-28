from flask import Blueprint
from app.utils.security import token_required
from app.utils.responses import success_response
from app.services.report_service import generate_weekly_report

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@reports_bp.route('/weekly', methods=['GET'])
@token_required
def get_weekly_report(current_user):
    report_data = generate_weekly_report(current_user.id)
    return success_response(data=report_data, message="Weekly report generated successfully")
