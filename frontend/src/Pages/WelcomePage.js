import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";
import logo from "../Assets/logo.png";
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            title: 'Welcome to Our Fashion Store',
            subtitle: 'Discover the latest trends in fashion'
        },
        {
            image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            title: 'Summer Collection 2024',
            subtitle: 'New arrivals for the season'
        },
        {
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            title: 'Exclusive Deals',
            subtitle: 'Shop now and save up to 50%'
        },
        {
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            title: 'Premium Quality',
            subtitle: 'Experience luxury fashion'
        }
    ];

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products?limit=4');
                setFeaturedProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching featured products:', error);
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 10000); // Change slide every 15 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="welcome-page">
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

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-slideshow">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                            style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${slide.image})`
                            }}
                        >
                            <div className="hero-content">
                                <h1>{slide.title}</h1>
                                <p>{slide.subtitle}</p>
                                <Link to="/login" className="cta-button">
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                    ))}
                    <div className="slide-indicators">
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <h2>Shop by Category</h2>
                <div className="category-grid">
                    <div className="category-card" onClick={() => navigate("/signup")}>
                        <div className="category-image men"></div>
                        <h3>Men's Collection</h3>
                    </div>
                    <div className="category-card" onClick={() => navigate("/signup")}>
                        <div className="category-image women"></div>
                        <h3>Women's Collection</h3>
                    </div>
                    <div className="category-card" onClick={() => navigate("/signup")}>
                        <div className="category-image accessories"></div>
                        <h3>Accessories</h3>
                    </div>
                    <div className="category-card" onClick={() => navigate("/signup")}>
                        <div className="category-image sale"></div>
                        <h3>Sale Items</h3>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-section">
                <h2>Featured Products</h2>
                <div className="featured-grid">
                    {loading ? (
                        <div className="loading">Loading featured products...</div>
                    ) : (
                        featuredProducts.map((product) => (
                            <div key={product._id} className="product-card" onClick={() => navigate("/signup")}>
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="price">${product.price}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Special Offer Section */}
            <section className="offer-section">
                <div className="offer-content">
                    <h2>Special Offer</h2>
                    <p>Get 20% off on your first purchase</p>
                    <button onClick={() => navigate("/signup")} className="offer-button">
                        Sign Up Now
                    </button>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="about-content">
                    <h2>About Us</h2>
                    <p>We are passionate about bringing you the latest fashion trends at affordable prices. Our mission is to make everyone feel confident and stylish in their own skin.</p>
                    <div className="about-features">
                        <div className="feature">
                            <h3>Quality Products</h3>
                            <p>Carefully selected materials and craftsmanship</p>
                        </div>
                        <div className="feature">
                            <h3>Fast Delivery</h3>
                            <p>Quick and reliable shipping nationwide</p>
                        </div>
                        <div className="feature">
                            <h3>Easy Returns</h3>
                            <p>30-day hassle-free return policy</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <p><FaPhone /> +1 234 567 890</p>
                        <p><FaEnvelope /> support@fashionstore.com</p>
                        <p><FaMapMarkerAlt /> 123 Fashion Street, City, Country</p>
                    </div>
                    <div className="footer-section">
                        <h3>Follow Us</h3>
                        <div className="social-links">
                            <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li onClick={() => navigate("/signup")}>Shop Now</li>
                            <li onClick={() => navigate("/signup")}>New Arrivals</li>
                            <li onClick={() => navigate("/signup")}>Special Offers</li>
                            <li onClick={() => navigate("/signup")}>Contact Us</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Fashion Store. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default WelcomePage;
