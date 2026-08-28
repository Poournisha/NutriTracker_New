import argparse

def predict_efficientnet(model_path, image_path):
    try:
        import tensorflow as tf
        import cv2
        import numpy as np

        model = tf.keras.models.load_model(model_path)
        img = cv2.imread(image_path)
        img_resized = cv2.resize(img, (224, 224))
        img_array = np.expand_dims(img_resized, axis=0) / 255.0

        preds = model.predict(img_array)
        top_idx = np.argmax(preds[0])
        conf = preds[0][top_idx]
        print(f"[EfficientNetB0 Predict] Predicted class index {top_idx} with confidence {round(float(conf)*100, 2)}%")
    except Exception as e:
        print(f"[EfficientNetB0 Predict] Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=str, default="../models/efficientnet/best.h5")
    parser.add_argument("--image", type=str, required=True)
    args = parser.parse_args()
    predict_efficientnet(args.model, args.image)
