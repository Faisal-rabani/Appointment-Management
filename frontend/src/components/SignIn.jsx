import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Calendar } from 'lucide-react'
import apiService from '../services/api'

const SignIn = ( { onSignIn, onSwitchToSignUp } ) => {
    const [formData, setFormData] = useState( {
        email: '',
        password: ''
    } )
    const [errors, setErrors] = useState( {} )
    const [showPassword, setShowPassword] = useState( false )
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

        if ( !formData.email.trim() ) {
            newErrors.email = 'Email is required'
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if ( !emailRegex.test( formData.email ) ) {
                newErrors.email = 'Please enter a valid email address'
            }
        }

        if ( !formData.password ) {
            newErrors.password = 'Password is required'
        } else if ( formData.password.length < 6 ) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors( newErrors )
        return Object.keys( newErrors ).length === 0
    }

    const handleSubmit = async ( e ) => {
        e.preventDefault()
        if ( validateForm() ) {
            setIsLoading( true )

            try {
                const response = await apiService.signIn( {
                    email: formData.email,
                    password: formData.password
                } )

                if ( response.success ) {
                    onSignIn( response.user )
                }
            } catch ( error ) {
                setErrors( { general: error.message || 'Sign in failed' } )
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
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>

                {/* Sign In Form */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {errors.general}
                            </div>
                        )}

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
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
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

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={onSwitchToSignUp}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium mb-2">Demo Credentials:</p>
                        <p className="text-sm text-gray-500">Email: admin@emr.com</p>
                        <p className="text-sm text-gray-500">Password: password</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn