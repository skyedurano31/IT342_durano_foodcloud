// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import axiosInstance from '../api/axiosConfig';

const Orders = () => {
    const { user, loading: userLoading } = useUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (userLoading || loading) {
        return <div style={styles.loading}>Loading orders...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div style={styles.empty}>
                <h2>No orders yet</h2>
                <p>Start shopping to see your orders here!</p>
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
                                <span style={styles.orderId}>Order #{order.id}</span>
                                <span style={styles.orderDate}>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <span style={{
                                ...styles.orderStatus,
                                backgroundColor: order.status === 'DELIVERED' ? '#d4edda' : 
                                               order.status === 'CANCELLED' ? '#f8d7da' : '#fff3cd',
                                color: order.status === 'DELIVERED' ? '#155724' :
                                       order.status === 'CANCELLED' ? '#721c24' : '#856404'
                            }}>
                                {order.status || 'PENDING'}
                            </span>
                        </div>
                        
                        <div style={styles.orderDetails}>
                            <div style={styles.deliveryInfo}>
                                <p><strong>Delivery Address:</strong> {order.building}, Room {order.roomNumber}</p>
                                <p><strong>Phone:</strong> {order.phoneNumber}</p>
                                {order.deliveryInstructions && (
                                    <p><strong>Instructions:</strong> {order.deliveryInstructions}</p>
                                )}
                            </div>
                            
                            <div style={styles.orderTotal}>
                                <strong>Total Amount:</strong> ₱{parseFloat(order.totalAmount).toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))}
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
    error: {
        textAlign: 'center',
        padding: '50px',
        color: '#dc3545'
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
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '15px',
        borderBottom: '1px solid #eee'
    },
    orderId: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginRight: '15px'
    },
    orderDate: {
        color: '#666',
        fontSize: '14px'
    },
    orderStatus: {
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    orderDetails: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '15px'
    },
    deliveryInfo: {
        flex: 1
    },
    orderTotal: {
        fontSize: '18px',
        color: '#e67e22'
    }
};

export default Orders;