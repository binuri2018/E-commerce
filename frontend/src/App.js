import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoutes';
import AdminDashboard from './Pages/AdminDashboard';
import CustomerHome from './Pages/CustomerHome';

const App = () => {
    const isAdmin = true; // Replace with actual authentication logic.

    return (
        <Router>
            <Routes>
                {/* Customer Side */}
                <Route path="/" element={<CustomerHome />} />

                {/* Admin Side */}
                <Route
                    path="/admin/*"
                    element={
                        <PrivateRoute isAdmin={isAdmin}>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;

