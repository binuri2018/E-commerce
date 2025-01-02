import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UpdateProductForm from './UpdateProductForm';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/products');
            setProducts(data);
        } catch (error) {
            alert('Failed to fetch products');
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            setProducts(products.filter((product) => product._id !== id));
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <h2>Products</h2>
            <button onClick={() => navigate('/admin/add-product')}>Add Product</button>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>
                                <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.description}</td>
                            <td>
                                <button onClick={() => setEditingProduct(product)}>Update</button>
                                <button onClick={() => deleteProduct(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingProduct && (
                <UpdateProductForm
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={fetchProducts}
                />
            )}
        </div>
    );
};

export default ProductTable;
