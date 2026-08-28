import os
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.food import FoodItem
from app.models.nutrition_target import NutritionTarget
from app.models.meal import Meal
from app.models.meal_item import MealItem
from app.utils.security import hash_password
from app.services.nutrition_service import calculate_daily_targets
from datetime import date, timedelta, time

def seed_db():
    app = create_app()
    with app.app_context():
        print("[Seed] Creating database tables if they do not exist...")
        db.create_all()

        # Seed Reference Foods (20 Hostel / Indian Dishes)
        foods_data = [
            # food_name, category, cal, prot, carbs, fat, iron, calc
            ("Rice", "Main", 130.0, 2.7, 28.0, 0.3, 0.2, 10.0),
            ("Curd Rice", "Main", 145.0, 3.5, 22.0, 4.5, 0.3, 110.0),
            ("Lemon Rice", "Main", 165.0, 3.0, 30.0, 4.0, 0.8, 25.0),
            ("Tomato Rice", "Main", 155.0, 2.8, 29.0, 3.5, 0.9, 20.0),
            ("Sambar", "Curry", 75.0, 3.8, 11.0, 2.0, 1.2, 35.0),
            ("Rasam", "Soup", 40.0, 1.2, 6.0, 1.5, 0.8, 15.0),
            ("Dal", "Curry", 115.0, 6.8, 18.0, 2.5, 2.1, 28.0),
            ("Vegetable Curry", "Curry", 90.0, 2.5, 12.0, 3.8, 1.5, 45.0),
            ("Potato Curry", "Curry", 120.0, 2.2, 20.0, 4.2, 0.8, 20.0),
            ("Chapati", "Bread", 260.0, 8.0, 50.0, 3.5, 3.0, 40.0),
            ("Dosa", "Breakfast", 185.0, 4.5, 29.0, 6.0, 1.1, 25.0),
            ("Idli", "Breakfast", 130.0, 4.0, 26.0, 0.5, 0.6, 20.0),
            ("Poori", "Breakfast", 300.0, 5.5, 38.0, 15.0, 2.2, 30.0),
            ("Vada", "Snack", 270.0, 7.5, 25.0, 16.0, 2.0, 35.0),
            ("Curd", "Dairy", 60.0, 3.2, 4.5, 3.3, 0.1, 120.0),
            ("Milk", "Dairy", 65.0, 3.4, 4.8, 3.6, 0.05, 125.0),
            ("Banana", "Fruit", 89.0, 1.1, 23.0, 0.3, 0.3, 5.0),
            ("Apple", "Fruit", 52.0, 0.3, 14.0, 0.2, 0.1, 6.0),
            ("Egg", "Protein", 155.0, 13.0, 1.1, 11.0, 1.8, 50.0),
            ("Chicken", "Protein", 220.0, 24.0, 0.0, 13.0, 1.3, 15.0)
        ]

        inserted_foods = 0
        for item in foods_data:
            existing = FoodItem.query.filter_by(food_name=item[0]).first()
            if not existing:
                food = FoodItem(
                    food_name=item[0],
                    category=item[1],
                    calories_per_100g=item[2],
                    protein_per_100g=item[3],
                    carbs_per_100g=item[4],
                    fat_per_100g=item[5],
                    iron_per_100g=item[6],
                    calcium_per_100g=item[7]
                )
                db.session.add(food)
                inserted_foods += 1

        db.session.commit()
        print(f"[Seed] Successfully seeded {inserted_foods} food items.")

        # Seed Admin User
        admin_email = "admin@nutrimeasure.ai"
        admin_user = User.query.filter_by(email=admin_email).first()
        if not admin_user:
            admin_user = User(
                name="System Admin",
                email=admin_email,
                password_hash=hash_password("AdminPass123!"),
                role="ADMIN",
                age=24,
                gender="male",
                height=175.0,
                weight=70.0,
                activity_level="Moderately Active",
                workout_type="Gym",
                fitness_goal="Muscle Building"
            )
            db.session.add(admin_user)
            db.session.flush()

            targets = calculate_daily_targets(admin_user)
            target_rec = NutritionTarget(user_id=admin_user.id, **targets)
            db.session.add(target_rec)

            # Add sample meal history for last 3 days
            dosa_item = FoodItem.query.filter_by(food_name="Dosa").first()
            sambar_item = FoodItem.query.filter_by(food_name="Sambar").first()
            egg_item = FoodItem.query.filter_by(food_name="Egg").first()

            for day_offset in range(3):
                m_date = date.today() - timedelta(days=day_offset)
                meal = Meal(
                    user_id=admin_user.id,
                    meal_type="Breakfast",
                    meal_date=m_date,
                    meal_time=time(8, 30),
                    total_calories=350.0,
                    total_protein=15.0,
                    total_carbs=45.0,
                    total_fat=10.0,
                    total_iron=2.5,
                    total_calcium=80.0
                )
                db.session.add(meal)
                db.session.flush()

                if dosa_item:
                    m_item1 = MealItem(
                        meal_id=meal.id, food_id=dosa_item.id, confidence=0.94, estimated_grams=120.0,
                        portion_category="Medium", calories=222.0, protein=5.4, carbs=34.8, fat=7.2, iron=1.3, calcium=30.0
                    )
                    db.session.add(m_item1)
                if sambar_item:
                    m_item2 = MealItem(
                        meal_id=meal.id, food_id=sambar_item.id, confidence=0.91, estimated_grams=150.0,
                        portion_category="Medium", calories=112.5, protein=5.7, carbs=16.5, fat=3.0, iron=1.8, calcium=52.5
                    )
                    db.session.add(m_item2)

            db.session.commit()
            print("[Seed] Created default admin user: admin@nutrimeasure.ai / AdminPass123!")

        print("[Seed] Database seeding completed cleanly!")

if __name__ == '__main__':
    seed_db()
