import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoutes";
import AdminDashboard from "./Pages/AdminDashboard";
import CustomerHome from "./Pages/CustomerHome";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import WelcomePage from "./Pages/WelcomePage";

const App = () => {
    const isAdmin = true; 

    return (
        <Routes>
            {/* Customer Side */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/customer-home" element={<CustomerHome />} />

            {/* Admin Side */}
            <Route
                path="/admin/*"
                element={
                    <PrivateRoute isAdmin={isAdmin}>
                        <Routes>
                            <Route path="*" element={<AdminDashboard />} />
                        </Routes>
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default App;
