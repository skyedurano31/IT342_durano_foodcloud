// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import axiosInstance from '../api/axiosConfig';

const Orders = () => {
    const { user, loading: userLoading } = useUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        if (user?.id) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!user?.id) return;
        
        try {
            console.log('Fetching orders for user:', user.id);
            const response = await axiosInstance.get(`/api/orders/user/${user.id}`);
            console.log('Orders response:', response.data);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (userLoading || loading) {
        return <div style={styles.loading}>Loading orders...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div style={styles.empty}>
                <h2 style={styles.emptyTitle}>No orders yet</h2>
                <p style={styles.emptyText}>Start shopping to see your orders here!</p>
                <button onClick={() => window.location.href = '/products'} style={styles.shopBtn}>
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>My Orders</h1>
            
            <div style={styles.ordersList}>
                {orders.map(order => (
                    <div key={order.id} style={styles.orderCard}>
                        <div style={styles.orderHeader}>
                            <div>
                                <span style={styles.orderId}>Order #{order.orderNumber || order.id}</span>
                                <span style={styles.orderDate}>
                                    {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <span style={{
                                ...styles.orderStatus,
                                backgroundColor: getStatusBgColor(order.status),
                                color: getStatusTextColor(order.status)
                            }}>
                                {order.status || 'PENDING'}
                            </span>
                        </div>
                        
                        <div style={styles.orderSummary}>
                            <div style={styles.summaryItem}>
                                <strong>Location:</strong> {order.building}, Room {order.roomNumber}
                            </div>
                            <div style={styles.summaryItem}>
                                <strong>Phone:</strong> {order.phoneNumber}
                            </div>
                            <div style={styles.summaryItem}>
                                <strong>Total:</strong> <span style={styles.totalAmount}>₱{parseFloat(order.totalAmount).toFixed(2)}</span>
                            </div>
                        </div>

                        {order.deliveryInstructions && (
                            <div style={styles.instructions}>
                                <strong>Instructions:</strong> {order.deliveryInstructions}
                            </div>
                        )}

                        <button 
                            onClick={() => toggleOrderDetails(order.id)}
                            style={styles.detailsBtn}
                        >
                            {expandedOrder === order.id ? '▼ Hide Items' : '▶ View Items'}
                        </button>

                        {expandedOrder === order.id && (
                            <div style={styles.orderItems}>
                                <h4 style={styles.itemsTitle}>Order Items</h4>
                                <table style={styles.itemsTable}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Product</th>
                                            <th style={styles.th}>Qty</th>
                                            <th style={styles.th}>Price</th>
                                            <th style={styles.th}>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items && order.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td style={styles.td}>{item.productName}</td>
                                                <td style={styles.tdCenter}>{item.quantity}</td>
                                                <td style={styles.tdRight}>₱{parseFloat(item.unitPrice).toFixed(2)}</td>
                                                <td style={styles.tdRight}>₱{parseFloat(item.subtotal).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <tr style={styles.totalRow}>
                                            <td colSpan="3" style={styles.tdRight}><strong>Total</strong></td>
                                            <td style={styles.tdRight}><strong>₱{parseFloat(order.totalAmount).toFixed(2)}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const getStatusBgColor = (status) => {
    switch(status) {
        case 'DELIVERED': return '#d4edda';
        case 'CANCELLED': return '#f8d7da';
        case 'PREPARING': return '#cce5ff';
        default: return '#fff3cd';
    }
};

const getStatusTextColor = (status) => {
    switch(status) {
        case 'DELIVERED': return '#155724';
        case 'CANCELLED': return '#721c24';
        case 'PREPARING': return '#004085';
        default: return '#856404';
    }
};

const styles = {
    container: {
        maxWidth: '900px',
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
    error: {
        textAlign: 'center',
        padding: '60px',
        color: '#800000',
        fontSize: '14px'
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
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #eee',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '12px',
        borderBottom: '1px solid #eee'
    },
    orderId: {
        fontWeight: '600',
        fontSize: '15px',
        color: '#333',
        marginRight: '15px'
    },
    orderDate: {
        color: '#888',
        fontSize: '12px'
    },
    orderStatus: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600'
    },
    orderSummary: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '12px',
        fontSize: '13px'
    },
    summaryItem: {
        color: '#555'
    },
    totalAmount: {
        color: '#800000',
        fontWeight: '600'
    },
    instructions: {
        marginTop: '10px',
        marginBottom: '15px',
        padding: '8px 12px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666'
    },
    detailsBtn: {
        marginTop: '12px',
        background: 'none',
        border: 'none',
        color: '#800000',
        cursor: 'pointer',
        fontSize: '12px',
        padding: '5px 0',
        fontWeight: '500'
    },
    orderItems: {
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '1px solid #eee'
    },
    itemsTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '12px'
    },
    itemsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '12px'
    },
    th: {
        textAlign: 'left',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
        fontWeight: '600'
    },
    td: {
        padding: '8px',
        borderBottom: '1px solid #eee'
    },
    tdCenter: {
        padding: '8px',
        textAlign: 'center',
        borderBottom: '1px solid #eee'
    },
    tdRight: {
        padding: '8px',
        textAlign: 'right',
        borderBottom: '1px solid #eee'
    },
    totalRow: {
        backgroundColor: '#fafafa',
        fontWeight: '600'
    }
};

export default Orders;