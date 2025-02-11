import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyCart = () => {
    const [cart, setCart] = useState(null);
    const customerId = localStorage.getItem("customerId");


    useEffect(() => {
        console.log("🔍 Checking customerId:", customerId);
    
        if (!customerId) {
            console.error("❌ Customer ID is missing!");
            return;
        }
    
        axios.get(`http://localhost:5000/api/cart/customer/${customerId}`)
            .then(response => {
                console.log("Fetched cart data:", response.data);  // 🛠 Log full response
                setCart(response.data);
            })
            .catch(error => {
                console.error("Error fetching cart:", error);
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
            setCart(response.data);  // ✅ Update UI with latest cart
        }

        console.log("Cart updated successfully!", response.data);
    } catch (error) {
        console.error("Error removing item:", error);
    }
};


    return (
        <div>
            <h2>My Cart</h2>
            {cart?.items?.map(item => (
    <div key={item.productId?._id || item._id}>
        <p>
            {item.productId?.name ? item.productId.name : "Item name not available"} -  
            {item.quantity} x ${item.price}
        </p>
        <button onClick={() => handleRemove(item.productId?._id)}>Remove</button>
    </div>
))}


            <h3>Subtotal: ${cart?.subtotal}</h3>
        </div>
    );
};
export default MyCart;