const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    subtotal: { type: Number, default: 0 },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
