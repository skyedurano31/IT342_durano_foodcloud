// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

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