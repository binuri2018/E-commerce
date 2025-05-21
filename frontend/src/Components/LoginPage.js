import "./AuthStyle.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from "../Assets/logo.png";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password.trim()) {
            setError("Email and Password are required!");
            return;
        }

        if (emailError || passwordError) {
            setError("Please fix validation errors before proceeding.");
            return;
        }

        const result = await login(email.trim(), password.trim());
        if (result.success) {
            navigate('/customer-home');
        } else {
            setError(result.message);
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        const emailPattern = /^[a-z0-9_]+@[a-z]+\.[a-z]{2,6}$/;
        
        if (emailPattern.test(value) || value === '') {
            setEmail(value);
            setEmailError('');
        } else {
            setEmailError('Email must follow the format someone@example.com.');
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setShowPasswordRules(true);
        
        const hasUpperCase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const isValidLength = value.length >= 8;
        
        if (hasUpperCase && hasNumber && isValidLength) {
            setPasswordError('');
            setShowPasswordRules(false);
        } else {
            setPasswordError('Password must have at least 8 characters, one uppercase letter, and one number.');
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
                    <h2>Login</h2>
                    <div className="auth-frame">
                        <div className="auth-card">
                            {error && <p className="error-text">{error}</p>}
                            <form onSubmit={handleLogin}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className="auth-input"
                                />
                                {emailError && <p className="error-text">{emailError}</p>}
                                <div className="password-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className="auth-input password-input"
                                        onFocus={() => setShowPasswordRules(true)}
                                    />
                                    <span
                                        className="eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </span>
                                </div>
                                {showPasswordRules && passwordError && (
                                    <p className="error-text">{passwordError}</p>
                                )}
                                <button type="submit" className="signup-btn">
                                    Login
                                </button>
                            </form>
                            <p className="switch-text">
                                Don't have an account?{' '}
                                <span
                                    className="signup-link"
                                    onClick={() => navigate('/signup')}
                                >
                                    Sign Up
                                </span>
                            </p>
                            <p className="switch-text">
                                <span
                                    className="signup-link"
                                    onClick={() => navigate('/admin/login')}
                                >
                                    Admin Login
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
