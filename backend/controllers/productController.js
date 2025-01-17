const Product = require('../models/Product');
const fs = require('fs');

// Get all products or filter by category
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const products = category 
            ? await Product.find({ category }) 
            : await Product.find();
        
        const updatedProducts = products.map(product => ({
            ...product._doc,
            image: product.image ? `${req.protocol}://${req.get('host')}/${product.image}` : null,
        }));
        
        res.status(200).json(updatedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
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
        res.status(500).json({ message: 'Error fetching product', error });
    }
};

// Add a new product
const addProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    const image = req.file?.path;

    if (!name || !description || !price || !stock || !category || !image) {
        return res.status(400).json({ message: 'All fields are required, including an image.' });
    }

    try {
        const product = new Product({ name, description, price, stock, category, image });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error });
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;
    const image = req.file?.path;

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Delete the old image file if a new one is provided
        if (image && product.image) {
            fs.unlinkSync(product.image);
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.category = category || product.category;
        if (image) product.image = image;

        await product.save();
        res.status(200).json({
            ...product._doc,
            image: product.image ? `${req.protocol}://${req.get('host')}/${product.image}` : null,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
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
        res.status(500).json({ message: 'Error deleting product', error });
    }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };
