from app.ml.detector import FoodDetector
from app.ml.classifier import FoodClassifier

class ModelManager:
    _instance = None

    def __new__(cls, app=None):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def init_app(self, app):
        if self.initialized:
            return

        yolo_path = app.config.get('YOLO_MODEL_PATH')
        eff_path = app.config.get('EFFICIENTNET_MODEL_PATH')
        demo_mode = app.config.get('DEMO_MODE', True)

        self.detector = FoodDetector(model_path=yolo_path, demo_mode=demo_mode)
        self.classifier = FoodClassifier(model_path=eff_path, demo_mode=demo_mode)
        self.demo_mode = demo_mode
        self.initialized = True
        print(f"[ModelManager] ML models initialized (Demo Mode: {demo_mode})")

    def get_status(self):
        detector_status = "loaded" if (hasattr(self, 'detector') and self.detector.is_loaded) else ("demo" if self.demo_mode else "unavailable")
        classifier_status = "loaded" if (hasattr(self, 'classifier') and self.classifier.is_loaded) else ("demo" if self.demo_mode else "unavailable")
        
        return {
            "yolov8": detector_status,
            "efficientnet": classifier_status,
            "demo_mode": self.demo_mode
        }

model_manager = ModelManager()
