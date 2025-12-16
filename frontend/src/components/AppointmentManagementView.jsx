// AppointmentManagementView.jsx - Appointment Management View
import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, Phone, Mail, Video, MapPin, Plus, Search, LogOut } from 'lucide-react'
import Navbar from './Navbar'
import VerticalSidebar from './VerticalSidebar'
import NewAppointmentForm from './NewAppointmentForm'
import Dashboard from './Dashboard'
import apiService from '../services/api'

// Real API integration with backend

const AppointmentManagementView = ( { user, onSignOut } ) => {
    const [appointments, setAppointments] = useState( [] )
    const [selectedDate, setSelectedDate] = useState( null )
    const [activeTab, setActiveTab] = useState( 'upcoming' )
    const [stats, setStats] = useState( {} )
    const [loading, setLoading] = useState( true )
    const [showNewAppointmentModal, setShowNewAppointmentModal] = useState( false )
    const [activeSection, setActiveSection] = useState( 'appointments' )

    // Data fetching using React hook (useState/useEffect) to initialize component
    useEffect( () => {
        const fetchInitialData = async () => {
            try {
                console.log( '🔄 Fetching initial data for user:', user )
                setLoading( true )

                // Fetch appointments and stats from API
                const [appointmentsData, statsData] = await Promise.all( [
                    apiService.getAppointments(),
                    apiService.getAppointmentStats()
                ] )

                console.log( '📊 Fetched appointments:', appointmentsData.length )
                console.log( '📈 Fetched stats:', statsData )
                setAppointments( appointmentsData )
                setStats( statsData )
                setLoading( false )
            } catch ( error ) {
                console.error( 'Error fetching appointments:', error )
                setLoading( false )
            }
        }

        fetchInitialData()
    }, [] )

    // Calendar filtering - click handler for Calendar Widget
    const handleDateClick = async ( date ) => {
        console.log( `[Calendar Click] Selected date: ${date}` )
        setSelectedDate( date )

        try {
            const filteredAppointments = await apiService.getAppointments( { date } )
            setAppointments( filteredAppointments )
        } catch ( error ) {
            console.error( 'Error fetching appointments by date:', error )
        }
    }

    // Tab filtering - implement logic for Tabs (Upcoming, Today, Past)
    const handleTabClick = async ( tabName ) => {
        console.log( `[Tab Click] Selected tab: ${tabName}` )
        setActiveTab( tabName )

        let statusFilter = null
        switch ( tabName ) {
            case 'today':
                statusFilter = 'today'
                break
            case 'upcoming':
                statusFilter = 'upcoming'
                break
            case 'past':
                statusFilter = 'past'
                break
            case 'all':
                statusFilter = null
                break
            default:
                statusFilter = tabName
        }

        try {
            const filters = {}
            if ( selectedDate ) filters.date = selectedDate
            if ( statusFilter ) filters.status = statusFilter

            const filteredAppointments = await apiService.getAppointments( filters )
            setAppointments( filteredAppointments )
        } catch ( error ) {
            console.error( 'Error fetching appointments by status:', error )
        }
    }

    // Status update - implement functionality to update appointment status
    const handleStatusUpdate = async ( appointmentId, newStatus ) => {
        console.log( `[Status Update] Appointment ${appointmentId} -> ${newStatus}` )

        try {
            const result = await apiService.updateAppointmentStatus( appointmentId, newStatus )

            if ( result.success ) {
                // Update local state immediately for better UX
                const updatedAppointments = appointments.map( apt =>
                    apt.id === appointmentId ? { ...apt, status: newStatus } : apt
                )
                setAppointments( updatedAppointments )

                // Refresh stats
                const updatedStats = await apiService.getAppointmentStats()
                setStats( updatedStats )
                console.log( '[UI Update] Local state refreshed to reflect status change' )
            }
        } catch ( error ) {
            console.error( 'Error updating appointment status:', error )
        }
    }

    const handleNewAppointment = async ( newAppointment ) => {
        try {
            // Add to local state immediately for better UX
            setAppointments( prev => [...prev, newAppointment] )

            // Refresh stats
            const updatedStats = await apiService.getAppointmentStats()
            setStats( updatedStats )

            // Also refresh the full appointments list to ensure consistency
            const refreshedAppointments = await apiService.getAppointments()
            setAppointments( refreshedAppointments )

            console.log( '[New Appointment] Added and refreshed list:', newAppointment )
        } catch ( error ) {
            console.error( 'Error handling new appointment:', error )
            // Refresh the list anyway in case of error
            try {
                const refreshedAppointments = await apiService.getAppointments()
                setAppointments( refreshedAppointments )
            } catch ( refreshError ) {
                console.error( 'Error refreshing appointments:', refreshError )
            }
        }
    }

    const handleSectionChange = ( section ) => {
        setActiveSection( section )
        if ( section === 'add' ) {
            setShowNewAppointmentModal( true )
        }
    }

    const renderContent = () => {
        switch ( activeSection ) {
            case 'dashboard':
                return <Dashboard stats={stats} />
            case 'search':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Search</h2>
                        <p className="text-gray-600">Search functionality coming soon...</p>
                    </div>
                )
            case 'analytics':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
                        <p className="text-gray-600">Analytics dashboard coming soon...</p>
                    </div>
                )
            case 'patients':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Patients</h2>
                        <p className="text-gray-600">Patient management coming soon...</p>
                    </div>
                )
            case 'schedule':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule</h2>
                        <p className="text-gray-600">Schedule management coming soon...</p>
                    </div>
                )
            case 'reports':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
                        <p className="text-gray-600">Reports section coming soon...</p>
                    </div>
                )
            case 'settings':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                        <p className="text-gray-600">Settings panel coming soon...</p>
                    </div>
                )
            case 'appointments':
            default:
                return renderAppointmentsContent()
        }
    }

    // Status color mapping
    const getStatusColor = ( status ) => {
        const colors = {
            'Confirmed': 'bg-green-100 text-green-800',
            'Scheduled': 'bg-blue-100 text-blue-800',
            'Upcoming': 'bg-blue-100 text-blue-800',
            'Completed': 'bg-gray-100 text-gray-800',
            'Cancelled': 'bg-red-100 text-red-800'
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    if ( loading ) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading appointments...</div>
            </div>
        )
    }

    const renderAppointmentsContent = () => (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg p-6 shadow">
                    <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Today's Appointments</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.today || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                            <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Confirmed Appointments</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.confirmed || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow">
                    <div className="flex items-center">
                        <Clock className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Upcoming Appointments</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.upcoming || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow">
                    <div className="flex items-center">
                        <Video className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Telemedicine Sessions</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.telemedicine || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar Sidebar */}
                <Navbar
                    selectedDate={selectedDate}
                    onDateClick={handleDateClick}
                />

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow">
                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {['upcoming', 'today', 'past', 'all'].map( ( tab ) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabClick( tab )}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ) )}
                            </nav>
                        </div>

                        {/* Search and Filter */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1 relative">
                                    <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search appointments..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>All Status</option>
                                    <option>Confirmed</option>
                                    <option>Scheduled</option>
                                    <option>Completed</option>
                                    <option>Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {/* Appointments List */}
                        <div className="divide-y divide-gray-200">
                            {appointments.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    No appointments found for the selected criteria.
                                </div>
                            ) : (
                                appointments.map( ( appointment ) => (
                                    <div key={appointment.id} className="p-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {appointment.name}
                                                        </p>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor( appointment.status )}`}>
                                                            {appointment.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        <p className="text-sm text-gray-500 flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            {appointment.date}
                                                        </p>
                                                        <p className="text-sm text-gray-500 flex items-center">
                                                            <Clock className="h-4 w-4 mr-1" />
                                                            {appointment.time} ({appointment.duration} min)
                                                        </p>
                                                        <p className="text-sm text-gray-500 flex items-center">
                                                            {appointment.mode === 'Video Call' ? (
                                                                <Video className="h-4 w-4 mr-1" />
                                                            ) : (
                                                                <MapPin className="h-4 w-4 mr-1" />
                                                            )}
                                                            {appointment.mode}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {appointment.doctorName} • {appointment.reason}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleStatusUpdate( appointment.id, 'Confirmed' )}
                                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                    disabled={appointment.status === 'Confirmed'}
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate( appointment.id, 'Cancelled' )}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    disabled={appointment.status === 'Cancelled'}
                                                >
                                                    Cancel
                                                </button>
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                    Edit
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <Phone className="h-4 w-4 mr-1" />
                                                {appointment.phone}
                                            </span>
                                            <span className="flex items-center">
                                                <Mail className="h-4 w-4 mr-1" />
                                                {appointment.email}
                                            </span>
                                        </div>
                                    </div>
                                ) )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Vertical Sidebar */}
            <VerticalSidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                user={user}
            />

            {/* Main Content */}
            <div className="flex-1 ml-16">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-4">
                                <Calendar className="h-8 w-8 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setShowNewAppointmentModal( true )}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>New Appointment</span>
                                </button>
                                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200">
                                    <span>Export</span>
                                </button>
                                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900">{user?.name || user?.fullName}</p>
                                        <p className="text-gray-500">{user?.role || 'User'}</p>
                                    </div>
                                    <button
                                        onClick={onSignOut}
                                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                                        title="Sign Out"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Content Based on Selected Section */}
                {renderContent()}

                {/* New Appointment Modal */}
                <NewAppointmentForm
                    isOpen={showNewAppointmentModal}
                    onClose={() => setShowNewAppointmentModal( false )}
                    onSubmit={handleNewAppointment}
                    user={user}
                />
            </div>
        </div>
    )
}

export default AppointmentManagementView