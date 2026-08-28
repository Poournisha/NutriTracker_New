from datetime import datetime, date, time
from app.extensions import db

class Meal(db.Model):
    __tablename__ = 'meals'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    image_path = db.Column(db.String(255), nullable=True)
    meal_type = db.Column(db.String(50), nullable=False) # Breakfast, Lunch, Snack, Dinner
    meal_date = db.Column(db.Date, nullable=False, index=True, default=date.today)
    meal_time = db.Column(db.Time, nullable=False, default=lambda: datetime.utcnow().time())
    
    total_calories = db.Column(db.Float, nullable=False, default=0.0)
    total_protein = db.Column(db.Float, nullable=False, default=0.0)
    total_carbs = db.Column(db.Float, nullable=False, default=0.0)
    total_fat = db.Column(db.Float, nullable=False, default=0.0)
    total_iron = db.Column(db.Float, nullable=False, default=0.0)
    total_calcium = db.Column(db.Float, nullable=False, default=0.0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    items = db.relationship('MealItem', backref='meal', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_path': self.image_path,
            'meal_type': self.meal_type,
            'meal_date': self.meal_date.isoformat() if self.meal_date else None,
            'meal_time': self.meal_time.strftime('%H:%M:%S') if self.meal_time else None,
            'total_calories': round(self.total_calories, 2),
            'total_protein': round(self.total_protein, 2),
            'total_carbs': round(self.total_carbs, 2),
            'total_fat': round(self.total_fat, 2),
            'total_iron': round(self.total_iron, 2),
            'total_calcium': round(self.total_calcium, 2),
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
