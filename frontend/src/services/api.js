// API service for connecting to the backend
const API_BASE_URL = 'http://localhost:5000/api'

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL
    }

    // Helper method for making HTTP requests
    async request( endpoint, options = {} ) {
        const url = `${this.baseURL}${endpoint}`
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        }

        try {
            const response = await fetch( url, config )
            const data = await response.json()

            if ( !response.ok ) {
                throw new Error( data.error || `HTTP error! status: ${response.status}` )
            }

            return data
        } catch ( error ) {
            console.error( 'API request failed:', error )
            throw error
        }
    }

    // Authentication methods
    async signIn( credentials ) {
        return this.request( '/auth/signin', {
            method: 'POST',
            body: JSON.stringify( credentials ),
        } )
    }

    async signUp( userData ) {
        return this.request( '/auth/signup', {
            method: 'POST',
            body: JSON.stringify( userData ),
        } )
    }

    // Appointment methods
    async getAppointments( filters = {} ) {
        const queryParams = new URLSearchParams()

        if ( filters.date ) {
            queryParams.append( 'date', filters.date )
        }
        if ( filters.status ) {
            queryParams.append( 'status', filters.status )
        }

        const endpoint = `/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        return this.request( endpoint )
    }

    async createAppointment( appointmentData ) {
        return this.request( '/appointments', {
            method: 'POST',
            body: JSON.stringify( appointmentData ),
        } )
    }

    async updateAppointmentStatus( appointmentId, status ) {
        return this.request( `/appointments/${appointmentId}/status`, {
            method: 'PUT',
            body: JSON.stringify( { status } ),
        } )
    }

    async getAppointmentStats() {
        return this.request( '/appointments/stats' )
    }

    // Doctor methods
    async getDoctors() {
        return this.request( '/doctors' )
    }

    // Health check
    async healthCheck() {
        return this.request( '/health' )
    }
}

// Create and export a singleton instance
const apiService = new ApiService()
export default apiService

// Export individual methods for convenience
export const {
    signIn,
    signUp,
    getAppointments,
    createAppointment,
    updateAppointmentStatus,
    getAppointmentStats,
    getDoctors,
    healthCheck,
} = apiService