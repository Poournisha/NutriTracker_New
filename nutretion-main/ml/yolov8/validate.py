import argparse

def validate_yolo(weights_path, data_yaml):
    try:
        from ultralytics import YOLO
        model = YOLO(weights_path)
        metrics = model.val(data=data_yaml)
        print(f"[YOLOv8 Validation] mAP50-95: {metrics.box.map}")
    except Exception as e:
        print(f"[YOLOv8 Validation] Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--weights", type=str, default="../models/yolov8/best.pt")
    parser.add_argument("--data", type=str, default="data.yaml")
    args = parser.parse_args()
    validate_yolo(args.weights, args.data)
