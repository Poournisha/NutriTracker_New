# NutriMeasure AI — API Documentation

Base URL: `http://localhost:5000/api`

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

---

## Endpoints

### 1. Authentication
* `POST /auth/register` — Register a new user (`name`, `email`, `password`)
* `POST /auth/login` — Login user (`email`, `password`), returns JWT token
* `GET /auth/me` — Get current logged-in user profile (Requires Authorization Header: `Bearer <token>`)

### 2. User Profile & Targets
* `GET /profile` — Retrieve nutrition profile, calculated BMI, and personalized daily targets
* `PUT /profile` — Update user bio/activity metrics (`age`, `gender`, `height`, `weight`, `activity_level`, `workout_type`, `fitness_goal`). Automatically recalculates daily nutrient targets.

### 3. Food Database & Analysis
* `GET /food/list` — Retrieve searchable database of reference hostel foods
* `POST /food/analyze` — Multipart form upload (`image`). Performs OpenCV quality validation, YOLOv8 detection, EfficientNetB0 classification, and portion estimation.

### 4. Meals Management
* `GET /meals` — Query user meal history with date range filtering (`filter`: `today`, `week`, `month`, `all`)
* `GET /meals/:id` — Retrieve detailed breakdown of a specific meal and individual food items
* `POST /meals` — Save an analyzed or manually adjusted meal
* `DELETE /meals/:id` — Delete a meal record

### 5. Daily Dashboard
* `GET /dashboard` — Retrieve today's progress vs daily targets, BMI stats, recent meals, active deficiency warnings, and tailored recommendations.

### 6. Reports & Analytics
* `GET /reports/weekly` — Retrieve 7-day average nutrient metrics, daily trend arrays, top low nutrients, total meals logged, and trend indicators.

### 7. Recommendations & Deficiency Engine
* `GET /recommendations` — Fetch rule-based nutrient deficiency alerts and food suggestions sourced directly from the database based on fitness goals and gaps.

### 8. AI Chatbot
* `POST /chat` — Send prompt (`message`). Injects full user profile, BMI, daily target remaining macros, and deficiency context into LLM (or deterministic demo response).

### 9. System & Admin
* `GET /system/model-status` — Return operational status of YOLOv8, EfficientNetB0, and Chatbot models (`loaded`, `demo`, `unavailable`)
* `GET /health` — API healthcheck
* `GET /admin/users` — Admin view user accounts (Requires `ADMIN` role)
* `POST /admin/foods` — Admin add new food item to reference database
* `PUT /admin/foods/:id` — Admin update food item
* `DELETE /admin/foods/:id` — Admin delete food item
