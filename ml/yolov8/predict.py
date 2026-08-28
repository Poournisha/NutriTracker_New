import argparse

def predict_yolo(weights_path, source_image):
    try:
        from ultralytics import YOLO
        model = YOLO(weights_path)
        results = model.predict(source=source_image, save=True, conf=0.25)
        for r in results:
            print(f"[YOLOv8 Predict] Detected {len(r.boxes)} food item(s) in {source_image}")
    except Exception as e:
        print(f"[YOLOv8 Predict] Inference error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--weights", type=str, default="../models/yolov8/best.pt")
    parser.add_argument("--source", type=str, required=True, help="Image file path or directory")
    args = parser.parse_args()
    predict_yolo(args.weights, args.source)
