import React, { useState } from 'react'
import { User, Mail, Phone, Lock, Eye, EyeOff, Calendar } from 'lucide-react'
import apiService from '../services/api'

const SignUp = ( { onSignUp, onSwitchToSignIn } ) => {
    const [formData, setFormData] = useState( {
        fullName: '',
        phoneNumber: '',
        email: '',
        age: '',
        password: '',
        confirmPassword: ''
    } )
    const [errors, setErrors] = useState( {} )
    const [showPassword, setShowPassword] = useState( false )
    const [showConfirmPassword, setShowConfirmPassword] = useState( false )
    const [isLoading, setIsLoading] = useState( false )

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

        // Full name validation
        if ( !formData.fullName.trim() ) {
            newErrors.fullName = 'Full name is required'
        } else if ( formData.fullName.trim().length < 2 ) {
            newErrors.fullName = 'Full name must be at least 2 characters'
        }

        // Phone number validation
        if ( !formData.phoneNumber.trim() ) {
            newErrors.phoneNumber = 'Phone number is required'
        } else {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
            if ( !phoneRegex.test( formData.phoneNumber.replace( /\s|-/g, '' ) ) ) {
                newErrors.phoneNumber = 'Please enter a valid phone number'
            }
        }

        // Email validation
        if ( !formData.email.trim() ) {
            newErrors.email = 'Email is required'
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if ( !emailRegex.test( formData.email ) ) {
                newErrors.email = 'Please enter a valid email address'
            }
        }

        // Age validation
        if ( !formData.age.trim() ) {
            newErrors.age = 'Age is required'
        } else if ( isNaN( formData.age ) || formData.age < 18 || formData.age > 120 ) {
            newErrors.age = 'Age must be between 18 and 120'
        }

        // Password validation
        if ( !formData.password ) {
            newErrors.password = 'Password is required'
        } else if ( formData.password.length < 8 ) {
            newErrors.password = 'Password must be at least 8 characters'
        } else if ( !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test( formData.password ) ) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        }

        // Confirm password validation
        if ( !formData.confirmPassword ) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if ( formData.password !== formData.confirmPassword ) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors( newErrors )
        return Object.keys( newErrors ).length === 0
    }

    const handleSubmit = async ( e ) => {
        e.preventDefault()
        if ( validateForm() ) {
            setIsLoading( true )

            try {
                const response = await apiService.signUp( {
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    age: parseInt( formData.age ),
                    password: formData.password
                } )

                if ( response.success ) {
                    onSignUp( response.user )
                }
            } catch ( error ) {
                setErrors( { general: error.message || 'Registration failed' } )
            } finally {
                setIsLoading( false )
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Calendar className="h-12 w-12 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">EMR System</h1>
                    <p className="text-gray-600 mt-2">Create your account</p>
                </div>

                {/* Sign Up Form */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="h-4 w-4 inline mr-1" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your full name"
                                autoComplete="name"
                            />
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="h-4 w-4 inline mr-1" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="+1 (555) 123-4567"
                                    autoComplete="tel"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="18"
                                    max="120"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.age ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Age"
                                />
                                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="h-4 w-4 inline mr-1" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your email"
                                autoComplete="email"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Lock className="h-4 w-4 inline mr-1" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword( !showPassword )}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Lock className="h-4 w-4 inline mr-1" />
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword( !showConfirmPassword )}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                I agree to the{' '}
                                <button type="button" className="text-blue-600 hover:text-blue-800">
                                    Terms of Service
                                </button>{' '}
                                and{' '}
                                <button type="button" className="text-blue-600 hover:text-blue-800">
                                    Privacy Policy
                                </button>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={onSwitchToSignIn}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp