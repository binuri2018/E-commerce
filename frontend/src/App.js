import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoutes";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import CustomerHome from "./Components/customer/CustomerHome";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import WelcomePage from "./Pages/WelcomePage";
import MyCart from "./Components/customer/MyCart";
import AdminLogin from "./Components/AdminLogin";
import Profile from "./Components/customer/Profile";

const App = () => {
    return (
        <AuthProvider>
        <Routes>
                {/* Public routes */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected customer routes */}
                <Route
                    path="/customer-home"
                    element={
                        <PrivateRoute>
                            <CustomerHome />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/mycart"
                    element={
                        <PrivateRoute>
                            <MyCart />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />

                {/* Protected admin routes */}
            <Route
                path="/admin/*"
                element={
                        <PrivateRoute requireAdmin={true}>
                        <Routes>
                            <Route path="*" element={<AdminDashboard />} />
                        </Routes>
                    </PrivateRoute>
                }
            />
        </Routes>
        </AuthProvider>
    );
};

export default App;
