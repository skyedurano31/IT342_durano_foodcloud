// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { useCart } from '../features/cart/useCart';

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
                <Link 
                    to={user?.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard'} 
                    style={styles.logo}
                >
                    <img 
                        src="/images/logo.png"  // Put your image in public/images/
                        alt="FoodCloud Logo"
                        style={styles.logoImage}
                    />
                    <span style={styles.logoText}>FoodCloud</span>
                </Link>
                <div style={styles.links}>
                    {user?.role === 'ROLE_ADMIN' ? (
                        <>
                            <Link to="/admin" style={styles.link}>Dashboard</Link>
                            <span style={styles.user}>👤 {user.username} (Admin)</span>
                            <button onClick={handleLogout} style={styles.logoutBtn}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        background: '#ffffff',
        padding: '12px 0',
        color: '#333',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #f0f0f0'
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
        color: '#2c3e50',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: '600',
        letterSpacing: '0.5px'
    },
    links: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    link: {
        color: '#555',
        textDecoration: 'none',
        fontSize: '14px',
        transition: 'color 0.2s',
        ':hover': {
            color: '#007bff'
        }
    },
    user: {
        color: '#black',
        fontSize: '13px'
    },
    logoutBtn: {
        padding: '6px 14px',
        background: '#f5f5f5',
        color: '#555',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s',
        ':hover': {
            background: '#eee'
        }
    },
    logoImage: {
    width: '30px',
    height: '30px',
    marginRight: '8px',
    verticalAlign: 'middle'
},
logoText: {
    verticalAlign: 'middle'
}
};

export default Navbar;