import React from 'react';

const ProductCard = ({ product, onProductClick }) => {
    const { name, price, stock, image } = product;

    return (
        <div
            className="product-card"
            onClick={() => onProductClick(product)} // Trigger popup with product details
            style={{ cursor: 'pointer' }}
        >
            <img
                src={
                    image.startsWith('http')
                        ? image
                        : `http://localhost:5000/uploads/${image}`
                }
                alt={name}
                style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                }}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
                }}
            />
            <h3>{name}</h3>
            <p>Price: Rs.{price}</p>
            <p style={{
                color: stock > 0 ? '#28a745' : '#dc3545',
                fontWeight: 'bold',
                margin: '5px 0'
            }}>
                {stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
        </div>
    );
};

export default ProductCard;
