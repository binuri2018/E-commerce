const express = require('express');
const { signup, login, adminLogin, updateAddress } = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/admin/login', adminLogin);

// Protected routes
router.put('/update-address', auth, updateAddress);

module.exports = router;

