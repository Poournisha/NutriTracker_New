from datetime import datetime
from app.extensions import db

class FoodItem(db.Model):
    __tablename__ = 'food_items'

    id = db.Column(db.Integer, primary_key=True)
    food_name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    category = db.Column(db.String(50), nullable=False)
    calories_per_100g = db.Column(db.Float, nullable=False)
    protein_per_100g = db.Column(db.Float, nullable=False)
    carbs_per_100g = db.Column(db.Float, nullable=False)
    fat_per_100g = db.Column(db.Float, nullable=False)
    iron_per_100g = db.Column(db.Float, nullable=False)
    calcium_per_100g = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    meal_items = db.relationship('MealItem', backref='food_item', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'food_name': self.food_name,
            'category': self.category,
            'calories_per_100g': round(self.calories_per_100g, 2),
            'protein_per_100g': round(self.protein_per_100g, 2),
            'carbs_per_100g': round(self.carbs_per_100g, 2),
            'fat_per_100g': round(self.fat_per_100g, 2),
            'iron_per_100g': round(self.iron_per_100g, 2),
            'calcium_per_100g': round(self.calcium_per_100g, 2),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
