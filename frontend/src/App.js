import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoutes";
import AdminDashboard from "./Pages/AdminDashboard";
import CustomerHome from "./Pages/CustomerHome";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import WelcomePage from "./Pages/WelcomePage";
import MyCart from "./Pages/MyCart";
import AdminLogin from "./Components/AdminLogin";

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
