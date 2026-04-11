// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../hooks/useCart';
import axiosInstance from '../api/axiosConfig';

const Checkout = () => {
    const { user } = useUser();
    const { cart, clearCart, fetchCart } = useCart(user);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({
        building: '',
        roomNumber: '',
        phoneNumber: '',
        deliveryInstructions: ''
    });

    // Check if cart exists and has items
    useEffect(() => {
        if (user && !cart) {
            fetchCart();
        }
    }, [user, cart, fetchCart]);

    if (!user) {
        navigate('/login');
        return null;
    }

    const hasItems = cart && cart.items && cart.items.length > 0;
    
    if (!hasItems && !loading) {
        return (
            <div style={styles.empty}>
                <h2>Your cart is empty</h2>
                <p>Add items to your cart before checking out</p>
                <button onClick={() => navigate('/products')} style={styles.shopBtn}>
                    Browse Products
                </button>
            </div>
        );
    }

    const subtotal = cart?.items?.reduce((sum, item) => {
        const unitPrice = parseFloat(item.unitPrice) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (unitPrice * quantity);
    }, 0) || 0;
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!form.building.trim()) {
            setError('Building is required');
            return;
        }
        if (!form.roomNumber.trim()) {
            setError('Room number is required');
            return;
        }
        if (!form.phoneNumber.trim()) {
            setError('Phone number is required');
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const orderData = {
                userId: user.id,
                building: form.building,
                roomNumber: form.roomNumber,
                deliveryInstructions: form.deliveryInstructions || '',
                phoneNumber: form.phoneNumber
            };
            
            console.log('Placing order:', orderData);
            
            const response = await axiosInstance.post('/api/orders/checkout', orderData);
            
            console.log('Order placed successfully:', response.data);
            
            setSuccess('Order placed successfully! Redirecting...');
            
            // Clear the cart
            await clearCart();
            
            // Redirect to orders page after 2 seconds
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
            
        } catch (error) {
            console.error('Checkout error:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to place order. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Checkout</h1>
            
            {error && (
                <div style={styles.error}>
                    ❌ {error}
                </div>
            )}
            
            {success && (
                <div style={styles.success}>
                    ✅ {success}
                </div>
            )}
            
            <div style={styles.content}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <h2 style={styles.sectionTitle}>Delivery Information</h2>
                    
                    <div style={styles.formGroup}>
                        <label>Building *</label>
                        <input
                            type="text"
                            name="building"
                            value={form.building}
                            onChange={handleChange}
                            placeholder="e.g., Building A, Dormitory Name"
                            style={styles.input}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label>Room Number *</label>
                        <input
                            type="text"
                            name="roomNumber"
                            value={form.roomNumber}
                            onChange={handleChange}
                            placeholder="e.g., 301, Room 12"
                            style={styles.input}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label>Phone Number *</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            placeholder="e.g., 09123456789"
                            style={styles.input}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label>Delivery Instructions (Optional)</label>
                        <textarea
                            name="deliveryInstructions"
                            value={form.deliveryInstructions}
                            onChange={handleChange}
                            placeholder="e.g., Gate 2, near the fountain, call when arrived..."
                            rows="3"
                            style={styles.textarea}
                            disabled={loading}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        style={styles.placeOrderBtn}
                        disabled={loading}
                    >
                        {loading ? 'Placing Order...' : `Place Order (₱${total.toFixed(2)})`}
                    </button>
                </form>
                
                <div style={styles.summary}>
                    <h2 style={styles.summaryTitle}>Order Summary</h2>
                    
                    {cart?.items?.map(item => {
                        const unitPrice = parseFloat(item.unitPrice) || 0;
                        const quantity = parseInt(item.quantity) || 0;
                        const itemTotal = unitPrice * quantity;
                        
                        return (
                            <div key={item.id} style={styles.summaryItem}>
                                <div style={styles.summaryItemInfo}>
                                    <span style={styles.summaryItemName}>{item.productName}</span>
                                    <span style={styles.summaryItemQty}>x{quantity}</span>
                                </div>
                                <span style={styles.summaryItemPrice}>₱{itemTotal.toFixed(2)}</span>
                            </div>
                        );
                    })}
                    
                    <div style={styles.divider}></div>
                    
                    <div style={styles.summaryRow}>
                        <span>Subtotal:</span>
                        <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div style={styles.summaryRow}>
                        <span>Tax (10%):</span>
                        <span>₱{tax.toFixed(2)}</span>
                    </div>
                    
                    <div style={styles.totalRow}>
                        <span>Total:</span>
                        <span style={styles.totalAmount}>₱{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        minHeight: 'calc(100vh - 80px)'
    },
    title: {
        marginBottom: '30px',
        color: '#333',
        fontSize: '28px'
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb'
    },
    success: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '12px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #c3e6cb'
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '30px'
    },
    form: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
        marginTop: 0,
        marginBottom: '20px',
        color: '#333',
        fontSize: '18px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        marginTop: '5px'
    },
    textarea: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        fontFamily: 'inherit',
        marginTop: '5px',
        resize: 'vertical'
    },
    placeOrderBtn: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px'
    },
    summary: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: 'fit-content',
        position: 'sticky',
        top: '80px'
    },
    summaryTitle: {
        marginTop: 0,
        marginBottom: '20px',
        color: '#333',
        fontSize: '18px'
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee'
    },
    summaryItemInfo: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    },
    summaryItemName: {
        color: '#333'
    },
    summaryItemQty: {
        color: '#666',
        fontSize: '12px'
    },
    summaryItemPrice: {
        fontWeight: 'bold',
        color: '#e67e22'
    },
    divider: {
        height: '1px',
        backgroundColor: '#ddd',
        margin: '15px 0'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        color: '#666'
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '2px solid #ddd',
        fontSize: '18px',
        fontWeight: 'bold'
    },
    totalAmount: {
        color: '#e67e22',
        fontSize: '20px'
    },
    empty: {
        textAlign: 'center',
        padding: '80px 20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        marginTop: '50px'
    },
    shopBtn: {
        padding: '12px 30px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px'
    }
};

export default Checkout;