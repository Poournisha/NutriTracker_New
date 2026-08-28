# NutriMeasure AI — Machine Learning Pipeline & Integration Guide

The ML pipeline processes food images through OpenCV validation, YOLOv8 object detection, EfficientNetB0 classification, and geometric portion size estimation.

---

## Complete Processing Pipeline Flow

```text
UPLOAD IMAGE
     │
     ▼
[OpenCV Image Validation] ─── Fail? ──► Return IMAGE_QUALITY_LOW
     │
     ▼ (Brightness, Blur/Laplacian Variance, Min Resolution)
[YOLOv8 Detection] ──► Bounding Boxes + Initial Labels + Confidence Scores
     │
     ▼ (Low Confidence Threshold / Visually Similar Crops)
[EfficientNetB0 Classifier] ──► Refined Class Predictions
     │
     ▼
[Portion Estimator] ──────────► Bounding Box Area Ratio vs Reference Plate
     │                           Outputs: estimated_grams & portion_category
     ▼
[Nutrition Calculation] ──────► Database lookup per 100g -> Total Calories, Protein, Carbs, Fat, Iron, Calcium
```

---

## 1. Image Quality Verification (`preprocessing.py`)
- **Blur Detection**: Calculates Laplacian variance. Variance < 50 indicates a blurry image.
- **Brightness Check**: Converts RGB image to grayscale and measures mean brightness. Brightness < 40 is underexposed; > 220 is overexposed.
- **Min Resolution**: Requires minimum 200x200 pixels.

## 2. YOLOv8 Object Detection (`detector.py`)
- **Model Architecture**: Ultralytics YOLOv8 (yolov8n / yolov8s fine-tuned on food dataset).
- **Output**: Multi-object bounding boxes `[x1, y1, x2, y2]`, detected food labels, confidence score (0.0 to 1.0).

## 3. EfficientNetB0 Fine Classification (`classifier.py`)
- **Model Architecture**: Transfer learning on TensorFlow / Keras EfficientNetB0.
- **Use Case**: Used for visually ambiguous or visually similar dishes (e.g. Rice variants: Lemon Rice vs Curd Rice vs Tomato Rice; Curry variants: Sambar vs Rasam vs Dal).

## 4. Portion Estimation (`portion_service.py`)
- Estimates food volume/weight by comparing food bounding box area to detected plate bounding box area or total image dimensions.
- Map ratio to standard serving categories:
  - **Small** (ratio < 0.15): ~75g - 100g
  - **Medium** (0.15 <= ratio < 0.35): ~120g - 200g
  - **Large** (0.35 <= ratio < 0.55): ~250g - 350g
  - **Very Large** (ratio >= 0.55): ~400g+

## 5. Model Training Instructions

### Training YOLOv8
```bash
python ml/yolov8/train.py --data ml/yolov8/data.yaml --epochs 50 --imgsz 640
```
Outputs model checkpoint to `ml/models/yolov8/best.pt`. Copy to `backend/app/ml/weights/yolov8_food.pt`.

### Training EfficientNetB0
```bash
python ml/efficientnet/train.py --data_dir ml/dataset/images --epochs 30 --batch_size 32
```
Outputs model checkpoint to `ml/models/efficientnet/best.h5`. Copy to `backend/app/ml/weights/efficientnet_food.h5`.

---

## 6. Demo Mode Fallback (`DEMO_MODE=true`)
When model weights are missing or `DEMO_MODE=true` is set in `.env`, `model_manager.py` switches into deterministic mock inference mode using color-histogram / feature extraction hints or sample prediction profiles. The frontend UI explicitly displays a **"Demo AI Mode"** status banner.
