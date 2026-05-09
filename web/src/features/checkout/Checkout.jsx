// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../shared/UserContext';
import { useCart } from '../cart/useCart';
import axiosInstance from '../../shared/axiosConfig';

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
                <h2 style={styles.emptyTitle}>Your cart is empty</h2>
                <p style={styles.emptyText}>Add items to your cart before checking out</p>
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
    
    const tax = subtotal * 0.05;
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
            
            const response = await axiosInstance.post('/api/orders/checkout', orderData);
            
            setSuccess('Order placed successfully! Redirecting...');
            
            await clearCart();
            
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
            
        } catch (error) {
            console.error('Checkout error:', error);
            
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
                    {error}
                </div>
            )}
            
            {success && (
                <div style={styles.success}>
                    {success}
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
                        {loading ? 'Placing Order...' : `Place Order • ₱${total.toFixed(2)}`}
                    </button>
                </form>
                
                <div style={styles.summary}>
                    <h2 style={styles.summaryTitle}>Order Summary</h2>
                    
                    <div style={styles.itemsList}>
                        {cart?.items?.map(item => {
                            const unitPrice = parseFloat(item.unitPrice) || 0;
                            const quantity = parseInt(item.quantity) || 0;
                            const itemTotal = unitPrice * quantity;
                            
                            return (
                                <div key={item.id} style={styles.summaryItem}>
                                    <div>
                                        <span style={styles.summaryItemName}>{item.productName}</span>
                                        <span style={styles.summaryItemQty}> x{quantity}</span>
                                    </div>
                                    <span style={styles.summaryItemPrice}>₱{itemTotal.toFixed(2)}</span>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div style={styles.divider}></div>
                    
                    <div style={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div style={styles.summaryRow}>
                        <span>Delivery fee</span>
                        <span>₱{tax.toFixed(0)}</span>
                    </div>
                    
                    <div style={styles.totalRow}>
                        <span>Total</span>
                        <span style={styles.totalAmount}>₱{total.toFixed(0)}</span>
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
        padding: '30px 20px',
        minHeight: 'calc(100vh - 80px)',
        backgroundColor: '#fafafa'
    },
    title: {
        fontSize: '28px',
        fontWeight: '500',
        color: '#800000',
        marginBottom: '30px',
        paddingBottom: '10px',
        borderBottom: '2px solid #800000'
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '10px 15px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '13px'
    },
    success: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '10px 15px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '13px'
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '30px'
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '25px',
        border: '1px solid #eee',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#800000',
        marginTop: 0,
        marginBottom: '20px',
        paddingBottom: '8px',
        borderBottom: '1px solid #eee'
    },
    formGroup: {
        marginBottom: '18px'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontSize: '13px',
        fontWeight: '500',
        color: '#555'
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '13px',
        marginTop: '5px',
        transition: 'border-color 0.2s'
    },
    textarea: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '13px',
        fontFamily: 'inherit',
        marginTop: '5px',
        resize: 'vertical'
    },
    placeOrderBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#800000',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        marginTop: '15px',
        transition: 'background 0.2s'
    },
    summary: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '25px',
        border: '1px solid #eee',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: 'fit-content',
        position: 'sticky',
        top: '80px'
    },
    summaryTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#800000',
        marginTop: 0,
        marginBottom: '20px',
        paddingBottom: '8px',
        borderBottom: '1px solid #eee'
    },
    itemsList: {
        marginBottom: '15px'
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #f0f0f0'
    },
    summaryItemName: {
        fontSize: '13px',
        color: '#333'
    },
    summaryItemQty: {
        fontSize: '11px',
        color: '#888',
        marginLeft: '5px'
    },
    summaryItemPrice: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#800000'
    },
    divider: {
        height: '1px',
        backgroundColor: '#eee',
        margin: '15px 0'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '13px',
        color: '#555'
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        paddingTop: '12px',
        borderTop: '1px solid #ddd',
        fontSize: '16px',
        fontWeight: '600'
    },
    totalAmount: {
        color: '#800000',
        fontSize: '18px'
    },
    empty: {
        textAlign: 'center',
        padding: '80px 20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        marginTop: '40px',
        border: '1px solid #eee'
    },
    emptyTitle: {
        fontSize: '20px',
        color: '#800000',
        marginBottom: '10px'
    },
    emptyText: {
        color: '#666',
        fontSize: '14px'
    },
    shopBtn: {
        padding: '10px 24px',
        backgroundColor: '#800000',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '20px'
    }
};

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    button:hover {
        opacity: 0.9;
    }
    input:focus, textarea:focus {
        outline: none;
        border-color: #800000;
    }
`;
document.head.appendChild(styleSheet);

export default Checkout;