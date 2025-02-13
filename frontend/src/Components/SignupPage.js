import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./AuthStyle.css"; 
import logo from "../Assets/logo.png";

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState({ name: "", email: "", phone: "", password: "" });
    const [showPasswordRules, setShowPasswordRules] = useState(false);

    const navigate = useNavigate();

    const validateName = (value) => {
        const formattedName = value.replace(/[^a-zA-Z\s]/g, ""); // No numbers & special chars
        const capitalized = formattedName.replace(/\b\w/g, (char) => char.toUpperCase());
        setName(capitalized);

        if (value !== formattedName) {
            setErrors((prev) => ({ ...prev, name: "Only letters and spaces allowed." }));
        } else {
            setErrors((prev) => ({ ...prev, name: "" }));
        }
    };

    const validateEmail = (value) => {
        let formattedEmail = value.replace(/[^a-z0-9@._]/gi, ""); // Allow only letters, numbers, @, ., _
    
        let errorMsg = "";
    
        const atIndex = formattedEmail.indexOf("@");
        if (atIndex !== -1) {
            const beforeAt = formattedEmail.slice(0, atIndex + 1);
            const afterAt = formattedEmail.slice(atIndex + 1).replace(/[^a-z.]/gi, ""); // Only allow letters and . after @
    
            if (formattedEmail.slice(atIndex + 1) !== afterAt) {
                errorMsg = "Only letters and dots (.) are allowed after '@'.";
            }
    
            formattedEmail = beforeAt + afterAt;
        }
    
        setEmail(formattedEmail);
    
        const emailRegex = /^[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
        if (!emailRegex.test(formattedEmail)) {
            errorMsg = "Invalid email format. Example: someone@example.com";
        }
    
        setErrors((prev) => ({ ...prev, email: errorMsg }));
    };
    
    const validatePhone = (value) => {
        const onlyNumbers = value.replace(/\D/g, "");
        setPhone(onlyNumbers.slice(0, 15));

        if (value !== onlyNumbers) {
            setErrors((prev) => ({ ...prev, phone: "Only numbers are allowed." }));
        } else {
            setErrors((prev) => ({ ...prev, phone: "" }));
        }
    };

    const validatePassword = (value) => {
        setPassword(value);
        const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRules.test(value)) {
            setErrors((prev) => ({
                ...prev,
                password: "Must be 8+ chars, 1 uppercase, 1 lowercase, 1 number."
            }));
            setShowPasswordRules(true);
        } else {
            setErrors((prev) => ({ ...prev, password: "" }));
            setShowPasswordRules(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (Object.values(errors).some((error) => error !== "")) return;

        try {
            const userData = { name, email, phone, password };
            console.log("Sending data:", userData);

            const response = await axios.post("http://localhost:5000/api/users/signup", userData, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("Response:", response.data);
            navigate("/login");
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Signup failed. Try again.";
            setErrorMessage(errorMsg);
        }
    };

    return (
        
        <div className="auth-page">
            <nav className="navbar">
                            <div className="nav-left">
                                <img src={logo} alt="Logo" className="logo" />
                            </div>
                        </nav>
            <div className="signup-container">
                <div className="signup-box">
                    <h2>Create New Account</h2>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <form onSubmit={handleSignup}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => validateName(e.target.value)}
                                required
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => validateEmail(e.target.value)}
                                required
                            />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) => validatePhone(e.target.value)}
                                required
                            />
                            {errors.phone && <p className="error-text">{errors.phone}</p>}
                        </div>

                        <div className="input-group">
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => validatePassword(e.target.value)}
                                    onFocus={() => setShowPasswordRules(true)} // Show regulations when focused
                                    onBlur={() => !errors.password && setShowPasswordRules(false)} 
                                    required
                                />
                                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
                            </div>
                            {showPasswordRules && errors.password && <p className="error-text">{errors.password}</p>}
                        </div>

                        <button type="submit" className="signup-btn">Sign Up</button>
                        <p className="switch-text">
                            Already have an account? 
                            <span className="signup-link" onClick={() => navigate('/login')}> Login</span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
