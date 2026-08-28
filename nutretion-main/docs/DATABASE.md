# NutriMeasure AI — Database Schema & Documentation

NutriMeasure AI uses SQLAlchemy ORM backed by SQLite for zero-config local development, easily migrating to PostgreSQL by modifying `DATABASE_URL`.

---

## Entity Relationship Diagram (Conceptual)

```text
+---------------+       1:1      +--------------------+
|     users     |----------------|  nutrition_targets |
+---------------+                +--------------------+
        | 1
        |
        | N
+---------------+       1:N      +--------------------+
|     meals     |----------------|     meal_items     |
+---------------+                +--------------------+
                                           | N
                                           |
                                           | 1
                                 +--------------------+
                                 |     food_items     |
                                 +--------------------+

+---------------+       1:N      +--------------------+
|     users     |----------------|   recommendations  |
+---------------+                +--------------------+
```

---

## Table Schemas

### 1. `users`
* `id` (INTEGER, PK, Autoincrement)
* `name` (VARCHAR(100), NOT NULL)
* `email` (VARCHAR(120), UNIQUE, NOT NULL, Index)
* `password_hash` (VARCHAR(255), NOT NULL)
* `role` (VARCHAR(20), DEFAULT 'USER')
* `age` (INTEGER, NULLABLE)
* `gender` (VARCHAR(20), NULLABLE)
* `height` (FLOAT, NULLABLE) — in cm
* `weight` (FLOAT, NULLABLE) — in kg
* `activity_level` (VARCHAR(50), NULLABLE) — 'Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'
* `workout_type` (VARCHAR(50), NULLABLE) — 'None', 'Walking', 'Running', 'Gym', 'Sports', 'Other'
* `fitness_goal` (VARCHAR(50), NULLABLE) — 'Weight Loss', 'Weight Maintenance', 'Muscle Building', 'General Health'
* `created_at` (DATETIME, DEFAULT utcnow)
* `updated_at` (DATETIME, DEFAULT utcnow)

### 2. `food_items`
* `id` (INTEGER, PK, Autoincrement)
* `food_name` (VARCHAR(100), UNIQUE, NOT NULL, Index)
* `category` (VARCHAR(50), NOT NULL)
* `calories_per_100g` (FLOAT, NOT NULL)
* `protein_per_100g` (FLOAT, NOT NULL)
* `carbs_per_100g` (FLOAT, NOT NULL)
* `fat_per_100g` (FLOAT, NOT NULL)
* `iron_per_100g` (FLOAT, NOT NULL)
* `calcium_per_100g` (FLOAT, NOT NULL)
* `created_at` (DATETIME, DEFAULT utcnow)

### 3. `meals`
* `id` (INTEGER, PK, Autoincrement)
* `user_id` (INTEGER, FK -> users.id, Index)
* `image_path` (VARCHAR(255), NULLABLE)
* `meal_type` (VARCHAR(50), NOT NULL) — 'Breakfast', 'Lunch', 'Snack', 'Dinner'
* `meal_date` (DATE, NOT NULL, Index)
* `meal_time` (TIME, NOT NULL)
* `total_calories` (FLOAT, NOT NULL)
* `total_protein` (FLOAT, NOT NULL)
* `total_carbs` (FLOAT, NOT NULL)
* `total_fat` (FLOAT, NOT NULL)
* `total_iron` (FLOAT, NOT NULL)
* `total_calcium` (FLOAT, NOT NULL)
* `created_at` (DATETIME, DEFAULT utcnow)

### 4. `meal_items`
* `id` (INTEGER, PK, Autoincrement)
* `meal_id` (INTEGER, FK -> meals.id, Index)
* `food_id` (INTEGER, FK -> food_items.id, Index)
* `confidence` (FLOAT, NOT NULL)
* `estimated_grams` (FLOAT, NOT NULL)
* `portion_category` (VARCHAR(30), NOT NULL) — 'Small', 'Medium', 'Large', 'Very Large'
* `calories` (FLOAT, NOT NULL)
* `protein` (FLOAT, NOT NULL)
* `carbs` (FLOAT, NOT NULL)
* `fat` (FLOAT, NOT NULL)
* `iron` (FLOAT, NOT NULL)
* `calcium` (FLOAT, NOT NULL)

### 5. `nutrition_targets`
* `id` (INTEGER, PK, Autoincrement)
* `user_id` (INTEGER, FK -> users.id, Index)
* `calorie_target` (FLOAT, NOT NULL)
* `protein_target` (FLOAT, NOT NULL)
* `carbs_target` (FLOAT, NOT NULL)
* `fat_target` (FLOAT, NOT NULL)
* `iron_target` (FLOAT, NOT NULL)
* `calcium_target` (FLOAT, NOT NULL)
* `calculated_at` (DATETIME, DEFAULT utcnow)

### 6. `recommendations`
* `id` (INTEGER, PK, Autoincrement)
* `user_id` (INTEGER, FK -> users.id, Index)
* `nutrient` (VARCHAR(50), NOT NULL)
* `severity` (VARCHAR(20), NOT NULL) — 'LOW', 'MEDIUM', 'HIGH'
* `message` (TEXT, NOT NULL)
* `suggested_foods` (TEXT, NOT NULL) — JSON array or comma separated list
* `created_at` (DATETIME, DEFAULT utcnow)
