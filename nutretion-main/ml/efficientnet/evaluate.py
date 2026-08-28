import argparse

def evaluate_efficientnet(model_path, data_dir):
    try:
        import tensorflow as tf
        model = tf.keras.models.load_model(model_path)
        print(f"[EfficientNetB0 Evaluate] Model loaded from {model_path}. Ready for evaluation.")
    except Exception as e:
        print(f"[EfficientNetB0 Evaluate] Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=str, default="../models/efficientnet/best.h5")
    parser.add_argument("--data_dir", type=str, default="../dataset/images/test")
    args = parser.parse_args()
    evaluate_efficientnet(args.model, args.data_dir)
