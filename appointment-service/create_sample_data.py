#!/usr/bin/env python3
"""
Create sample data for the EMR Appointment System
This script will populate the database with sample appointments
"""

from appointment_app import create_app
from appointment_models import db, User, Doctor, Appointment
from datetime import datetime, date, time, timedelta

def create_sample_data():
    """Create comprehensive sample data"""
    app = create_app()
    
    with app.app_context():
        print("🏥 Creating sample data for EMR Appointment System...")
        
        # Clear existing appointments (but keep users and doctors)
        Appointment.query.delete()
        db.session.commit()
        print("🗑️  Cleared existing appointments")
        
        # Get existing users and doctors
        users = User.query.filter_by(role='Patient').all()
        doctors = Doctor.query.all()
        
        print(f"👥 Found {len(users)} patients and {len(doctors)} doctors")
        
        if len(users) == 0 or len(doctors) == 0:
            print("❌ No patients or doctors found. Please run the main app first to create sample users.")
            return
        
        # Create sample appointments
        today = date.today()
        appointments_data = [
            # Today's appointments
            {
                'patient': users[0] if len(users) > 0 else None,
                'doctor': doctors[0] if len(doctors) > 0 else None,
                'date': today,
                'time': time(9, 0),
                'duration': 30,
                'reason': 'Annual Physical Examination',
                'status': 'Confirmed',
                'mode': 'In-Person'
            },
            {
                'patient': users[1] if len(users) > 1 else users[0],
                'doctor': doctors[1] if len(doctors) > 1 else doctors[0],
                'date': today,
                'time': time(14, 30),
                'duration': 45,
                'reason': 'Follow-up consultation for diabetes management',
                'status': 'Scheduled',
                'mode': 'In-Person'
            },
            
            # Tomorrow's appointments
            {
                'patient': users[0] if len(users) > 0 else None,
                'doctor': doctors[2] if len(doctors) > 2 else doctors[0],
                'date': today + timedelta(days=1),
                'time': time(10, 0),
                'duration': 30,
                'reason': 'Skin rash examination',
                'status': 'Confirmed',
                'mode': 'Video Call'
            },
            {
                'patient': users[1] if len(users) > 1 else users[0],
                'doctor': doctors[0] if len(doctors) > 0 else None,
                'date': today + timedelta(days=1),
                'time': time(16, 0),
                'duration': 60,
                'reason': 'Cardiac stress test and consultation',
                'status': 'Scheduled',
                'mode': 'In-Person'
            },
            
            # Next week appointments
            {
                'patient': users[0] if len(users) > 0 else None,
                'doctor': doctors[3] if len(doctors) > 3 else doctors[0],
                'date': today + timedelta(days=7),
                'time': time(11, 30),
                'duration': 30,
                'reason': 'Child vaccination and health checkup',
                'status': 'Scheduled',
                'mode': 'In-Person'
            },
            
            # Past appointment (completed)
            {
                'patient': users[1] if len(users) > 1 else users[0],
                'doctor': doctors[1] if len(doctors) > 1 else doctors[0],
                'date': today - timedelta(days=3),
                'time': time(13, 0),
                'duration': 30,
                'reason': 'Blood pressure monitoring',
                'status': 'Completed',
                'mode': 'In-Person'
            }
        ]
        
        # Create appointments
        created_count = 0
        for apt_data in appointments_data:
            if apt_data['patient'] and apt_data['doctor']:
                appointment = Appointment(
                    patient_id=apt_data['patient'].id,
                    doctor_id=apt_data['doctor'].id,
                    date=apt_data['date'],
                    time=apt_data['time'],
                    duration=apt_data['duration'],
                    reason=apt_data['reason'],
                    status=apt_data['status'],
                    mode=apt_data['mode']
                )
                db.session.add(appointment)
                created_count += 1
        
        db.session.commit()
        
        print(f"✅ Created {created_count} sample appointments")
        
        # Verify creation
        total_appointments = Appointment.query.count()
        today_appointments = Appointment.query.filter(Appointment.date == today).count()
        confirmed_appointments = Appointment.query.filter(Appointment.status == 'Confirmed').count()
        
        print(f"📊 Database Summary:")
        print(f"   Total appointments: {total_appointments}")
        print(f"   Today's appointments: {today_appointments}")
        print(f"   Confirmed appointments: {confirmed_appointments}")
        print(f"   Patients: {User.query.filter_by(role='Patient').count()}")
        print(f"   Doctors: {Doctor.query.count()}")
        
        print("\n🎉 Sample data creation completed!")
        print("💡 You can now test the GET /api/appointments endpoint")

if __name__ == "__main__":
    create_sample_data()