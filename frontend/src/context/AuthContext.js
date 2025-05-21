import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('token');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const customerId = localStorage.getItem('customerId');
        
        if (token) {
            setUser({ token, isAdmin, customerId });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password
            });

            const { token, customerId, isAdmin } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('customerId', customerId);
            localStorage.setItem('isAdmin', isAdmin);
            
            setUser({ token, customerId, isAdmin });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const adminLogin = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/admin/login', {
                email,
                password
            });

            const { token, customerId, isAdmin } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('customerId', customerId);
            localStorage.setItem('isAdmin', isAdmin);
            
            setUser({ token, customerId, isAdmin });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Admin login failed' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customerId');
        localStorage.removeItem('isAdmin');
        setUser(null);
    };

    // Add axios interceptor to include token in all requests
    useEffect(() => {
        const interceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on unmount
        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    const value = {
        user,
        login,
        adminLogin,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 