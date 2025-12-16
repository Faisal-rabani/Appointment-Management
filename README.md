# 🏥 EMR Appointment Management System

A modern, full-stack Electronic Medical Records (EMR) appointment management system built with React and Flask. This system allows healthcare providers to manage patient appointments, doctor schedules, and medical records efficiently.

![System Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-React%20+%20Vite-blue)
![Backend](https://img.shields.io/badge/Backend-Flask%20+%20SQLAlchemy-green)
![Database](https://img.shields.io/badge/Database-SQLite-orange)

## 🌟 Features

### ✅ **Core Functionality**
- **Patient Management** - Register and manage patient information
- **Doctor Management** - Manage healthcare provider profiles
- **Appointment Scheduling** - Create, view, and manage appointments
- **Real-time Updates** - Instant appointment status updates
- **Authentication System** - Secure login/signup for patients and staff
- **Dashboard Analytics** - View appointment statistics and metrics

### ✅ **User Interface**
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean, intuitive interface with Tailwind CSS
- **Interactive Calendar** - Visual appointment scheduling
- **Status Management** - Easy appointment status updates
- **Search & Filter** - Find appointments by date, status, or patient

### ✅ **Technical Features**
- **RESTful API** - Well-structured backend API
- **Real-time Sync** - Frontend-backend data synchronization
- **Error Handling** - Comprehensive error management
- **CORS Support** - Cross-origin resource sharing enabled
- **Sample Data** - Pre-loaded demo data for testing

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Faisal-rabani/Appointment-Management.git

# Navigate to project directory
cd Appointment-Management
```

### 2. Backend Setup (Flask API)

```bash
# Navigate to backend directory
cd appointment-service

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create sample data (optional but recommended)
python create_sample_data.py

# Start the backend server
python appointment_app.py
```

The backend API will be available at: **http://localhost:5000**

### 3. Frontend Setup (React App)

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at: **http://localhost:3000**

### 4. Access the Application

1. **Open your browser** and go to http://localhost:3000
2. **Sign in** with demo credentials:
   - **Email**: `admin@emr.com`
   - **Password**: `password`
3. **Explore the features** - Create appointments, manage patients, view analytics

## 📁 Project Structure

```
emr-appointment-system/
├── 📁 frontend/                    # React Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/          # React Components
│   │   │   ├── AppointmentManagementView.jsx
│   │   │   ├── NewAppointmentForm.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── VerticalSidebar.jsx
│   │   ├── 📁 services/            # API Services
│   │   │   └── api.js
│   │   ├── App.jsx                 # Main App Component
│   │   └── main.jsx               # Entry Point
│   ├── package.json               # Dependencies
│   ├── vite.config.js            # Vite Configuration
│   └── tailwind.config.js        # Tailwind CSS Config
├── 📁 appointment-service/         # Flask Backend API
│   ├── appointment_app.py         # Main Flask Application
│   ├── appointment_models.py      # Database Models
│   ├── create_sample_data.py      # Sample Data Generator
│   ├── requirements.txt           # Python Dependencies
│   └── 📁 instance/
│       └── appointments.db        # SQLite Database
└── README.md                      # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `appointment-service` directory:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here
FLASK_ENV=development

# Database Configuration
DATABASE_URL=sqlite:///appointments.db

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Database Configuration

The system uses SQLite by default. To use a different database:

1. **Update the database URL** in `appointment_app.py`:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'your-database-url'
```

2. **Install appropriate database driver**:
```bash
# For PostgreSQL
pip install psycopg2-binary

# For MySQL
pip install PyMySQL
```

## 🛠️ Development Guide

### Adding New Features

#### 1. Adding a New API Endpoint

**Backend (Flask):**
```python
# In appointment_app.py
@app.route('/api/your-endpoint', methods=['GET', 'POST'])
def your_endpoint():
    try:
        # Your logic here
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

**Frontend (React):**
```javascript
// In src/services/api.js
async yourEndpoint(data) {
    return this.request('/your-endpoint', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}
```

#### 2. Adding a New React Component

```bash
# Create new component file
touch frontend/src/components/YourComponent.jsx
```

```jsx
// Component template
import React, { useState } from 'react'

const YourComponent = ({ props }) => {
    const [state, setState] = useState(initialValue)
    
    return (
        <div className="your-styles">
            {/* Your JSX here */}
        </div>
    )
}

export default YourComponent
```

#### 3. Adding Database Models

```python
# In appointment_models.py
class YourModel(db.Model):
    __tablename__ = "your_table"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'createdAt': self.created_at.isoformat()
        }
```

### Code Style Guidelines

#### Frontend (React/JavaScript)
- Use **functional components** with hooks
- Follow **camelCase** naming convention
- Use **Tailwind CSS** for styling
- Keep components **small and focused**
- Use **async/await** for API calls

#### Backend (Python/Flask)
- Follow **PEP 8** style guidelines
- Use **snake_case** for variables and functions
- Include **docstrings** for functions
- Handle **exceptions** properly
- Use **SQLAlchemy ORM** for database operations

## 🧪 Testing

### Backend Testing
```bash
# Navigate to backend directory
cd appointment-service

# Run API tests
python -c "
import requests
response = requests.get('http://localhost:5000/api/health')
print(f'Health Check: {response.status_code}')
"
```

### Frontend Testing
```bash
# Navigate to frontend directory
cd frontend

# Run tests (if configured)
npm test

# Build for production
npm run build
```

## 🚀 Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
# Files will be in 'dist' directory
```

#### Backend
```bash
cd appointment-service
# Use a production WSGI server like Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 appointment_app:app
```

### Docker Deployment (Optional)

Create `Dockerfile` for containerized deployment:

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "appointment_app.py"]
```

## 📊 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signin` | User login |
| POST | `/api/auth/signup` | User registration |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Get all appointments |
| POST | `/api/appointments` | Create new appointment |
| PUT | `/api/appointments/:id/status` | Update appointment status |
| GET | `/api/appointments/stats` | Get appointment statistics |

### Other Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | Get all doctors |
| GET | `/api/health` | Health check |

### Example API Requests

#### Create Appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "doctorId": 1,
    "date": "2024-12-20",
    "time": "10:00",
    "duration": 30,
    "reason": "Regular checkup",
    "mode": "In-Person"
  }'
```

#### Get Appointments
```bash
curl http://localhost:5000/api/appointments
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add your feature'`
5. **Push to the branch**: `git push origin feature/your-feature`
6. **Submit a pull request**

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Write clear commit messages

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
```bash
# Port already in use
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Database connection issues
# Delete and recreate database
rm appointment-service/instance/appointments.db
python create_sample_data.py
```

#### Frontend Issues
```bash
# Node modules issues
rm -rf node_modules package-lock.json
npm install

# Port already in use
# Change port in vite.config.js or kill process
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

#### CORS Issues
- Ensure backend CORS is configured for frontend URL
- Check that both servers are running on correct ports
- Verify API base URL in `frontend/src/services/api.js`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Faisal Rabani** - *Initial work* - [Faisal-rabani](https://github.com/Faisal-rabani)

## 🙏 Acknowledgments

- **React Team** - For the amazing frontend framework
- **Flask Team** - For the lightweight backend framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide React** - For the beautiful icons
- **SQLAlchemy** - For the powerful ORM

## 📞 Support

If you have any questions or need help:

1. **Check the documentation** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Contact the maintainers** via email

---

**Happy Coding! 🚀**

*Built with ❤️ for healthcare providers*