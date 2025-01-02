const ProductCard = ({ product }) => {
    const { name, price, description, stock, image } = product;

    return (
        <div className="product-card">
            <img 
                src={`http://localhost:5000/uploads/${image}`} 
                alt={name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            <h3>{name}</h3>
            <p>{description}</p>
            <p>Price: ${price}</p>
            <p>In Stock: {stock}</p>
            <button disabled={stock === 0}>Add to Cart</button>
        </div>
    );
};

export default ProductCard;
