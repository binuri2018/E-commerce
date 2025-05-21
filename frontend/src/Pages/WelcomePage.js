import { useNavigate } from "react-router-dom";
import "./WelcomePage.css"; 
import logo from "../Assets/logo.png"; 
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa"; // Contact Icons
import { FaFacebook, FaTiktok, FaInstagram, FaTwitter } from "react-icons/fa"; // Social Media Icons

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="nav-right">
          <button onClick={() => navigate("/login")} className="nav-button login-btn">
            Login
          </button>
          <button onClick={() => navigate("/signup")} className="nav-button signup-btn">
            Sign Up
          </button>
        </div>
      </nav>

      
      <div className="empty-content"></div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <p><strong>Contact Us</strong><br /></p>
          <p><FaPhone className="footer-icon" /> +94 234 500 800</p>
          <p><FaMapMarkerAlt className="footer-icon" /> 123 Fashion St, Colombo, SL</p>
          <p><FaEnvelope className="footer-icon" /> @crystalchandelier.com</p>
          </div>

        <div className="footer-right">
          <p>
            <strong>About Us </strong> <br />
            Welcome to Crystal Chandelier, your go-to fashion destination. 
            We bring you the latest trends with high-quality and stylish designs. 
            Our mission is to provide an exceptional shopping experience.
            <br /><br />
            <strong>Follow Us On </strong> <br /><br />
            <a href="#" className="social-link"><FaFacebook /></a>
            <a href="#" className="social-link"><FaTiktok /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
          </p>
          </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
