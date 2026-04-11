// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../hooks/useCart';
import axiosInstance from '../api/axiosConfig';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const { user } = useUser();
    const { addToCart, loading: cartLoading } = useCart(user);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            showMessage('Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    const handleAddToCart = async (productId, productName) => {
        if (!user) {
            showMessage('Please login first!', 'error');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
            return;
        }
        
        console.log('Adding to cart - User ID:', user.id, 'Product ID:', productId);
        
        const success = await addToCart(productId, 1);
        if (success) {
            showMessage(`${productName} added to cart!`, 'success');
        } else {
            showMessage('Failed to add to cart. Please try again.', 'error');
        }
    };

    if (loading) return <div style={styles.loading}>Loading products...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Our Products</h1>
            
            {message && (
                <div style={{
                    ...styles.message,
                    backgroundColor: messageType === 'success' ? '#4caf50' : '#f44336'
                }}>
                    {message}
                </div>
            )}
            
            {user && (
                <div style={styles.userInfo}>
                    Welcome, {user.username}! (ID: {user.id})
                </div>
            )}
            
            <div style={styles.grid}>
                {products.map(product => (
                    <div key={product.id} style={styles.card}>
                        <h3>{product.name}</h3>
                        <p>{product.description || 'Delicious food item'}</p>
                        <div style={styles.price}>₱{parseFloat(product.price).toFixed(2)}</div>
                        <button 
                            onClick={() => handleAddToCart(product.id, product.name)}
                            style={styles.button}
                            disabled={cartLoading}
                        >
                            {cartLoading ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
    title: { textAlign: 'center', marginBottom: '30px', color: '#333' },
    loading: { textAlign: 'center', padding: '50px', fontSize: '18px' },
    message: { color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' },
    userInfo: { textAlign: 'right', marginBottom: '20px', color: '#666' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    card: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    price: { fontSize: '24px', fontWeight: 'bold', color: '#e67e22', margin: '10px 0' },
    button: { width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }
};

export default Products;