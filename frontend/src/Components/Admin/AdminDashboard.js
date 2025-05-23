import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import AllCarts from './AllCarts';

const AdminDashboard = () => {
    return (
        <div>
            <Routes>
                <Route path="/products" element={<ProductTable />} />
                <Route path="/add-product" element={<ProductForm />} />
                <Route path="/allcarts" element={<AllCarts />} />
            </Routes>
        </div>
    );
};

export default AdminDashboard;
