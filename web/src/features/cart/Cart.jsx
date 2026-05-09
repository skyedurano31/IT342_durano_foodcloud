// src/pages/Cart.jsx - Fix the checkout button navigation
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../shared/UserContext';
import { useCart } from '../cart/useCart';

const Cart = () => {
    const { user } = useUser();
    const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart(user);
    const navigate = useNavigate();

    if (loading) return <div style={styles.loading}>Loading cart...</div>;
    
    const isEmpty = !cart || !cart.items || cart.items.length === 0;
    
    if (isEmpty) {
        return (
            <div style={styles.empty}>
                <h2 style={styles.emptyTitle}>Your cart is empty</h2>
                <p style={styles.emptyText}>Add some delicious items to your cart!</p>
                <button onClick={() => navigate('/products')} style={styles.shopBtn}>
                    Browse Products
                </button>
            </div>
        );
    }

    const subtotal = cart.items.reduce((sum, item) => {
        const unitPrice = parseFloat(item.unitPrice) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (unitPrice * quantity);
    }, 0);
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Shopping Cart ({cart.itemCount || cart.items.length} items)</h1>
            
            <div style={styles.cartContent}>
                <div style={styles.itemsSection}>
                    {cart.items.map(item => {
                        const unitPrice = parseFloat(item.unitPrice) || 0;
                        const quantity = parseInt(item.quantity) || 0;
                        const itemTotal = unitPrice * quantity;
                        
                        return (
                            <div key={item.id} style={styles.cartItem}>
                                <div style={styles.itemInfo}>
                                    <h3 style={styles.itemName}>{item.productName}</h3>
                                    <p style={styles.itemPrice}>₱{unitPrice.toFixed(2)}</p>
                                </div>
                                
                                <div style={styles.quantityControls}>
                                    <button 
                                        onClick={() => updateQuantity(item.id, quantity - 1)}
                                        style={styles.qtyBtn}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span style={styles.quantity}>{quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, quantity + 1)}
                                        style={styles.qtyBtn}
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <div style={styles.itemTotal}>
                                    ₱{itemTotal.toFixed(2)}
                                </div>
                                
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    style={styles.removeBtn}
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                    
                    <button onClick={clearCart} style={styles.clearBtn}>
                        Clear Cart
                    </button>
                </div>
                
                <div style={styles.summary}>
                    <h2 style={styles.summaryTitle}>Order Summary</h2>
                    
                    <div style={styles.summaryRow}>
                        <span>Subtotal:</span>
                        <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div style={styles.summaryRow}>
                        <span>Tax (10%):</span>
                        <span>₱{tax.toFixed(2)}</span>
                    </div>
                    
                    <div style={styles.divider}></div>
                    
                    <div style={styles.totalRow}>
                        <span>Total:</span>
                        <span style={styles.totalAmount}>₱{total.toFixed(2)}</span>
                    </div>
                    
                    <button 
                        onClick={handleCheckout}
                        style={styles.checkoutBtn}
                    >
                        Proceed to Checkout
                    </button>
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
    loading: {
        textAlign: 'center',
        padding: '60px',
        fontSize: '14px',
        color: '#666'
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
    },
    cartContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '30px'
    },
    itemsSection: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #eee',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    cartItem: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr auto',
        gap: '15px',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid #eee'
    },
    itemInfo: {
        flex: 1
    },
    itemName: {
        margin: '0 0 5px 0',
        fontSize: '15px',
        fontWeight: '600',
        color: '#333'
    },
    itemPrice: {
        margin: 0,
        color: '#800000',
        fontWeight: '600',
        fontSize: '13px'
    },
    quantityControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    qtyBtn: {
        width: '28px',
        height: '28px',
        border: '1px solid #ddd',
        backgroundColor: '#fff',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background 0.2s'
    },
    quantity: {
        minWidth: '30px',
        textAlign: 'center',
        fontSize: '14px'
    },
    itemTotal: {
        fontWeight: '600',
        color: '#333',
        fontSize: '15px'
    },
    removeBtn: {
        padding: '5px 12px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    clearBtn: {
        marginTop: '20px',
        padding: '8px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px'
    },
    summary: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #eee',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: 'fit-content',
        position: 'sticky',
        top: '80px'
    },
    summaryTitle: {
        marginTop: 0,
        marginBottom: '20px',
        color: '#800000',
        fontSize: '18px',
        fontWeight: '600',
        paddingBottom: '8px',
        borderBottom: '1px solid #eee'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        color: '#555',
        fontSize: '13px'
    },
    divider: {
        height: '1px',
        backgroundColor: '#eee',
        margin: '15px 0'
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    totalAmount: {
        color: '#800000',
        fontSize: '20px'
    },
    checkoutBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#800000',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'background 0.2s'
    }
};

export default Cart;