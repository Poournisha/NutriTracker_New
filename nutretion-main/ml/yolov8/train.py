import argparse
import os

def train_yolo(data_yaml, epochs, batch_size, imgsz, model_name):
    try:
        from ultralytics import YOLO
        model = YOLO(f"{model_name}.pt")
        print(f"[YOLOv8 Training] Starting training on {data_yaml} for {epochs} epochs...")
        results = model.train(
            data=data_yaml,
            epochs=epochs,
            batch=batch_size,
            imgsz=imgsz,
            project="../models/yolov8",
            name="train_run"
        )
        print("[YOLOv8 Training] Completed successfully. Saved best weights to ../models/yolov8/train_run/weights/best.pt")
    except ImportError:
        print("[YOLOv8 Training] Error: 'ultralytics' package not installed. Install via 'pip install ultralytics'")
    except Exception as e:
        print(f"[YOLOv8 Training] Training failed: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train YOLOv8 Food Detector")
    parser.add_argument("--data", type=str, default="data.yaml", help="Path to data.yaml")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs")
    parser.add_argument("--batch", type=int, default=16, help="Batch size")
    parser.add_argument("--imgsz", type=int, default=640, help="Image size")
    parser.add_argument("--model", type=str, default="yolov8n", help="Base model size (yolov8n, yolov8s, yolov8m)")
    args = parser.parse_args()

    train_yolo(args.data, args.epochs, args.batch, args.imgsz, args.model)
