from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date, time
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication and patient information"""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='Patient')  # Patient, Doctor, Admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    appointments = db.relationship("Appointment", backref="patient", lazy=True, foreign_keys="Appointment.patient_id")

    def set_password(self, password):
        """Set password hash"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check password"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Convert to dictionary for JSON response"""
        return {
            'id': self.id,
            'fullName': self.full_name,
            'name': self.full_name,  # For compatibility with frontend
            'email': self.email,
            'phoneNumber': self.phone_number,
            'age': self.age,
            'role': self.role,
            'createdAt': self.created_at.isoformat()
        }

    def __repr__(self):
        return f"User('{self.full_name}', '{self.email}')"


class Doctor(db.Model):
    """Doctor model for medical staff"""
    __tablename__ = "doctors"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    # Relationships
    appointments = db.relationship("Appointment", backref="doctor", lazy=True)

    def to_dict(self):
        """Convert to dictionary for JSON response"""
        return {
            'id': self.id,
            'name': self.name,
            'specialization': self.specialization,
            'email': self.email,
            'phone': self.phone,
            'isActive': self.is_active
        }

    def __repr__(self):
        return f"Doctor('{self.name}', '{self.specialization}')"


class Appointment(db.Model):
    """Appointment model for managing patient appointments"""
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    
    # Appointment details
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    duration = db.Column(db.Integer, default=30)  # in minutes
    
    # Appointment info
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='Scheduled')  # Scheduled, Confirmed, Completed, Cancelled
    mode = db.Column(db.String(20), default='In-Person')  # In-Person, Video Call
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert to dictionary for JSON response"""
        return {
            'id': self.id,
            'name': self.patient.full_name,
            'date': self.date.strftime('%Y-%m-%d'),
            'time': self.time.strftime('%H:%M'),
            'duration': self.duration,
            'doctorName': self.doctor.name,
            'status': self.status,
            'mode': self.mode,
            'reason': self.reason,
            'phone': self.patient.phone_number,
            'email': self.patient.email,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }

    def __repr__(self):
        return f"Appointment('{self.patient.full_name}', '{self.date}', '{self.status}')"