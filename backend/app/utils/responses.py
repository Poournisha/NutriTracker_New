from flask import jsonify

def success_response(data=None, message="Operation successful", status_code=200):
    response = {
        "success": True,
        "data": data if data is not None else {},
        "message": message
    }
    return jsonify(response), status_code

def error_response(code="BAD_REQUEST", message="An error occurred", status_code=400):
    response = {
        "success": False,
        "error": {
            "code": code,
            "message": message
        }
    }
    return jsonify(response), status_code
