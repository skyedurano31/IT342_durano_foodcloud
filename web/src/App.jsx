// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './shared/UserContext';
import Navbar from './shared/Navbar';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Homepage from './features/home/Homepage';
import Products from './features/products/Products';
import ProductDetails from './features/products/ProductDetails';
import Cart from './features/cart/Cart';
import Checkout from './features/checkout/Checkout';
import Orders from './features/orders/Orders';
import AdminDashboard from './features/admin/AdminDashboard';

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </BrowserRouter>
    );
}

function AppContent() {
    const { user, loading } = useUser();
    
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }
    
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    user ? (
                        user.role === 'ROLE_ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
                    ) : (
                        <Navigate to="/login" />
                    )
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={user && user.role !== 'ROLE_ADMIN' ? <Homepage /> : <Navigate to="/login" />} />
                <Route path="/admin" element={user && user.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
                <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
                <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
            </Routes>
        </>
    );
}

export default App;