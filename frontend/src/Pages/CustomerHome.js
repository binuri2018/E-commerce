import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../Components/customer/ProductCard'; // Ensure proper import
import './CustomerHome.css';

const CustomerHome = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]); // State to hold the cart items
    const [popupMessage, setPopupMessage] = useState('');
    
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
                console.error("❌ Invalid product data:", product);
                alert("Invalid product details. Please try again.");
                return;
            }
    
            const customerId = localStorage.getItem("customerId");
            if (!customerId) {
                console.error("❌ User is not logged in!");
                alert("Please log in to add items to your cart.");
                return;
            }
    
            const requestData = {
                customerId,
                productId: product._id, // Ensure this matches backend expectations
                quantity: 1,
                price: product.price,
            };
    
            console.log("📤 Sending request:", requestData);
    
            const response = await axios.post("http://localhost:5000/api/cart/add-to-cart", requestData, {
                headers: { "Content-Type": "application/json" },
            });
    
            console.log("✅ Item added to cart:", response.data);
            alert("Item added to cart!");
        } catch (error) {
            console.error("❌ Add to cart failed:", error.response ? error.response.data : error.message);
            alert("Failed to add item to cart.");
        }
    };
    
    
    const categories = ['All', 'Gens', 'Ladies', 'Kids', 'Other'];

    return (
        <div className="customer-home">
            <h2>Available Products</h2>
            <Link to="/mycart">My Cart</Link>
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
            <div className="product-cards">
                {products.map((product) => (
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

            {/* Display popup message */}
            {popupMessage && <div className="popup">{popupMessage}</div>}
        </div>
    );
};

export default CustomerHome;
