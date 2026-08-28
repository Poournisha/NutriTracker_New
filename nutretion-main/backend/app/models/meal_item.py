from app.extensions import db

class MealItem(db.Model):
    __tablename__ = 'meal_items'

    id = db.Column(db.Integer, primary_key=True)
    meal_id = db.Column(db.Integer, db.ForeignKey('meals.id'), nullable=False, index=True)
    food_id = db.Column(db.Integer, db.ForeignKey('food_items.id'), nullable=False, index=True)
    
    confidence = db.Column(db.Float, nullable=False, default=1.0)
    estimated_grams = db.Column(db.Float, nullable=False)
    portion_category = db.Column(db.String(30), nullable=False) # Small, Medium, Large, Very Large
    
    calories = db.Column(db.Float, nullable=False)
    protein = db.Column(db.Float, nullable=False)
    carbs = db.Column(db.Float, nullable=False)
    fat = db.Column(db.Float, nullable=False)
    iron = db.Column(db.Float, nullable=False)
    calcium = db.Column(db.Float, nullable=False)

    def to_dict(self):
        food_name = self.food_item.food_name if self.food_item else "Unknown Food"
        category = self.food_item.category if self.food_item else "General"
        return {
            'id': self.id,
            'meal_id': self.meal_id,
            'food_id': self.food_id,
            'food_name': food_name,
            'category': category,
            'confidence': round(self.confidence, 2),
            'estimated_grams': round(self.estimated_grams, 1),
            'portion_category': self.portion_category,
            'calories': round(self.calories, 2),
            'protein': round(self.protein, 2),
            'carbs': round(self.carbs, 2),
            'fat': round(self.fat, 2),
            'iron': round(self.iron, 2),
            'calcium': round(self.calcium, 2)
        }
