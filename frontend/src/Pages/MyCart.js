import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import logo from "../Assets/logo.png";
import "./MyCart.css";
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa"; 
import { FaFacebook, FaTiktok, FaInstagram, FaTwitter } from "react-icons/fa"; 

const MyCart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const customerId = localStorage.getItem("customerId");
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        console.log("Checking customerId:", customerId);

        if (!customerId) {
            console.error("Customer ID is missing!");
            setLoading(false);
            return;
        }

        axios.get(`http://localhost:5000/api/cart/customer/${customerId}`)
            .then(response => {
                console.log("Fetched cart data:", response.data);
                setCart(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching cart:", error);
                setLoading(false);
            });
    }, [customerId]);

    const handleRemove = async (productId) => {
        try {
            console.log("Removing item with Product ID:", productId);

            const response = await axios.delete(`http://localhost:5000/api/cart/${customerId}/${productId}`);

            if (response.data.message === 'Cart deleted as it was empty') {
                console.log("Cart is now empty. Clearing from UI.");
                setCart(null);
            } else {
                setCart(response.data);  
            }

            console.log("Cart updated successfully!", response.data);
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // Filter cart items by search query
    const filteredProducts = cart?.items?.filter(item =>
        item.productId?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
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

            <div className="cartcontent">
                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="loading-message">Loading cart...</div>
                ) : !cart ? (
                    <div className="empty-cart-message">Your cart is empty</div>
                ) : (
                    <>
                        <div className="cart-items">
                            {filteredProducts?.map(item => (
                                <div key={item.productId?._id || item._id} className="cart-row">
                                    <span className="item-name">
                                        {item.productId?.name ? item.productId.name : "Item name not available"}
                                    </span>
                                    <span className="item-quantity">
                                        {item.quantity}
                                    </span>
                                    <span className="item-price">
                                        Rs.{item.price}
                                    </span>
                                    <button className="remove-button" onClick={() => handleRemove(item.productId?._id)}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div className="cart-subtotal">
                            <h3>Subtotal: Rs.{cart?.subtotal || 0}</h3>
                        </div>
                    </>
                )}
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

export default MyCart;
