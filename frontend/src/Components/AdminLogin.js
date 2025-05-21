import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "./AuthStyle.css";
import logo from "../Assets/logo.png";

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { adminLogin } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const result = await adminLogin(email, password);
            if (result.success) {
                // Navigate to admin dashboard with products view
                navigate('/admin/products');
            } else {
                setError(result.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <nav className="navbar">
                <div className="nav-left">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
            </nav>

            <div className="auth-container">
                <div className="signup-box">
                    <h2>Admin Login</h2>
                    <div className="auth-frame">
                        <div className="auth-card">
                            {error && <p className="error-text">{error}</p>}
                            <form onSubmit={handleLogin}>
                                <input
                                    type="email"
                                    placeholder="Admin Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input"
                                    disabled={isLoading}
                                />
                                <div className="password-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="auth-input password-input"
                                        disabled={isLoading}
                                    />
                                    <span
                                        className="eye-icon"
                                        onClick={() => !isLoading && setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </span>
                                </div>
                                <button 
                                    type="submit" 
                                    className="signup-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Logging in...' : 'Login as Admin'}
                                </button>
                            </form>
                            <p className="switch-text">
                                <span
                                    className="signup-link"
                                    onClick={() => !isLoading && navigate('/')}
                                >
                                    Back to Welcome Page
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin; 