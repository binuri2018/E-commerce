import React from 'react';

const ProductCard = ({ product, onProductClick }) => {
    const { name, price, description, stock, image } = product;

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
            <p>{description}</p>
            <p>Price: Rs.{price}</p>
            <p>In Stock: {stock}</p>
        </div>
    );
};

export default ProductCard;
