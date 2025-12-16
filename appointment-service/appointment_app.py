from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, date, time
import os
from appointment_models import db, User, Doctor, Appointment

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Enable CORS for frontend connection - ENHANCED
    CORS(app, 
         origins=["http://localhost:3000", "http://127.0.0.1:3000"], 
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         supports_credentials=True)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///appointments.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    
    # Authentication Routes
    @app.route('/api/auth/signin', methods=['POST'])
    def signin():
        """User sign in"""
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return jsonify({'error': 'Email and password are required'}), 400
            
            user = User.query.filter_by(email=email).first()
            
            if user and user.check_password(password):
                return jsonify({
                    'success': True,
                    'user': user.to_dict(),
                    'message': 'Sign in successful'
                }), 200
            else:
                return jsonify({'error': 'Invalid email or password'}), 401
                
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/auth/signup', methods=['POST'])
    def signup():
        """User sign up"""
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['fullName', 'email', 'phoneNumber', 'age', 'password']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required'}), 400
            
            # Check if user already exists
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email already registered'}), 400
            
            # Create new user
            user = User(
                full_name=data['fullName'],
                email=data['email'],
                phone_number=data['phoneNumber'],
                age=int(data['age']),
                role=data.get('role', 'Patient')
            )
            user.set_password(data['password'])
            
            db.session.add(user)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'user': user.to_dict(),
                'message': 'Account created successfully'
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    # Appointment Routes
    @app.route('/api/appointments', methods=['GET'])
    def get_appointments():
        """Get appointments with optional filtering - FIXED VERSION"""
        try:
            date_filter = request.args.get('date')
            status_filter = request.args.get('status')
            
            print(f"[GET /api/appointments] date_filter: {date_filter}, status_filter: {status_filter}")
            
            # Check if we have any appointments at all
            total_appointments = Appointment.query.count()
            print(f"Total appointments in database: {total_appointments}")
            
            if total_appointments == 0:
                print("WARNING: No appointments found in database!")
                return jsonify([]), 200  # Return empty array for frontend compatibility
            
            query = Appointment.query
            
            # Apply date filter with better error handling
            if date_filter:
                try:
                    filter_date = datetime.strptime(date_filter, '%Y-%m-%d').date()
                    query = query.filter(Appointment.date == filter_date)
                    print(f"Applied date filter: {filter_date}")
                except ValueError as e:
                    print(f"Invalid date format: {e}")
                    return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
            
            # Apply status filter with better logic
            if status_filter:
                today = date.today()
                print(f"Today's date: {today}")
                
                if status_filter.lower() == 'today':
                    query = query.filter(Appointment.date == today)
                elif status_filter.lower() == 'upcoming':
                    query = query.filter(Appointment.status.in_(['Upcoming', 'Scheduled']))
                elif status_filter.lower() == 'confirmed':
                    query = query.filter(Appointment.status == 'Confirmed')
                elif status_filter.lower() == 'past':
                    query = query.filter(Appointment.status.in_(['Completed', 'Cancelled']))
                elif status_filter.lower() == 'scheduled':
                    query = query.filter(Appointment.status == 'Scheduled')
                else:
                    # Direct status match (case-insensitive)
                    query = query.filter(Appointment.status.ilike(f'%{status_filter}%'))
                
                print(f"Applied status filter: {status_filter}")
            
            # Execute query with relationship loading to avoid N+1 problems
            try:
                from sqlalchemy.orm import joinedload
                appointments = query.options(
                    joinedload(Appointment.patient),
                    joinedload(Appointment.doctor)
                ).all()
                print(f"Query executed successfully. Found {len(appointments)} appointments")
            except Exception as query_error:
                print(f"Database query error: {query_error}")
                # Fallback to simple query
                appointments = query.all()
                print(f"Fallback query found {len(appointments)} appointments")
            
            # Convert to dictionary with enhanced error handling
            result = []
            conversion_errors = 0
            
            for apt in appointments:
                try:
                    # Check if relationships exist
                    if not apt.patient or not apt.doctor:
                        print(f"Appointment {apt.id} missing relationships - patient: {apt.patient is not None}, doctor: {apt.doctor is not None}")
                        continue
                    
                    # Use the model's to_dict method with fallback
                    try:
                        apt_dict = apt.to_dict()
                    except Exception as to_dict_error:
                        print(f"to_dict failed for appointment {apt.id}: {to_dict_error}")
                        # Manual conversion as fallback
                        apt_dict = {
                            'id': apt.id,
                            'name': apt.patient.full_name if apt.patient else 'Unknown Patient',
                            'date': apt.date.strftime('%Y-%m-%d'),
                            'time': apt.time.strftime('%H:%M'),
                            'duration': apt.duration,
                            'doctorName': apt.doctor.name if apt.doctor else 'Unknown Doctor',
                            'status': apt.status,
                            'mode': apt.mode,
                            'reason': apt.reason,
                            'phone': apt.patient.phone_number if apt.patient else '',
                            'email': apt.patient.email if apt.patient else '',
                            'createdAt': apt.created_at.isoformat() if apt.created_at else '',
                            'updatedAt': apt.updated_at.isoformat() if apt.updated_at else ''
                        }
                    
                    result.append(apt_dict)
                    
                except Exception as e:
                    print(f"Error converting appointment {apt.id} to dict: {e}")
                    conversion_errors += 1
                    continue
            
            print(f"Successfully converted {len(result)} appointments ({conversion_errors} errors)")
            return jsonify(result), 200
            
        except Exception as e:
            print(f"Critical error in get_appointments: {e}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/appointments', methods=['POST'])
    def create_appointment():
        """Create a new appointment"""
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['patientId', 'doctorId', 'date', 'time', 'reason']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required'}), 400
            
            # Parse date and time
            appointment_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            appointment_time = datetime.strptime(data['time'], '%H:%M').time()
            
            # Create appointment
            appointment = Appointment(
                patient_id=data['patientId'],
                doctor_id=data['doctorId'],
                date=appointment_date,
                time=appointment_time,
                duration=data.get('duration', 30),
                reason=data['reason'],
                status=data.get('status', 'Scheduled'),
                mode=data.get('mode', 'In-Person')
            )
            
            db.session.add(appointment)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'appointment': appointment.to_dict(),
                'message': 'Appointment created successfully'
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/appointments/<int:appointment_id>/status', methods=['PUT'])
    def update_appointment_status(appointment_id):
        """Update appointment status"""
        try:
            data = request.get_json()
            new_status = data.get('status')
            
            if not new_status:
                return jsonify({'error': 'Status is required'}), 400
            
            appointment = Appointment.query.get_or_404(appointment_id)
            appointment.status = new_status
            appointment.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            return jsonify({
                'success': True,
                'appointment': appointment.to_dict(),
                'message': f'Appointment status updated to {new_status}'
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/appointments/stats', methods=['GET'])
    def get_appointment_stats():
        """Get appointment statistics"""
        try:
            today = date.today()
            
            stats = {
                'today': Appointment.query.filter(Appointment.date == today).count(),
                'confirmed': Appointment.query.filter(Appointment.status == 'Confirmed').count(),
                'upcoming': Appointment.query.filter(Appointment.status.in_(['Upcoming', 'Scheduled'])).count(),
                'telemedicine': Appointment.query.filter(Appointment.mode == 'Video Call').count()
            }
            
            return jsonify(stats), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # Doctor Routes
    @app.route('/api/doctors', methods=['GET'])
    def get_doctors():
        """Get all active doctors"""
        try:
            doctors = Doctor.query.filter_by(is_active=True).all()
            return jsonify([doctor.to_dict() for doctor in doctors]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # Health check
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()}), 200
    
    # Root route
    @app.route('/')
    def index():
        """Root endpoint with API information"""
        return jsonify({
            'message': 'EMR Appointment Management System API',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'health': '/api/health',
                'auth': {
                    'signin': 'POST /api/auth/signin',
                    'signup': 'POST /api/auth/signup'
                },
                'appointments': {
                    'list': 'GET /api/appointments',
                    'create': 'POST /api/appointments',
                    'update_status': 'PUT /api/appointments/<id>/status',
                    'stats': 'GET /api/appointments/stats'
                },
                'doctors': 'GET /api/doctors'
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

def init_database(app):
    """Initialize database with sample data"""
    with app.app_context():
        # Create tables
        db.create_all()
        print("✅ Database tables created")
        
        # Check if we need to add sample data
        if Doctor.query.count() == 0:
            print("🏥 Adding sample data...")
            
            # Add sample doctors
            doctors = [
                Doctor(name="Dr. Rajesh Kumar", specialization="Cardiologist", 
                      email="rajesh@hospital.com", phone="+1-555-0101"),
                Doctor(name="Dr. Maya Sharma", specialization="General Medicine", 
                      email="maya@hospital.com", phone="+1-555-0102"),
                Doctor(name="Dr. Lisa Thompson", specialization="Dermatologist", 
                      email="lisa@hospital.com", phone="+1-555-0103"),
                Doctor(name="Dr. James Wilson", specialization="Pediatrician", 
                      email="james@hospital.com", phone="+1-555-0104")
            ]
            
            for doctor in doctors:
                db.session.add(doctor)
            
            # Add sample admin user
            admin_user = User(
                full_name="Dr. Admin",
                email="admin@emr.com",
                phone_number="+1-555-0001",
                age=35,
                role="Administrator"
            )
            admin_user.set_password("password")
            db.session.add(admin_user)
            
            # Add sample patients
            patients = [
                User(full_name="Sarah Johnson", email="sarah.johnson@email.com", 
                     phone_number="+1-987-654-3210", age=34, role="Patient"),
                User(full_name="Michael Chen", email="michael.chen@email.com", 
                     phone_number="+1-987-654-3211", age=28, role="Patient"),
                User(full_name="Emily Rodriguez", email="emily.rodriguez@email.com", 
                     phone_number="+1-987-654-3212", age=42, role="Patient")
            ]
            
            for patient in patients:
                patient.set_password("patient123")
                db.session.add(patient)
            
            db.session.commit()
            
            # Add sample appointments
            from datetime import timedelta
            today = date.today()
            
            appointments = [
                Appointment(
                    patient_id=patients[0].id, doctor_id=doctors[0].id,
                    date=today + timedelta(days=1), time=time(9, 0),
                    duration=30, reason="Diabetes Management Review",
                    status="Confirmed", mode="In-Person"
                ),
                Appointment(
                    patient_id=patients[1].id, doctor_id=doctors[1].id,
                    date=today, time=time(10, 0),
                    duration=45, reason="Annual Physical Examination",
                    status="Scheduled", mode="In-Person"
                ),
                Appointment(
                    patient_id=patients[2].id, doctor_id=doctors[0].id,
                    date=today + timedelta(days=1), time=time(11, 30),
                    duration=30, reason="Cold and Flu Symptoms",
                    status="Confirmed", mode="Video Call"
                )
            ]
            
            for appointment in appointments:
                db.session.add(appointment)
            
            db.session.commit()
            print(" Sample data added to database")
            print(f" Doctors: {Doctor.query.count()}")
            print(f" Users: {User.query.count()}")
            print(f" Appointments: {Appointment.query.count()}")
        else:
            print(" Database already has data")

if __name__ == '__main__':
    app = create_app()
    init_database(app)
    print(" Starting EMR Appointment Service...")
    print(" API available at: http://localhost:5000/api")
    print(" Health check: http://localhost:5000/api/health")
    app.run(host='0.0.0.0', port=5000, debug=True)