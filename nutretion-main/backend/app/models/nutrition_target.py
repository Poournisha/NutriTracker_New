from datetime import datetime
from app.extensions import db

class NutritionTarget(db.Model):
    __tablename__ = 'nutrition_targets'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True, index=True)
    
    calorie_target = db.Column(db.Float, nullable=False)
    protein_target = db.Column(db.Float, nullable=False)
    carbs_target = db.Column(db.Float, nullable=False)
    fat_target = db.Column(db.Float, nullable=False)
    iron_target = db.Column(db.Float, nullable=False)
    calcium_target = db.Column(db.Float, nullable=False)
    
    calculated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'calorie_target': round(self.calorie_target, 0),
            'protein_target': round(self.protein_target, 1),
            'carbs_target': round(self.carbs_target, 1),
            'fat_target': round(self.fat_target, 1),
            'iron_target': round(self.iron_target, 1),
            'calcium_target': round(self.calcium_target, 1),
            'calculated_at': self.calculated_at.isoformat() if self.calculated_at else None
        }
