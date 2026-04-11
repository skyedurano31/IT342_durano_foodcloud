// src/pages/Cart.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../hooks/useCart';

const Cart = () => {
    const { user } = useUser();
    const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart(user);
    const navigate = useNavigate();

    if (loading) return <div style={styles.loading}>Loading cart...</div>;
    
    // Check if cart is empty
    const isEmpty = !cart || !cart.items || cart.items.length === 0;
    
    if (isEmpty) {
        return (
            <div style={styles.empty}>
                <h2>Your cart is empty</h2>
                <p>Add some delicious items to your cart!</p>
                <button onClick={() => navigate('/products')} style={styles.shopBtn}>
                    Browse Products
                </button>
            </div>
        );
    }

    // Debug: Log the cart items to see the structure
    console.log('Cart items:', cart.items);
    console.log('First item price:', cart.items[0]?.price);
    console.log('Price type:', typeof cart.items[0]?.price);

    // Calculate totals - Handle BigDecimal correctly
    const subtotal = cart.items.reduce((sum, item) => {
        // Convert price to number - handle BigDecimal, string, or number
        let price = 0;
        if (item.price) {
            // If price is an object with a value property (BigDecimal)
            if (typeof item.price === 'object' && item.price.value !== undefined) {
                price = parseFloat(item.price.value);
            } 
            // If price is a number
            else if (typeof item.price === 'number') {
                price = item.price;
            }
            // If price is a string
            else if (typeof item.price === 'string') {
                price = parseFloat(item.price);
            }
            // If price has a toString method
            else {
                price = parseFloat(item.price.toString());
            }
        }
        
        const quantity = parseInt(item.quantity) || 0;
        console.log(`Item: ${item.productName}, Price: ${price}, Quantity: ${quantity}, Subtotal: ${price * quantity}`);
        
        return sum + (price * quantity);
    }, 0);
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Shopping Cart ({cart.itemCount || cart.items.length} items)</h1>
            
            <div style={styles.cartContent}>
                <div style={styles.itemsSection}>
                    {cart.items.map(item => {
                        // Parse price for each item
                        let price = 0;
                        if (item.price) {
                            if (typeof item.price === 'object' && item.price.value !== undefined) {
                                price = parseFloat(item.price.value);
                            } else if (typeof item.price === 'number') {
                                price = item.price;
                            } else if (typeof item.price === 'string') {
                                price = parseFloat(item.price);
                            } else {
                                price = parseFloat(item.price.toString());
                            }
                        }
                        
                        const quantity = parseInt(item.quantity) || 0;
                        const itemTotal = price * quantity;
                        
                        return (
                            <div key={item.id} style={styles.cartItem}>
                                <div style={styles.itemInfo}>
                                    <h3 style={styles.itemName}>{item.productName}</h3>
                                    <p style={styles.itemPrice}>₱{price.toFixed(2)}</p>
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
                        onClick={() => navigate('/checkout')}
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
        padding: '20px',
        minHeight: 'calc(100vh - 80px)'
    },
    title: {
        marginBottom: '30px',
        color: '#333',
        fontSize: '28px'
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px',
        color: '#666'
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
    },
    cartContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '30px'
    },
    itemsSection: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
        fontSize: '16px',
        color: '#333'
    },
    itemPrice: {
        margin: 0,
        color: '#e67e22',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    quantityControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    qtyBtn: {
        width: '30px',
        height: '30px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    quantity: {
        minWidth: '30px',
        textAlign: 'center',
        fontSize: '16px'
    },
    itemTotal: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: '16px'
    },
    removeBtn: {
        padding: '5px 15px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    clearBtn: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    summary: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: 'fit-content',
        position: 'sticky',
        top: '80px'
    },
    summaryTitle: {
        marginTop: 0,
        marginBottom: '20px',
        color: '#333',
        fontSize: '20px'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        color: '#666'
    },
    divider: {
        height: '1px',
        backgroundColor: '#ddd',
        margin: '15px 0'
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: 'bold'
    },
    totalAmount: {
        color: '#e67e22',
        fontSize: '22px'
    },
    checkoutBtn: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
    }
};

export default Cart;