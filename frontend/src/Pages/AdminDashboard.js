import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProductTable from '../Components/Admin/ProductTable';
import ProductForm from '../Components/Admin/ProductForm';

const AdminDashboard = () => {
    return (
        <div>
            <nav>
                <Link to="products">Manage Products</Link>
                <Link to="add-product">Add Product</Link>
            </nav>
            <Routes>
                <Route path="/products" element={<ProductTable />} />
                <Route path="/add-product" element={<ProductForm />} />
            </Routes>
        </div>
    );
};

export default AdminDashboard;
