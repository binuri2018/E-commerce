import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoutes";
import AdminDashboard from "./Pages/AdminDashboard";
import CustomerHome from "./Pages/CustomerHome";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import WelcomePage from "./Pages/WelcomePage";
import MyCart from "./Pages/MyCart";

const App = () => {
    const isAdmin = true; 

    const user = JSON.parse(localStorage.getItem("user")); // Assuming user data is stored
if (user) {
    localStorage.setItem("customerId", user.customerId);
}


    return (
        <Routes>
            {/* Customer Side */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/customer-home" element={<CustomerHome />} />
            <Route path="/mycart" element={<MyCart />} />

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
