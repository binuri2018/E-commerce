import React, { useState } from 'react';
import axios from 'axios';

const UpdateProductForm = ({ product, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...product });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/products/${product._id}`, formData);
            onUpdate();
            onClose();
        } catch (error) {
            alert('Failed to update product');
        }
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                <textarea name="description" value={formData.description} onChange={handleChange} required />
                <button type="submit">Update</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateProductForm;
