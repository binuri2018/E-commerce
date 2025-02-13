const express = require('express');
const { signup, login, updateAddress } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/update-address/:customerId', updateAddress); 

module.exports = router;

