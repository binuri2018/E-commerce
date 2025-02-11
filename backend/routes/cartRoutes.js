const express = require('express');
const router = express.Router();
const { addToCart, getCartByCustomerId,getAllCarts,removeItem } = require('../controllers/cartController'); 

// POST route for adding an item to the cart
router.post('/add-to-cart', addToCart);

// GET route to fetch the customer's cart
router.get('/customer/:customerId', getCartByCustomerId);

// Route for fetching all carts (Admin Side)
router.get("/", getAllCarts);

// DELETE route to remove an item from the cart
router.delete('/:customerId/:productId', removeItem);

module.exports = router;
