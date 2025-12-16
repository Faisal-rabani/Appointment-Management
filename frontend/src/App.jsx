import React, { useState } from 'react'
import AppointmentManagementView from './components/AppointmentManagementView'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import './App.css'

function App() {
    const [user, setUser] = useState( null )
    const [authMode, setAuthMode] = useState( 'signin' ) // 'signin' or 'signup'


    const handleSignIn = ( userData ) => {
        setUser( userData )
    }

    const handleSignUp = ( userData ) => {
        setUser( userData )
    }

    const handleSignOut = () => {
        setUser( null )
    }

    const switchToSignUp = () => {
        setAuthMode( 'signup' )
    }

    const switchToSignIn = () => {
        setAuthMode( 'signin' )
    }



    // If user is not authenticated, show auth forms
    if ( !user ) {
        if ( authMode === 'signup' ) {
            return (
                <SignUp
                    onSignUp={handleSignUp}
                    onSwitchToSignIn={switchToSignIn}
                />
            )
        }
        return (
            <SignIn
                onSignIn={handleSignIn}
                onSwitchToSignUp={switchToSignUp}
            />
        )
    }

    // If user is authenticated, show the main app
    return (
        <div className="App">
            <AppointmentManagementView
                user={user}
                onSignOut={handleSignOut}
            />
        </div>
    )
}

export default App