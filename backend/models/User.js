const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
    customerId: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    address: {
        houseNo: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
    }
});

module.exports = mongoose.model('User', UserSchema);
