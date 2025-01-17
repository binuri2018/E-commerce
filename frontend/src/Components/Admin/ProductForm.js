import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductForm.css';

const ProductForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
        category: '',
        imageFile: null,
    });
    const navigate = useNavigate();

    // Handles input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handles file input changes
    const handleFileChange = (e) => {
        setFormData({ ...formData, imageFile: e.target.files[0] });
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newFormData = new FormData();
        newFormData.append('name', formData.name);
        newFormData.append('price', formData.price);
        newFormData.append('stock', formData.stock);
        newFormData.append('description', formData.description);
        newFormData.append('category', formData.category);
        if (formData.imageFile) {
            newFormData.append('image', formData.imageFile);
        }

        try {
            console.log('Payload:', Object.fromEntries(newFormData.entries())); // Log payload for debugging
            await axios.post('http://localhost:5000/api/products/add', newFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Product added successfully!');
            navigate('/admin/products'); // Redirect to the product table
        } catch (error) {
            console.error('Error adding product:', error.response?.data || error.message);
            alert('Failed to add product. Check the console for details.');
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Add Product</h2>
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="stock">Stock:</label>
                    <input
                        name="stock"
                        type="number"
                        placeholder="Stock Level"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        name="description"
                        placeholder="Product Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="form-textarea"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="form-select"
                    >
                        <option value="">Select Category</option>
                        <option value="gens">Gens</option>
                        <option value="ladies">Ladies</option>
                        <option value="kids">Kids</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input
                        name="image"
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="form-button">
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
