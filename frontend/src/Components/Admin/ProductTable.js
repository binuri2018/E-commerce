import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable';
import UpdateProductForm from './UpdateProductForm';
import './ProductTable.css';
import logo from '../../Assets/logo.png'; // Import the logo

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

        const themeColor = [85, 17, 51]; // #551133 in RGB

        // Add colored background for logo
        doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F'); // Draw a filled rectangle across the top

        // Add Logo on top of the background
        const imgData = logo;
        doc.addImage(imgData, 'PNG', 15, 5, 50, 30); // Increased width and adjusted position

        // Add title below the colored background
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255); // White text for title on dark background
        doc.text('Products Report', 105, 30, { align: 'center' }); // Adjust position below background

        // Reset text color for table content
        doc.setTextColor(0, 0, 0);

        const tableColumn = ['Name', 'Price', 'Stock', 'Description', 'Category'];
        const tableRows = [];

        products.forEach((product) => {
            const productData = [
                product.name,
                `Rs.${product.price}`,
                product.stock,
                product.description,
                product.category,
            ];
            tableRows.push(productData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50, // Adjust start position below title
            headStyles: { fillColor: themeColor, fontStyle: 'bold' }, // Apply theme color, make bold
            bodyStyles: { fontSize: 10 }, // Smaller font size for body
            alternateRowStyles: { fillColor: [240, 240, 240] }, // Alternate row color
            styles: { cellPadding: 3 }, // Add cell padding
            columnStyles: {
                1: { cellWidth: 20 }, // Adjust width for Price
                2: { cellWidth: 15 }, // Adjust width for Stock
                 // You might need to adjust other column widths based on your data
            }
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
                {/* All Carts Button */}
                <button className="all-carts-btn" onClick={() => navigate('/admin/allcarts')}>
                    All Carts
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
