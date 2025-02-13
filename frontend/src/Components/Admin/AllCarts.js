import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllCarts = () => {
    const [carts, setCarts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/cart")  
            .then(response => setCarts(response.data))
            .catch(error => console.error("Error fetching all carts:", error));
    }, []);

    return (
        <div>
            <h2>All Carts</h2>
            {carts.map(cart => (
                <div key={cart._id}>
                    <h3>Customer: {cart.customerId}</h3>
                    {cart.items.map(item => (
                        <p key={item.productId._id}>{item.productId.name} - {item.quantity} x Rs.{item.price}</p>
                    ))}
                    <h4>Subtotal: Rs.{cart.subtotal}</h4>
                </div>
            ))}
        </div>
    );
};
export default AllCarts;