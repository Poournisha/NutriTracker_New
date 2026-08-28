from datetime import datetime
from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='USER', nullable=False)
    
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(20), nullable=True)
    height = db.Column(db.Float, nullable=True) # in cm
    weight = db.Column(db.Float, nullable=True) # in kg
    activity_level = db.Column(db.String(50), nullable=True) # Sedentary, Lightly Active, Moderately Active, Very Active
    workout_type = db.Column(db.String(50), nullable=True) # None, Walking, Running, Gym, Sports, Other
    fitness_goal = db.Column(db.String(50), nullable=True) # Weight Loss, Weight Maintenance, Muscle Building, General Health
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    meals = db.relationship('Meal', backref='user', lazy=True, cascade="all, delete-orphan")
    nutrition_target = db.relationship('NutritionTarget', backref='user', uselist=False, lazy=True, cascade="all, delete-orphan")
    recommendations = db.relationship('Recommendation', backref='user', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'age': self.age,
            'gender': self.gender,
            'height': self.height,
            'weight': self.weight,
            'activity_level': self.activity_level,
            'workout_type': self.workout_type,
            'fitness_goal': self.fitness_goal,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
