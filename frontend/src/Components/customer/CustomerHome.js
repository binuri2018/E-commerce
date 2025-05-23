import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ProductCard from './ProductCard'; 
import './CustomerHome.css';
import logo from "../../Assets/logo.png";
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa"; 
import { FaFacebook, FaTiktok, FaInstagram, FaTwitter } from "react-icons/fa"; 

const CustomerHome = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]); 
    const [popupMessage, setPopupMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    
    // Function to fetch updated products
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

    // Fetch products on component mount and when category changes
    useEffect(() => {
        fetchProducts();
    }, [category]);

    // Set up polling to refresh product data periodically
    useEffect(() => {
        const intervalId = setInterval(fetchProducts, 5000); // Refresh every 5 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setQuantity(1); // Reset quantity when opening popup
    };

    const handleClosePopup = () => {
        setSelectedProduct(null);
        setQuantity(1);
    };

    const handleAddToCart = async (product) => {
        try {
            if (!product || !product._id) {
                console.error("Invalid product data:", product);
                alert("Invalid product details. Please try again.");
                return;
            }
    
            const customerId = localStorage.getItem("customerId");
            if (!customerId) {
                console.error("User is not logged in!");
                alert("Please log in to add items to your cart.");
                return;
            }

            // Check if requested quantity is available
            if (quantity > product.stock) {
                alert("Requested quantity not available in stock!");
                return;
            }

            // Additional check for exact stock match
            if (quantity === product.stock) {
                if (!window.confirm(`This will add all remaining ${product.stock} items to your cart. Continue?`)) {
                    return;
                }
            }
    
            const requestData = {
                customerId,
                productId: product._id,
                quantity: quantity,
                price: product.price,
            };
    
            const response = await axios.post(
                "http://localhost:5000/api/cart/add-to-cart", 
                requestData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.data && response.data.updatedProduct) {
                const updatedProduct = response.data.updatedProduct;
                
                // Update local product stock with the updated product from backend
                setProducts(prevProducts => 
                    prevProducts.map(p => 
                        p._id === product._id 
                            ? { ...p, stock: updatedProduct.stock }
                            : p
                    )
                );

                // Update selected product if it's currently being viewed
                if (selectedProduct && selectedProduct._id === product._id) {
                    setSelectedProduct(prev => ({
                        ...prev,
                        stock: updatedProduct.stock
                    }));
                    
                    // If stock is now 0, close the popup after a short delay
                    if (updatedProduct.stock === 0) {
                        setTimeout(() => {
                            handleClosePopup();
                            alert("This item is now out of stock!");
                        }, 1000);
                    }
                }

                alert("Item added to cart!");
                handleClosePopup(); // Close popup after successful addition
            } else {
                // If we don't get updated product info, just update based on the quantity
                setProducts(prevProducts => 
                    prevProducts.map(p => 
                        p._id === product._id 
                            ? { ...p, stock: p.stock - quantity }
                            : p
                    )
                );

                if (selectedProduct && selectedProduct._id === product._id) {
                    const newStock = selectedProduct.stock - quantity;
                    setSelectedProduct(prev => ({
                        ...prev,
                        stock: newStock
                    }));
                    
                    if (newStock === 0) {
                        setTimeout(() => {
                            handleClosePopup();
                            alert("This item is now out of stock!");
                        }, 1000);
                    }
                }

                alert("Item added to cart!");
                handleClosePopup();
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert("Failed to add item to cart. Please try again.");
            }
        }
    };

    // Add this new function to handle quantity changes
    const handleQuantityChange = (newQuantity) => {
        if (!selectedProduct) return;
        
        if (newQuantity > selectedProduct.stock) {
            alert("Cannot add more than available stock!");
            return;
        }
        
        setQuantity(newQuantity);
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
                            <p style={{
                                color: selectedProduct.stock > 0 ? '#28a745' : '#dc3545',
                                fontWeight: 'bold',
                                margin: '10px 0'
                            }}>
                                {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </p>
                            <div className="quantity-control">
                                <button
                                    onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                                    className="quantity-button"
                                    disabled={selectedProduct.stock === 0}
                                >
                                    -
                                </button>
                                <span className="quantity">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(Math.min(selectedProduct.stock, quantity + 1))}
                                    className="quantity-button"
                                    disabled={selectedProduct.stock === 0 || quantity >= selectedProduct.stock}
                                >
                                    +
                                </button>
                            </div>
                            <div className="popup-buttons">
                                <button 
                                    className="add-to-cart-button" 
                                    onClick={() => handleAddToCart(selectedProduct)}
                                    disabled={selectedProduct.stock === 0}
                                >
                                    Add to Cart
                                </button>
                                <button 
                                    className="buy-now-button"
                                    disabled={selectedProduct.stock === 0}
                                >
                                    Buy Now
                                </button>
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
