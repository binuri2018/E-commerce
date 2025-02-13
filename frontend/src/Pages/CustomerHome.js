import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ProductCard from '../Components/customer/ProductCard'; 
import './CustomerHome.css';
import logo from "../Assets/logo.png";
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa"; 
import { FaFacebook, FaTiktok, FaInstagram, FaTwitter } from "react-icons/fa"; 

const CustomerHome = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]); 
    const [popupMessage, setPopupMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');  // State for search query
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/products${category ? `?category=${category}` : ''}`
                );
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [category]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleClosePopup = () => {
        setSelectedProduct(null);
        setQuantity(1);
    };

    const handleAddToCart = async (product) => {
        try {
            if (!product || !product._id) {
                console.error(" Invalid product data:", product);
                alert("Invalid product details. Please try again.");
                return;
            }
    
            const customerId = localStorage.getItem("customerId");
            if (!customerId) {
                console.error(" User is not logged in!");
                alert("Please log in to add items to your cart.");
                return;
            }
    
            const requestData = {
                customerId,
                productId: product._id,
                quantity: 1,
                price: product.price,
            };
    
            const response = await axios.post("http://localhost:5000/api/cart/add-to-cart", requestData, {
                headers: { "Content-Type": "application/json" },
            });
    
            alert("Item added to cart!");
        } catch (error) {
            alert("Failed to add item to cart.");
        }
    };

    const categories = ['All', 'Gens', 'Ladies', 'Kids', 'Other'];

    // Filter products by search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="customer-home">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="nav-left">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <div className="nav-right">
                    <button onClick={() => navigate("/mycart")} className="nav-button mycart-btn">
                        My Cart
                    </button>
                    <button onClick={() => navigate("/profile")} className="nav-button profile-btn">
                        My Profile
                    </button>
                </div>
            </nav>

            <div className='CHcontent'>
                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category List */}
                <div className="category-list">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className={`category-item ${category === cat.toLowerCase() ? 'active' : ''}`}
                            onClick={() => setCategory(cat === 'All' ? '' : cat.toLowerCase())}
                        >
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Product Cards */}
                <div className="product-cards">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onProductClick={handleProductClick}
                        />
                    ))}
                </div>

                {selectedProduct && (
                    <div
                        className="product-popup"
                        onClick={(e) => {
                            if (e.target.className === 'product-popup') {
                                handleClosePopup();
                            }
                        }}
                    >
                        <div className="popup-content">
                            <button className="close-popup" onClick={handleClosePopup}>
                                &times;
                            </button>
                            <img
                                src={
                                    selectedProduct.image.startsWith('http')
                                        ? selectedProduct.image
                                        : `http://localhost:5000/uploads/${selectedProduct.image}`
                                }
                                alt={selectedProduct.name}
                                className="popup-image"
                            />
                            <h3>{selectedProduct.name}</h3>
                            <p>{selectedProduct.description}</p>
                            <p>Price: Rs.{selectedProduct.price}</p>
                            <p>In Stock: {selectedProduct.stock}</p>
                            <div className="quantity-control">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="quantity-button"
                                >
                                    -
                                </button>
                                <span className="quantity">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="quantity-button"
                                >
                                    +
                                </button>
                            </div>
                            <div className="popup-buttons">
                                <button className="add-to-cart-button" onClick={() => handleAddToCart(selectedProduct)}>
                                    Add to Cart
                                </button>
                                <button className="buy-now-button">Buy Now</button>
                            </div>
                        </div>
                    </div>
                )}

                
                {popupMessage && <div className="popup">{popupMessage}</div>}
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-left">
                    <p><strong>Contact Us</strong><br /></p>
                    <p><FaPhone className="footer-icon" /> +94 234 500 800</p>
                    <p><FaMapMarkerAlt className="footer-icon" /> 123 Fashion St, Colombo, SL</p>
                    <p><FaEnvelope className="footer-icon" /> @crystalchandelier.com</p>
                </div>
                <div className="footer-right">
                    <p><strong>About Us</strong> <br /><br />
                        Welcome to Crystal Chandelier, your go-to fashion destination.
                        We bring you the latest trends with high-quality and stylish designs.
                        Our mission is to provide an exceptional shopping experience.
                        <br /><br /><br />
                    <strong>Follow Us On</strong><br /><br />
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

export default CustomerHome;
