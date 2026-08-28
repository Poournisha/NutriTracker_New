from datetime import datetime
import json
from app.extensions import db

class Recommendation(db.Model):
    __tablename__ = 'recommendations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    nutrient = db.Column(db.String(50), nullable=False)
    severity = db.Column(db.String(20), nullable=False) # LOW, MEDIUM, HIGH
    message = db.Column(db.Text, nullable=False)
    suggested_foods = db.Column(db.Text, nullable=False) # JSON encoded string
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        try:
            foods = json.loads(self.suggested_foods)
        except Exception:
            foods = [self.suggested_foods]
            
        return {
            'id': self.id,
            'user_id': self.user_id,
            'nutrient': self.nutrient,
            'severity': self.severity,
            'message': self.message,
            'suggested_foods': foods,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
