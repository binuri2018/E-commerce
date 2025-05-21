const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

exports.signup = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with address
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            customerId: `CUST-${Date.now()}`,
            isAdmin: false // Explicitly set isAdmin to false for regular users
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { 
                userId: user._id,
                isAdmin: user.isAdmin,
                customerId: user.customerId
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ 
            token, 
            customerId: user.customerId,
            isAdmin: user.isAdmin,
            message: 'Login successful' 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        console.log('Admin login attempt:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Admin login failed: Missing credentials');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        console.log('Found user:', user ? 'yes' : 'no', 'isAdmin:', user?.isAdmin);
        
        if (!user || !user.isAdmin) {
            console.log('Admin login failed: Invalid credentials or not admin');
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        
        if (!isMatch) {
            console.log('Admin login failed: Invalid password');
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const token = jwt.sign(
            { 
                userId: user._id,
                isAdmin: true,
                customerId: user.customerId
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        console.log('Admin login successful');
        res.json({ 
            token, 
            customerId: user.customerId,
            isAdmin: true,
            message: 'Admin login successful' 
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ 
            message: 'Error logging in as admin',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update Address
exports.updateAddress = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { houseNo, street, city } = req.body;

        const user = await User.findOneAndUpdate(
            { customerId },
            { address: {  houseNo, street, city } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Address updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating address', error });
    }
};
