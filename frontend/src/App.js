import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Pages/Home';
import ProductForm from './Components/ProductForm';
import ProductTable from './Components/ProductTable';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/add-product" element={<ProductForm />} />
                <Route path="/products" element={<ProductTable />} />
            </Routes>
        </Router>
    );
};

export default App;
