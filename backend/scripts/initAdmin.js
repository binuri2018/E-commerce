const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

const DEFAULT_ADMIN = {
    email: 'adminCC@gmail.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '0000000000',
    isAdmin: true,
    address: {
        houseNo: 'Admin',
        street: 'Admin Street',
        city: 'Admin City'
    }
};

const initializeAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

        // Create admin user
        const adminUser = new User({
            ...DEFAULT_ADMIN,
            password: hashedPassword,
            customerId: `ADMIN-${Date.now()}`
        });

        await adminUser.save();
        console.log('Default admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
        throw error; // Propagate the error to the server
    }
};

module.exports = { initializeAdmin }; 