import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductForm from '../Components/ProductForm';
import ProductTable from '../Components/ProductTable';

const Products = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProductTable />} />
                <Route path="/add-product" element={<ProductForm />} />
            </Routes>
        </Router>
    );
};

export default Products;