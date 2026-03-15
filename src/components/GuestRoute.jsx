import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen" style={{ 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                background: '#0a0a0a',
                color: 'white'
            }}>
                Checking session...
            </div>
        );
    }

    if (user) {
        return <Navigate to="/discover" replace />;
    }

    return children;
};

export default GuestRoute;
