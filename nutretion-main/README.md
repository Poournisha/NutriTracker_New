# NUTRIMEASURE AI — Intelligent Food Recognition & Personalized Nutrition Assessment System

![NutriMeasure AI Banner](https://img.shields.io/badge/NutriMeasure%20AI-Full%20Stack%20v1.0.0-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Flask%20%7C%20YOLOv8%20%7C%20EfficientNet-blue)

NutriMeasure AI is an intelligent full-stack nutrition assessment platform designed primarily for hostel students and individuals tracking health goals. It combines computer vision (YOLOv8 + EfficientNetB0), portion estimation, personalized dietary target calculation, deficiency detection, food recommendations, weekly trend reporting, and a context-aware AI chatbot.

---

## Key Features

1. **User Auth & Nutrition Profile**: User registration, JWT auth, age, weight, height, activity level, workout type, and fitness goal tracking.
2. **BMI & Target Calculation**: Automatic BMI categorization and personalized target macro/micronutrient calculation (Calories, Protein, Carbs, Fat, Iron, Calcium).
3. **AI Food Recognition & Portion Estimation**: OpenCV image quality checks (blur/exposure), YOLOv8 multi-food detection, EfficientNetB0 visual classification, and area-ratio portion estimation.
4. **Interactive Meal Review & Logging**: Bounding box overlays, editable portion sizes/foods before saving.
5. **Daily Dashboard**: Real-time intake vs target progress bars, BMI stats, deficiency warnings, and food recommendations.
6. **Deficiency Engine & Smart Recommendations**: Rule-based detection of intake gaps and database-backed hostel menu suggestions.
7. **Weekly Analytics**: 7-day nutrient trend charts (Recharts) and nutrient balance summaries.
8. **Contextual AI Chatbot**: Provider abstraction supporting OpenAI API or deterministic Demo mode with full user profile context injection.
9. **Admin Portal**: Manage hostel reference food items and view user logs.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios, React Router v6.
- **Backend**: Python 3.10+, Flask, Flask REST API, Flask-SQLAlchemy, Flask-CORS, PyJWT, Bcrypt, OpenCV, NumPy, Pillow, PyTest.
- **Database**: SQLite (SQLAlchemy ORM configured for zero setup; easily points to PostgreSQL via `DATABASE_URL`).
- **Machine Learning**: YOLOv8 (Ultralytics), EfficientNetB0 (TensorFlow/Keras), OpenCV Image Quality Verification.

---

## Quick Setup & Execution Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- Git

---

### Backend Setup

1. Open terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Initialize and seed the SQLite database (seeds 20+ hostel food items & demo admin):
   ```bash
   python -m app.seed.seed_database
   ```

6. Start the Flask Backend server (runs on `http://localhost:5000`):
   ```bash
   python run.py
   ```

---

### Frontend Setup

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install npm packages:
   ```bash
   npm install
   ```

3. Start Vite development server (runs on `http://localhost:5173`):
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to: `http://localhost:5173`

---

## Demo Credentials

- **Default User**: Register any new account on the UI, or use:
- **Default Admin Account**:
  - **Email**: `admin@nutrimeasure.ai`
  - **Password**: `AdminPass123!`

---

## Running Tests

Run backend unit & integration tests:
```bash
cd backend
pytest
```

---

## Environment Variables Configuration (`.env`)

| Variable | Default Value | Description |
|---|---|---|
| `FLASK_APP` | `run.py` | Entrypoint script |
| `PORT` | `5000` | Backend API port |
| `DATABASE_URL` | `sqlite:///app.db` | Database connection URI |
| `DEMO_MODE` | `true` | Enables deterministic predictions when ML weights are missing |
| `CHATBOT_DEMO_MODE` | `true` | Enables local rule-based chatbot when LLM key is absent |
| `OPENAI_API_KEY` | `""` | Optional OpenAI key for live AI assistant |

---

## Disclaimer
*NutriMeasure AI provides estimated nutritional information based on image recognition, estimated portions, and reference nutrition data. Results may vary depending on food preparation, ingredients, serving size, image quality, and model accuracy. This application is for informational purposes and is not a substitute for professional medical or dietary advice.*
