import React, { useState } from 'react';
import axios from 'axios';

const UpdateProductForm = ({ product, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...product });
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();
        updatedData.append('name', formData.name);
        updatedData.append('price', formData.price);
        updatedData.append('stock', formData.stock);
        updatedData.append('description', formData.description);
        updatedData.append('category', formData.category); // Added category
        if (imageFile) {
            updatedData.append('image', imageFile);
        }

        try {
            await axios.put(`http://localhost:5000/api/products/${product._id}`, updatedData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onUpdate();
            onClose();
        } catch (error) {
            alert('Failed to update product');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2 className="form-title">Update Product</h2>
                <form onSubmit={handleSubmit} className="update-form">
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock">Stock:</label>
                        <input
                            type="number"
                            name="stock"
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
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="form-button">Update</button>
                        <button type="button" onClick={onClose} className="form-button cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductForm;
