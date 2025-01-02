const Product = require('../models/Product');
const fs = require('fs');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const updatedProducts = products.map(product => ({
            ...product._doc,
            image: product.image ? `${req.protocol}://${req.get('host')}/${product.image}` : null,
        }));
        res.status(200).json(updatedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = {
            ...product._doc,
            image: product.image ? `${req.protocol}://${req.get('host')}/${product.image}` : null,
        };
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add a product
const addProduct = async (req, res) => {
    const { name, price, stock, description } = req.body;
    const image = req.file ? req.file.path : null; // Path of uploaded image

    if (!name || !price || !stock || !description || !image) {
        return res.status(400).json({ message: 'All fields are required, including an image.' });
    }

    try {
        const product = await Product.create({ name, price, stock, description, image });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, stock, description } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Delete the old image file if a new one is provided
        if (image && product.image) {
            fs.unlinkSync(product.image); // Remove the old image file
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.description = description || product.description;
        if (image) product.image = image;

        await product.save();
        res.status(200).json({
            ...product._doc,
            image: product.image ? `${req.protocol}://${req.get('host')}/${product.image}` : null,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete the associated image file
        if (product.image) {
            fs.unlinkSync(product.image);
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };
