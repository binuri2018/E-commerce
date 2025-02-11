import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProductTable from '../Components/Admin/ProductTable';
import ProductForm from '../Components/Admin/ProductForm';
import AllCarts from '../Components/Admin/AllCarts';

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
