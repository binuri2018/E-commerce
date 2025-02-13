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
    const [errors, setErrors] = useState({ name: "", email: "", phone: "", password: "", address: "" });
    const [showPasswordRules, setShowPasswordRules] = useState(false);

    // Address Fields
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [houseNo, setHouseNo] = useState(""); 

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (Object.values(errors).some((error) => error !== "")) return;

        try {
            const userData = {
                name,
                email,
                phone,
                password,
                address: { houseNo,street, city }
            };

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
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className="input-group">
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="input-group">
                            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>

                        <div className="input-group">
                            <div className="password-container">
                                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>
                        </div>

                        {/* Address Fields */}
                        <div className="input-group">
                            <input type="text" placeholder="House No" value={houseNo} onChange={(e) => setHouseNo(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <input type="text" placeholder="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} required />
                        </div>

                        <div className="input-group">
                            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
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
