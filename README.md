# 🥗 NutriMeasure AI

### Intelligent Food Recognition & Personalized Nutrition Assessment System

NutriMeasure AI is an AI-powered full-stack web application that analyzes food images, identifies food items, estimates portions, calculates nutritional intake, and provides personalized dietary recommendations.

The system is designed especially for **hostel students and individuals who want to monitor their daily nutrition and fitness goals**.

---

## 🚀 Features

### 👤 User Authentication & Profile

* User registration and login
* JWT-based authentication
* Age, height, weight and activity tracking
* Workout type selection
* Fitness goal management

### ⚖️ BMI & Nutrition Target Calculation

* Automatic BMI calculation
* BMI category identification
* Personalized calorie targets
* Protein, carbohydrate and fat targets
* Iron and calcium requirements
* Goal-based nutrition recommendations

### 📷 AI Food Recognition

* Upload food images
* Image quality verification using OpenCV
* Multi-food detection using YOLOv8
* Food classification using EfficientNetB0
* Automatic portion estimation
* Nutritional value estimation

### 🍱 Meal Review & Logging

* View detected food items
* Bounding box visualization
* Edit detected food names
* Modify portion sizes
* Review predictions before saving
* Store meals in the nutrition history

### 📊 Daily Nutrition Dashboard

* Daily calorie tracking
* Protein tracking
* Carbohydrate tracking
* Fat tracking
* Iron tracking
* Calcium tracking
* Target vs actual progress
* BMI information
* Nutrient deficiency alerts
* Personalized food recommendations

### 🚨 Nutrient Deficiency Detection

The system compares the user's daily nutrient intake with their calculated requirements.

It can identify insufficient intake of:

* Protein
* Iron
* Calcium
* Calories
* Other tracked nutrients

The system provides food recommendations based on the detected nutritional gaps.

### 🍎 Smart Food Recommendations

Recommendations are generated using:

* User profile
* Fitness goal
* Nutritional requirements
* Current food intake
* Nutrient deficiencies
* Hostel food reference database

### 📈 Weekly Analytics

The application provides 7-day nutrition trends using interactive charts.

Analytics include:

* Calorie trends
* Protein trends
* Carbohydrate trends
* Fat trends
* Iron trends
* Calcium trends
* Nutritional balance summaries

### 🤖 AI Nutrition Assistant

NutriMeasure AI includes a context-aware chatbot that can provide nutrition-related responses using the user's profile and nutrition information.

The chatbot supports:

* Demo mode with a deterministic local assistant
* OpenAI API integration
* User profile context
* Nutrition-related queries
* Personalized responses

### 🛠️ Admin Portal

Administrators can:

* Manage hostel food items
* Maintain nutritional information
* View user meal records
* Manage reference food data

---

# 🧠 System Workflow

```text
                FOOD IMAGE
                    │
                    ▼
          ┌──────────────────┐
          │ Image Validation  │
          │     OpenCV        │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │     YOLOv8       │
          │ Food Detection   │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │  EfficientNetB0  │
          │ Classification   │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Portion Estimate │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Nutrition Engine │
          └────────┬─────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
     Daily      Deficiency  Recommendations
   Dashboard     Analysis
        │
        ▼
  Weekly Analytics
        │
        ▼
  AI Nutrition Assistant
```

---

# 🛠️ Technology Stack

## Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* React Router v6
* Axios
* Recharts
* Lucide Icons

## Backend

* Python 3.10+
* Flask
* Flask REST API
* Flask-SQLAlchemy
* Flask-CORS
* PyJWT
* Bcrypt
* OpenCV
* NumPy
* Pillow
* PyTest

## Machine Learning

* YOLOv8
* Ultralytics
* EfficientNetB0
* TensorFlow
* Keras
* OpenCV

## Database

* SQLite
* SQLAlchemy ORM
* PostgreSQL-ready architecture

---

# 📁 Project Structure

```text
NutriMeasure-AI/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── seed/
│   │   └── ...
│   │
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.*
│
└── README.md
```

