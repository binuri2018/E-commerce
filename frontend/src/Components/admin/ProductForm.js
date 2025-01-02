import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
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
        if (formData.imageFile) {
            newFormData.append('image', formData.imageFile);
        }

        try {
            await axios.post('http://localhost:5000/api/products/add', newFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Product added successfully!');
            navigate('/admin/products'); // Redirect to the product table
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Product</h2>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    name="name"
                    type="text"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="price">Price:</label>
                <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="stock">Stock:</label>
                <input
                    name="stock"
                    type="number"
                    placeholder="Stock Level"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    name="description"
                    placeholder="Product Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>
            <div>
                <label htmlFor="image">Image:</label>
                <input
                    name="image"
                    type="file"
                    onChange={handleFileChange}
                    required
                />
            </div>
            <button type="submit">Add Product</button>
        </form>
    );
};

export default ProductForm;
