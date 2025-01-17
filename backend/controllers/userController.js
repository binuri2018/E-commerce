const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Signup
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        console.log('Received data:', req.body); // Log incoming request data

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({ name, email, password });
        console.log('User created:', user); // Log the created user

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error.message); // Log the error
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        console.log('Received data:', req.body); // Log incoming data

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error.message); // Log the full error message
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};
module.exports = { registerUser, loginUser };
