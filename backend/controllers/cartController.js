const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart
const addToCart = async (req, res) => {
    try {
        console.log("Received add-to-cart request:", req.body);

        const { customerId, productId, quantity, price } = req.body;

        if (!customerId || !productId || !quantity || !price) {
            console.log("Missing required fields:", req.body);
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check and update product stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        // Update product stock
        product.stock -= quantity;
        await product.save();

        let cart = await Cart.findOne({ customerId });

        if (!cart) {
            cart = new Cart({
                customerId,
                items: [{ productId, quantity, price }],
            });
        } else {
            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity, price });
            }
        }

        // Calculate subtotal
        cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        await cart.save();
        console.log("Cart updated successfully:", cart);
        res.status(200).json({ 
            message: 'Item added to cart successfully', 
            cart,
            updatedProduct: product // Send back the updated product info
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Get customer cart
const getCartByCustomerId = async (req, res) => {
    try {
        console.log("📩 Received request:", req.params);

        const cart = await Cart.findOne({ customerId: req.params.customerId })
            .populate("items.productId", "name price");

        if (!cart) {
            console.log("❌ No cart found for:", req.params.customerId);
            return res.status(404).json({ message: "Cart not found" });
        }

        // ✅ Recalculate subtotal before sending response
        cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        res.status(200).json(cart);
    } catch (error) {
        console.error("🔴 Error fetching cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// ✅ Route for fetching all carts (Admin Side)
const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate("items.productId");

        // ✅ Ensure each cart has a subtotal
        carts.forEach(cart => {
            cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        });

        res.json(carts);
    } catch (error) {
        console.error("Error fetching all carts:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// Remove item from cart
const removeItem = async (req, res) => {
    const { customerId, productId } = req.params;

    try {
        console.log(`Removing product ${productId} from cart of customer ${customerId}`);

        // ✅ Find the cart and populate product details
        const cart = await Cart.findOne({ customerId }).populate("items.productId");

        if (!cart) {
            console.log("❌ Cart not found for customer:", customerId);
            return res.status(404).json({ message: 'Cart not found' });
        }

        // ✅ Filter out the item using `.toString()` to match product IDs correctly
        const updatedItems = cart.items.filter(item => item.productId._id.toString() !== productId);

        if (updatedItems.length === cart.items.length) {
            console.log("❌ Item not found in cart.");
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // ✅ If no items are left, delete the entire cart
        if (updatedItems.length === 0) {
            await Cart.deleteOne({ customerId });
            console.log("🗑️ Cart deleted as it was empty");
            return res.status(200).json({ message: 'Cart deleted as it was empty' });
        }

        // ✅ Update the cart
        cart.items = updatedItems;
        cart.subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0); // Recalculate subtotal

        await cart.save();
        console.log("✅ Item removed successfully. Updated cart:", cart);
        res.status(200).json(cart);

    } catch (error) {
        console.error("❌ Error removing item:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};




// Export functions
module.exports = {
    addToCart,
    getCartByCustomerId,
    getAllCarts,
    removeItem
};
