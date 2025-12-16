# Frontend - EMR Appointment Management System

React frontend application built with Vite for managing patient appointments with real-time filtering and status updates.

## Features

- **Interactive Calendar**: Date-based appointment filtering
- **Tab Navigation**: Filter by appointment status (Upcoming, Today, Past, All)
- **Real-time Updates**: Immediate UI updates for status changes
- **Dashboard Statistics**: Live appointment metrics
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Components

### AppointmentManagementView
Main component implementing all assignment requirements:
- Data fetching with React hooks
- Calendar filtering functionality
- Tab-based status filtering
- Status update operations
- Real-time UI state management

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Runs the app in development mode on [http://localhost:3000](http://localhost:3000) with Vite's fast HMR.

## Build

```bash
npm run build
```

Builds the app for production to the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

Preview the production build locally.

## Dependencies

- **React 18**: Core framework
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Styling and responsive design
- **Lucide React**: Icon library
- **ESLint**: Code linting

## Integration with Backend

The frontend simulates Python backend integration through mock functions that replicate the exact API structure:

```javascript
// Simulates Python get_appointments() function
const appointments = mockPythonFunctions.get_appointments(dateFilter, statusFilter);

// Simulates Python update_appointment_status() function
const result = mockPythonFunctions.update_appointment_status(appointmentId, newStatus);
```

## Vite Benefits

- ⚡ Lightning fast HMR (Hot Module Replacement)
- 📦 Optimized build with Rollup
- 🔧 Zero-config TypeScript support
- 🎯 Better development experience

## Assignment Compliance

✅ **Data Fetching**: React hooks initialize component with backend data  
✅ **Calendar Filtering**: Click handlers update selectedDate and filter appointments  
✅ **Tab Filtering**: Status-based filtering with real-time updates  
✅ **Status Updates**: Immediate UI updates simulating AppSync subscriptions