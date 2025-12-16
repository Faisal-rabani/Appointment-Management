import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, Phone, Mail, MapPin, Video } from 'lucide-react'
import apiService from '../services/api'

const NewAppointmentForm = ( { isOpen, onClose, onSubmit, user } ) => {
    const [formData, setFormData] = useState( {
        fullName: '',
        phoneNumber: '',
        email: '',
        age: '',
        date: '',
        time: '',
        duration: '30',
        doctorId: '',
        mode: 'In-Person',
        reason: ''
    } )

    const [errors, setErrors] = useState( {} )
    const [doctors, setDoctors] = useState( [] )
    const [loading, setLoading] = useState( false )
    const [submitting, setSubmitting] = useState( false )

    // Load doctors when component mounts
    useEffect( () => {
        const loadDoctors = async () => {
            if ( isOpen ) {
                try {
                    setLoading( true )
                    const doctorsData = await apiService.getDoctors()
                    setDoctors( doctorsData )
                } catch ( error ) {
                    console.error( 'Error loading doctors:', error )
                    setErrors( { general: 'Failed to load doctors' } )
                } finally {
                    setLoading( false )
                }
            }
        }

        loadDoctors()
    }, [isOpen] )

    const handleChange = ( e ) => {
        const { name, value } = e.target
        setFormData( prev => ( {
            ...prev,
            [name]: value
        } ) )
        // Clear error when user starts typing
        if ( errors[name] ) {
            setErrors( prev => ( {
                ...prev,
                [name]: ''
            } ) )
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if ( !formData.fullName.trim() ) newErrors.fullName = 'Full name is required'
        if ( !formData.phoneNumber.trim() ) newErrors.phoneNumber = 'Phone number is required'
        if ( !formData.email.trim() ) newErrors.email = 'Email is required'
        if ( !formData.age.trim() ) newErrors.age = 'Age is required'
        if ( !formData.date ) newErrors.date = 'Date is required'
        if ( !formData.time ) newErrors.time = 'Time is required'
        if ( !formData.doctorId ) newErrors.doctorId = 'Doctor selection is required'
        if ( !formData.reason.trim() ) newErrors.reason = 'Reason is required'

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if ( formData.email && !emailRegex.test( formData.email ) ) {
            newErrors.email = 'Please enter a valid email address'
        }

        // Phone validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
        if ( formData.phoneNumber && !phoneRegex.test( formData.phoneNumber.replace( /\s|-/g, '' ) ) ) {
            newErrors.phoneNumber = 'Please enter a valid phone number'
        }

        // Age validation
        if ( formData.age && ( isNaN( formData.age ) || formData.age < 1 || formData.age > 120 ) ) {
            newErrors.age = 'Please enter a valid age (1-120)'
        }

        setErrors( newErrors )
        return Object.keys( newErrors ).length === 0
    }

    const handleSubmit = async ( e ) => {
        e.preventDefault()
        console.log( '🔍 Form submission started', { formData, user } )

        if ( validateForm() ) {
            setSubmitting( true )

            try {
                // First, create or find the patient
                let patientId = user?.id
                console.log( '👤 Current user:', user )
                console.log( '🆔 Patient ID:', patientId )

                // If user is not a patient, create a new patient account
                if ( !patientId || user?.role !== 'Patient' ) {
                    console.log( '🆕 Creating new patient account...' )
                    const patientData = {
                        fullName: formData.fullName,
                        email: formData.email,
                        phoneNumber: formData.phoneNumber,
                        age: parseInt( formData.age ),
                        password: 'temp123' // Temporary password
                    }

                    const signupResult = await apiService.signUp( patientData )
                    console.log( '📝 Signup result:', signupResult )
                    if ( signupResult.success ) {
                        patientId = signupResult.user.id
                        console.log( '✅ Patient created with ID:', patientId )
                    } else {
                        throw new Error( 'Failed to create patient account' )
                    }
                } else {
                    // Update existing user info if needed
                    patientId = user.id
                }

                // Create the appointment
                const appointmentData = {
                    patientId: patientId,
                    doctorId: parseInt( formData.doctorId ),
                    date: formData.date,
                    time: formData.time,
                    duration: parseInt( formData.duration ),
                    reason: formData.reason,
                    mode: formData.mode,
                    status: 'Scheduled'
                }

                console.log( '📅 Creating appointment with data:', appointmentData )
                const result = await apiService.createAppointment( appointmentData )
                console.log( '📋 Appointment creation result:', result )

                if ( result.success ) {
                    // Call the parent component's onSubmit to refresh the list
                    if ( onSubmit ) {
                        onSubmit( result.appointment )
                    }
                    handleClose()
                } else {
                    throw new Error( result.message || 'Failed to create appointment' )
                }

            } catch ( error ) {
                console.error( 'Error creating appointment:', error )
                setErrors( { general: error.message || 'Failed to create appointment' } )
            } finally {
                setSubmitting( false )
            }
        }
    }

    const handleClose = () => {
        setFormData( {
            fullName: '',
            phoneNumber: '',
            email: '',
            age: '',
            date: '',
            time: '',
            duration: '30',
            doctorId: '',
            mode: 'In-Person',
            reason: ''
        } )
        setErrors( {} )
        setSubmitting( false )
        onClose()
    }

    if ( !isOpen ) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Schedule New Appointment</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Patient Information */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="h-4 w-4 inline mr-1" />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter patient's full name"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Age *
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="1"
                                    max="120"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.age ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter age"
                                />
                                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="h-4 w-4 inline mr-1" />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="+1 (555) 123-4567"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="h-4 w-4 inline mr-1" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="patient@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="h-4 w-4 inline mr-1" />
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split( 'T' )[0]}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.date ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="h-4 w-4 inline mr-1" />
                                    Time *
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.time ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (minutes)
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Doctor *
                                </label>
                                <select
                                    name="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.doctorId ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">
                                        {loading ? 'Loading doctors...' : 'Select a doctor'}
                                    </option>
                                    {doctors.map( doctor => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.name} - {doctor.specialization}
                                        </option>
                                    ) )}
                                </select>
                                {errors.doctorId && <p className="text-red-500 text-sm mt-1">{errors.doctorId}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Mode
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="In-Person"
                                            checked={formData.mode === 'In-Person'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <MapPin className="h-4 w-4 mr-1" />
                                        In-Person
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="mode"
                                            value="Video Call"
                                            checked={formData.mode === 'Video Call'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <Video className="h-4 w-4 mr-1" />
                                        Video Call
                                    </label>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Visit *
                                </label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    rows="3"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.reason ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Describe the reason for this appointment..."
                                />
                                {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Schedule Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewAppointmentForm