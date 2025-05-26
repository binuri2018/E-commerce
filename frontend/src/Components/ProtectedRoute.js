import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && (!user || !user.isAdmin)) {
        // Redirect to home if not admin but trying to access admin route
        return <Navigate to="/" replace />;
    }

    // If authenticated and admin check passes (if required), render the protected component
    return children;
}; 