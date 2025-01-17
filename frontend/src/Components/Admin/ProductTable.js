import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable';
import UpdateProductForm from './UpdateProductForm';
import './ProductTable.css';

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
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                setProducts(products.filter((product) => product._id !== id));
            } catch (error) {
                alert('Failed to delete product');
            }
        }
    };

    const generateReport = () => {
        const doc = new jsPDF();
        doc.text('Products Report', 10, 10);

        const tableColumn = ['Name', 'Price', 'Stock', 'Description', 'Category'];
        const tableRows = [];

        products.forEach((product) => {
            const productData = [
                product.name,
                product.price,
                product.stock,
                product.description,
                product.category,
            ];
            tableRows.push(productData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
        });

        doc.save('products_report.pdf');
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="product-table-container">
            <h2 className="table-title">Products</h2>
            <div className="button-container">
                <button className="add-product-btn" onClick={() => navigate('/admin/add-product')}>
                    Add Product
                </button>
                <button className="generate-report-btn" onClick={generateReport}>
                    Generate Report
                </button>
            </div>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>
                                <img src={product.image} alt={product.name} className="product-image" />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td>
                                <button
                                    className="action-btn update-btn"
                                    onClick={() => setEditingProduct(product)}
                                >
                                    Update
                                </button>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => deleteProduct(product._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingProduct && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <UpdateProductForm
                            product={editingProduct}
                            onClose={() => setEditingProduct(null)}
                            onUpdate={fetchProducts}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
