import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerHome.css';

const CustomerHome = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="customer-home">
            <h2>Available Products</h2>
            <div className="product-cards">
                {products.map((product) => (
                    <div className="product-card" key={product._id}>
                        <img 
                            src={product.image ? `http://localhost:5000/uploads/${product.image}` : '/placeholder.jpg'} 
                            alt={product.name} 
                            className="product-image" 
                            onError={(e) => e.target.src = '/placeholder.jpg'}
                        />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                        <button className="buy-button">Buy Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerHome;
