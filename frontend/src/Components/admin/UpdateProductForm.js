import React, { useState } from 'react';
import axios from 'axios';

const UpdateProductForm = ({ product, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...product });
    const [imageFile, setImageFile] = useState(null); // To store the new image file if uploaded

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file); // Update the image file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();
        updatedData.append('name', formData.name);
        updatedData.append('price', formData.price);
        updatedData.append('stock', formData.stock);
        updatedData.append('description', formData.description);
        
        // If there is a new image, append it to the form data
        if (imageFile) {
            updatedData.append('image', imageFile);
        }

        try {
            await axios.put(`http://localhost:5000/api/products/${product._id}`, updatedData, {
                headers: { 'Content-Type': 'multipart/form-data' }, // Ensure proper content type for file uploads
            });
            onUpdate();
            onClose();
        } catch (error) {
            alert('Failed to update product');
        }
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleChange} 
                    required 
                />
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
                <button type="submit">Update</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateProductForm;