---

# ⚙️ Installation

## Prerequisites

Make sure you have installed:

* Python 3.10+
* Node.js 18+
* npm
* Git

---

# 🔧 Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

Create a Python virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the environment file:

### Windows

```bash
copy .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

Initialize the database:

```bash
python -m app.seed.seed_database
```

Start the Flask server:

```bash
python run.py
```

Backend:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

---

# 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
FLASK_APP=run.py
PORT=5000
DATABASE_URL=sqlite:///app.db
DEMO_MODE=true
CHATBOT_DEMO_MODE=true
OPENAI_API_KEY=
```

### Environment Variable Description

| Variable            | Default            | Description                     |
| ------------------- | ------------------ | ------------------------------- |
| `FLASK_APP`         | `run.py`           | Flask application entry point   |
| `PORT`              | `5000`             | Backend server port             |
| `DATABASE_URL`      | `sqlite:///app.db` | Database connection             |
| `DEMO_MODE`         | `true`             | Enables fallback AI predictions |
| `CHATBOT_DEMO_MODE` | `true`             | Enables local chatbot           |
| `OPENAI_API_KEY`    | Empty              | Optional OpenAI API key         |

> **Important:** Never upload your actual API keys or passwords to GitHub.

---

# 👨‍💻 Demo Credentials

### Admin Account

```text
Email: admin@nutrimeasure.ai
Password: AdminPass123!
```

Users can also create a new account through the registration page.

> For production deployment, replace demo credentials with secure credentials.

---

# 🧪 Running Tests

To run backend tests:

```bash
cd backend
pytest
```

---

# 🔄 Application Flow

```text
Register / Login
       ↓
Create Nutrition Profile
       ↓
Calculate BMI & Nutrition Targets
       ↓
Upload Food Image
       ↓
Image Quality Check
       ↓
Food Detection
       ↓
Food Classification
       ↓
Portion Estimation
       ↓
Review & Edit Meal
       ↓
Save Meal
       ↓
Update Daily Nutrition
       ↓
Detect Nutrient Gaps
       ↓
Generate Recommendations
       ↓
View Weekly Analytics
       ↓
Interact with AI Assistant
```

---

# 🌟 Key Advantages

* AI-powered food recognition
* Multi-food detection
* Image-based meal analysis
* Portion estimation
* Personalized nutrition targets
* BMI-based recommendations
* Daily nutrition monitoring
* Nutrient deficiency detection
* Smart food recommendations
* Weekly nutrition analytics
* Context-aware AI chatbot
* Hostel food reference database
* Admin management portal
* SQLite for easy setup
* PostgreSQL-ready architecture

---

# 🔮 Future Enhancements

Future versions of NutriMeasure AI can include:

* Improved portion estimation
* Support for more Indian and regional foods
* Better recognition of mixed dishes
* Barcode-based food tracking
* Voice-based meal logging
* Android/iOS mobile application
* Cloud-based ML inference
* PostgreSQL production deployment
* Personalized weekly meal plans
* Nutritionist dashboard
* Explainable AI predictions
* Wearable device integration
* Continuous model improvement from corrected predictions

---

# ⚠️ Disclaimer

NutriMeasure AI provides estimated nutritional information based on food image recognition, estimated portions, and reference nutrition data.

Actual nutritional values may vary depending on:

* Ingredients
* Cooking methods
* Food preparation
* Serving size
* Image quality
* Food appearance
* Model accuracy

This project is intended for **educational and informational purposes only** and should not replace professional medical or dietary advice.

---

# 📜 License

This project can be distributed under the MIT License.

```text
MIT License
```

---

# 👩‍💻 Project Information

**Project Name:** NutriMeasure AI

**Category:** Artificial Intelligence / Machine Learning / Full-Stack Development

**Primary Technologies:**

```text
React
TypeScript
Flask
Python
YOLOv8
EfficientNetB0
TensorFlow
OpenCV
SQLite
SQLAlchemy
```

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
