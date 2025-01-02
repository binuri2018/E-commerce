const express = require('express');
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const multer = require('multer');

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'), // Upload directory
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname), // Unique file names
});

const upload = multer({ storage });

const router = express.Router();

// Routes
router.get('/', getProducts); // Fetch all products
router.post('/add', upload.single('image'), addProduct); // Add a new product

// Update a product by ID
router.put('/:id', upload.single('image'), (req, res, next) => {
    console.log('PUT request received for ID:', req.params.id); // Debugging log
    next(); // Proceed to the controller
}, updateProduct);

// Delete a product by ID
router.delete('/:id', (req, res, next) => {
    console.log('DELETE request received for ID:', req.params.id); // Debugging log
    next(); // Proceed to the controller
}, deleteProduct);

module.exports = router;
