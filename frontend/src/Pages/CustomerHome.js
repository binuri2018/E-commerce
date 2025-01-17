import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../Components/customer/ProductCard'; // Ensure proper import
import './CustomerHome.css';

const CustomerHome = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

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

    const categories = ['All', 'Gens', 'Ladies', 'Kids', 'Other'];

    return (
        <div className="customer-home">
            <h2>Available Products</h2>
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
                            <button className="add-to-cart-button">Add to Cart</button>
                            <button className="buy-now-button">Buy Now</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerHome;
