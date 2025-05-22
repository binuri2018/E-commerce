import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import logo from "../Assets/logo.png";
import "./MyCart.css";
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaTrashAlt, FaHeart } from "react-icons/fa";
import { FaFacebook, FaTiktok, FaInstagram, FaTwitter } from "react-icons/fa"; 

const MyCart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const customerId = localStorage.getItem("customerId");
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(250);

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

    const handleQuantityChange = async (itemId, change) => {
        console.log(`Quantity change for item ${itemId}: ${change}`);
        
        const itemToUpdate = cart?.items?.find(item => (item.productId?._id || item._id) === itemId);
        
        if (!itemToUpdate) {
            console.error("Item not found in cart:", itemId);
            return;
        }

        const newQuantity = itemToUpdate.quantity + change;

        // Prevent quantity from going below 1
        if (newQuantity < 1) {
            console.log("Cannot set quantity below 1");
            return;
        }

        try {
            // TODO: Implement API call to update item quantity on the backend
            // Example API call (replace with your actual endpoint and method):
            // const response = await axios.put(`http://localhost:5000/api/cart/${customerId}/item/${itemId}`, {
            //     quantity: newQuantity
            // });

            // TODO: Update the local cart state with the response from the backend
            // Assuming the backend returns the updated cart object:
            // setCart(response.data);

            // For demonstration purposes, manually update the state until backend is implemented
            const updatedCartItems = cart.items.map(item => 
                (item.productId?._id || item._id) === itemId ? { ...item, quantity: newQuantity, price: (item.price / item.quantity) * newQuantity } : item
            );

            const newSubtotal = updatedCartItems.reduce((sum, item) => sum + (item.price), 0);

            setCart({
                 ...cart,
                 items: updatedCartItems,
                 subtotal: newSubtotal // Assuming subtotal is calculated based on updated items
             });

            console.log("Quantity updated (frontend only). New quantity:", newQuantity);

        } catch (error) {
            console.error("Error updating item quantity:", error);
            // Handle error, e.g., show an error message to the user
        }
    };

    const subtotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

    const totalAmount = subtotal + deliveryFee;

    const filteredProducts = cart?.items?.filter(item =>
        item.productId?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleProceedToCheckout = () => {
        console.log("Proceeding to checkout...");
    };

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

            <div className="cart-container">
                <div className="cart-items-section">
                    {loading ? (
                        <div className="loading-message">Loading cart...</div>
                    ) : !cart || !cart.items || cart.items.length === 0 ? (
                        <div className="empty-cart-message">Your cart is empty</div>
                    ) : (
                        <div className="cart-items">
                            {filteredProducts?.map(item => (
                                <div key={item.productId?._id || item._id} className="cart-row">
                                    <div className="item-details">
                                        <div className="item-info-text">
                                            <span className="item-name">
                                                {item.productId?.name ? item.productId.name : "Item name not available"}
                                            </span>
                                             {item.productId?.originalPrice && item.productId?.discountPercentage && (
                                                <div className="price-discount">
                                                    <span className="original-price">Rs.{item.productId.originalPrice}</span>
                                                    <span className="discount">-{item.productId.discountPercentage}%</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <span className="item-price">Rs.{item.price}</span>
                                         <div className="quantity-controls">
                                             <button onClick={() => handleQuantityChange(item.productId?._id || item._id, -1)}>-</button>
                                             <span>{item.quantity}</span>
                                             <button onClick={() => handleQuantityChange(item.productId?._id || item._id, 1)}>+</button>
                                         </div>
                                         <div className="item-icons">
                                             <FaTrashAlt className="delete-icon" onClick={() => handleRemove(item.productId?._id || item._id)} />
                                         </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="checkout-summary">
                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal ({cart?.items?.length || 0} Items)</span>
                            <span>Rs.{subtotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping Fee</span>
                            <span>Rs.{deliveryFee}</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>Rs.{totalAmount}</span>
                        </div>
                    </div>

                    <button className="proceed-to-checkout-button" onClick={handleProceedToCheckout}>
                        PROCEED TO CHECKOUT({cart?.items?.length || 0})
                    </button>
                </div>
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
