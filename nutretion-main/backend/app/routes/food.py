import os
import uuid
from flask import Blueprint, request, current_app
from app.models.food import FoodItem
from app.utils.security import token_required
from app.utils.validators import allowed_file
from app.utils.responses import success_response, error_response
from app.services.food_analysis_service import analyze_food_image

food_bp = Blueprint('food', __name__, url_prefix='/api/food')

@food_bp.route('/list', methods=['GET'])
def get_food_list():
    query = request.args.get('search', '').strip()
    if query:
        items = FoodItem.query.filter(FoodItem.food_name.ilike(f"%{query}%")).all()
    else:
        items = FoodItem.query.order_by(FoodItem.food_name.asc()).all()
    
    return success_response(data={"foods": [i.to_dict() for i in items]}, message="Food items retrieved")

@food_bp.route('/analyze', methods=['POST'])
@token_required
def analyze_food(current_user):
    if 'image' not in request.files:
        return error_response(code="MISSING_FILE", message="No image file provided in multipart upload.", status_code=400)

    file = request.files['image']
    if file.filename == '':
        return error_response(code="NO_FILE_SELECTED", message="No file selected.", status_code=400)

    if not allowed_file(file.filename, current_app.config['ALLOWED_EXTENSIONS']):
        return error_response(code="INVALID_FILE_TYPE", message="Unsupported image format. Allowed formats: PNG, JPG, JPEG, WEBP.", status_code=400)

    try:
        image_bytes = file.read()
        
        # Check size limit
        if len(image_bytes) > current_app.config['MAX_CONTENT_LENGTH']:
            return error_response(code="FILE_TOO_LARGE", message="Image file exceeds max limit of 16MB.", status_code=400)

        # Save uploaded file to disk
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        filename = f"{uuid.uuid4().hex}_{file.filename}"
        filepath = os.path.join(upload_folder, filename)
        
        with open(filepath, 'wb') as f:
            f.write(image_bytes)

        # Execute Food Analysis Pipeline
        result = analyze_food_image(image_bytes)

        if not result["success"]:
            return error_response(code=result["error"]["code"], message=result["error"]["message"], status_code=400)

        data = result["data"]
        data["image_path"] = f"uploads/{filename}"

        return success_response(data=data, message="Food image analyzed successfully")

    except Exception as e:
        return error_response(code="ANALYSIS_FAILED", message=f"Failed to process food image: {str(e)}", status_code=500)
