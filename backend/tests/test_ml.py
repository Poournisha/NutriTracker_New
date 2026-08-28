import cv2
import numpy as np
from app.ml.preprocessing import validate_image_quality
from app.ml.detector import FoodDetector
from app.ml.classifier import FoodClassifier
from app.services.portion_service import estimate_portion

def test_opencv_preprocessing_blur_and_size():
    # Create artificial 300x300 sharp image
    img = np.zeros((300, 300, 3), dtype=np.uint8)
    cv2.rectangle(img, (50, 50), (250, 250), (255, 255, 255), -1)
    _, buffer = cv2.imencode('.jpg', img)
    image_bytes = buffer.tobytes()

    is_valid, info = validate_image_quality(image_bytes)
    assert is_valid is True
    assert info['width'] == 300
    assert info['height'] == 300

def test_yolo_detector_demo_fallback():
    detector = FoodDetector(demo_mode=True)
    detections = detector.detect(b"fake_image_bytes_for_testing")
    assert len(detections) > 0
    assert 'food' in detections[0]
    assert 'confidence' in detections[0]

def test_portion_estimation():
    portion = estimate_portion(0.30, "dosa")
    assert portion['portion_category'] == "Medium"
    assert portion['estimated_grams'] > 0
