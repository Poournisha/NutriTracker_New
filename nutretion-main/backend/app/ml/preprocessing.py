import cv2
import numpy as np
from typing import Dict, Any, Tuple

def validate_image_quality(image_bytes: bytes) -> Tuple[bool, Dict[str, Any]]:
    """
    Validates image quality using OpenCV:
    - Minimum resolution (200x200)
    - Brightness evaluation (grayscale mean between 40 and 220)
    - Blur evaluation (Laplacian variance > 40.0)
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return False, {
                "code": "IMAGE_CORRUPT",
                "message": "Unable to decode uploaded image file."
            }

        height, width = img.shape[:2]
        if height < 200 or width < 200:
            return False, {
                "code": "IMAGE_RESOLUTION_LOW",
                "message": f"Image resolution ({width}x{height}) is too small. Minimum resolution required is 200x200 pixels."
            }

        # Convert to Grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Brightness check
        mean_brightness = np.mean(gray)
        if mean_brightness < 35:
            return False, {
                "code": "IMAGE_TOO_DARK",
                "message": "Image is too dark. Please take a photo with better lighting."
            }
        elif mean_brightness > 235:
            return False, {
                "code": "IMAGE_TOO_BRIGHT",
                "message": "Image is overexposed/too bright. Please retake the photo without direct flash."
            }

        # Blur check using Laplacian variance
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        if laplacian_var < 35.0:
            return False, {
                "code": "IMAGE_BLURRY",
                "message": f"Image is too blurry (blur metric: {round(laplacian_var, 1)}). Please hold your camera steady."
            }

        return True, {
            "width": width,
            "height": height,
            "brightness": round(float(mean_brightness), 1),
            "blur_metric": round(float(laplacian_var), 1)
        }

    except Exception as e:
        return False, {
            "code": "IMAGE_PROCESSING_ERROR",
            "message": f"Error validating image quality: {str(e)}"
        }
