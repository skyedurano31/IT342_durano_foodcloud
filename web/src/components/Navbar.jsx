// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
    const { user, logout } = useUser();
    const { cartCount } = useCart(user);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/products" style={styles.logo}>🛒 FoodCloud</Link>
                <div style={styles.links}>
                    <Link to="/products" style={styles.link}>Products</Link>
                    {user && (
                        <>
                            <Link to="/cart" style={styles.link}>
                                Cart ({cartCount})
                            </Link>
                            <Link to="/orders" style={styles.link}>Orders</Link>
                            <span style={styles.user}>Hi, {user.username}</span>
                            <button onClick={handleLogout} style={styles.logoutBtn}>
                                Logout
                            </button>
                        </>
                    )}
                    {!user && (
                        <>
                            <Link to="/login" style={styles.link}>Login</Link>
                            <Link to="/register" style={styles.link}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        background: '#2c3e50',
        padding: '15px 0',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    logo: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '20px',
        fontWeight: 'bold'
    },
    links: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        transition: 'opacity 0.3s'
    },
    user: {
        color: '#ecf0f1'
    },
    logoutBtn: {
        padding: '5px 10px',
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'opacity 0.3s'
    }
};

export default Navbar;