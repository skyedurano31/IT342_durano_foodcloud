import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import axiosInstance from '../api/axiosConfig';

const AdminDashboard = () => {
    const { user, logout } = useUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusUpdating, setStatusUpdating] = useState(null);
    const [message, setMessage] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const orderStatuses = ['PENDING', 'PREPARING', 'DELIVERED', 'CANCELLED'];

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const response = await axiosInstance.get('/api/orders');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        setStatusUpdating(orderId);
        try {
            await axiosInstance.patch(`/api/orders/${orderId}/status`, null, {
                params: { status: newStatus }
            });
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
            showMessage(`Order #${orderId} status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating order status:', error);
            setError('Failed to update order status');
        } finally {
            setStatusUpdating(null);
        }
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    if (loading) {
        return <div style={styles.loading}>Loading orders...</div>;
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Order Administration</h1>
                    <p style={styles.subtitle}>Manage customer orders</p>
                </div>
                <div style={styles.userInfo}>
                    <span style={styles.username}>{user?.username}</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            {/* Messages */}
            {message && (
                <div style={styles.successMessage}>{message}</div>
            )}
            {error && (
                <div style={styles.errorMessage}>{error}</div>
            )}

            {/* Stats */}
            <div style={styles.statsBar}>
                <div style={styles.statItem}>
                    <strong>{orders.length}</strong> Total
                </div>
                <div style={styles.statItem}>
                    <strong>{orders.filter(o => o.status === 'PENDING').length}</strong> Pending
                </div>
                <div style={styles.statItem}>
                    <strong>{orders.filter(o => o.status === 'PREPARING').length}</strong> Preparing
                </div>
                <div style={styles.statItem}>
                    <strong>{orders.filter(o => o.status === 'DELIVERED').length}</strong> Delivered
                </div>
                <div style={styles.statItem}>
                    <strong>{orders.filter(o => o.status === 'CANCELLED').length}</strong> Cancelled
                </div>
            </div>

            {/* Orders Table - Wikipedia style */}
            <div style={styles.ordersSection}>
                <h2 style={styles.sectionTitle}>All Orders</h2>
                {orders.length === 0 ? (
                    <p style={styles.noOrders}>No orders found.</p>
                ) : (
                    <table style={styles.orderTable}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Order ID</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Customer</th>
                                <th style={styles.th}>Location</th>
                                <th style={styles.th}>Phone</th>
                                <th style={styles.th}>Total</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <React.Fragment key={order.id}>
                                    <tr style={expandedOrder === order.id ? styles.trExpanded : styles.tr}>
                                        <td style={styles.td}>
                                            #{order.orderNumber?.slice(-8) || order.id}
                                        </td>
                                        <td style={styles.td}>
                                            {new Date(order.orderDate).toLocaleDateString()}
                                            <br />
                                            <span style={styles.timeSmall}>
                                                {new Date(order.orderDate).toLocaleTimeString()}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <strong>{order.userName || 'Unknown'}</strong>
                                            <br />
                                            <span style={styles.idSmall}>ID: {order.userId || 'N/A'}</span>
                                        </td>
                                        <td style={styles.td}>
                                            {order.building || '?'}<br />
                                            <span style={styles.idSmall}>Rm {order.roomNumber || '?'}</span>
                                        </td>
                                        <td style={styles.td}>{order.phoneNumber || 'N/A'}</td>
                                        <td style={styles.tdAmount}>
                                            ₱{parseFloat(order.totalAmount).toFixed(2)}
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.statusText,
                                                color: getStatusColor(order.status)
                                            }}>
                                                {order.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <button 
                                                onClick={() => toggleOrderDetails(order.id)}
                                                style={styles.detailsBtn}
                                            >
                                                {expandedOrder === order.id ? '[-]' : '[+]'}
                                            </button>
                                            <br />
                                            <select 
                                                value={order.status || 'PENDING'}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                style={styles.statusSelect}
                                                disabled={statusUpdating === order.id}
                                            >
                                                {orderStatuses.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    {expandedOrder === order.id && (
                                        <tr>
                                            <td colSpan="8" style={styles.detailsRow}>
                                                <div style={styles.detailsBox}>
                                                    <h4 style={styles.detailsTitle}>Order Items</h4>
                                                    <table style={styles.itemsTable}>
                                                        <thead>
                                                            <tr>
                                                                <th style={styles.itemsTh}>Product</th>
                                                                <th style={styles.itemsTh}>Qty</th>
                                                                <th style={styles.itemsTh}>Unit Price</th>
                                                                <th style={styles.itemsTh}>Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.items && order.items.map((item, idx) => (
                                                                <tr key={idx}>
                                                                    <td style={styles.itemsTd}>{item.productName || `Product #${item.productId}`}</td>
                                                                    <td style={styles.itemsTdCenter}>{item.quantity}</td>
                                                                    <td style={styles.itemsTdRight}>₱{parseFloat(item.unitPrice).toFixed(2)}</td>
                                                                    <td style={styles.itemsTdRight}>₱{parseFloat(item.subtotal).toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                            <tr style={styles.itemsTotalRow}>
                                                                <td colSpan="3" style={styles.itemsTdRight}><strong>Total</strong></td>
                                                                <td style={styles.itemsTdRight}><strong>₱{parseFloat(order.totalAmount).toFixed(2)}</strong></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    {order.deliveryInstructions && (
                                                        <div style={styles.instructionsBox}>
                                                            <strong>Delivery Instructions:</strong> {order.deliveryInstructions}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const getStatusColor = (status) => {
    const colors = {
        'PENDING': '#cc6600',
        'PREPARING': '#0066cc',
        'DELIVERED': '#008000',
        'CANCELLED': '#cc0000'
    };
    return colors[status] || '#333333';
};

const styles = {
    container: {
        maxWidth: '1400px',
        margin: '20px auto',
        padding: '0 20px',
        fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
        backgroundColor: '#ffffff',
        color: '#000000'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        marginBottom: '20px',
        borderBottom: '1px solid #aaa'
    },
    title: {
        fontSize: '24px',
        fontWeight: 'normal',
        margin: 0,
        color: '#000'
    },
    subtitle: {
        fontSize: '12px',
        margin: '5px 0 0',
        color: '#555'
    },
    userInfo: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    },
    username: {
        fontSize: '13px',
        color: '#333'
    },
    logoutBtn: {
        padding: '4px 12px',
        background: '#eee',
        border: '1px solid #aaa',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '12px',
        fontFamily: 'inherit'
    },
    successMessage: {
        padding: '8px 15px',
        marginBottom: '15px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        color: '#155724',
        fontSize: '13px'
    },
    errorMessage: {
        padding: '8px 15px',
        marginBottom: '15px',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        color: '#721c24',
        fontSize: '13px'
    },
    statsBar: {
        display: 'flex',
        gap: '30px',
        padding: '12px 0',
        marginBottom: '25px',
        borderBottom: '1px solid #ccc',
        fontSize: '13px'
    },
    statItem: {
        color: '#333'
    },
    ordersSection: {
        marginTop: '10px'
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: 'normal',
        margin: '0 0 15px 0',
        paddingBottom: '5px',
        borderBottom: '1px solid #aaa'
    },
    noOrders: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        fontSize: '13px'
    },
    loading: {
        textAlign: 'center',
        padding: '60px',
        fontSize: '14px',
        color: '#666'
    },
    orderTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '12px',
        backgroundColor: '#fff'
    },
    th: {
        textAlign: 'left',
        padding: '10px 8px',
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid #aaa',
        borderTop: '1px solid #ddd',
        fontWeight: 'bold',
        fontSize: '12px'
    },
    tr: {
        borderBottom: '1px solid #ddd'
    },
    trExpanded: {
        borderBottom: 'none'
    },
    td: {
        padding: '10px 8px',
        verticalAlign: 'top',
        borderBottom: '1px solid #eee'
    },
    tdAmount: {
        padding: '10px 8px',
        verticalAlign: 'top',
        textAlign: 'right',
        fontWeight: 'bold',
        borderBottom: '1px solid #eee'
    },
    timeSmall: {
        fontSize: '10px',
        color: '#666'
    },
    idSmall: {
        fontSize: '10px',
        color: '#666'
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: '11px'
    },
    detailsBtn: {
        background: 'none',
        border: 'none',
        fontSize: '14px',
        cursor: 'pointer',
        color: '#0066cc',
        fontWeight: 'bold',
        marginBottom: '5px'
    },
    statusSelect: {
        padding: '3px 5px',
        fontSize: '10px',
        border: '1px solid #ccc',
        borderRadius: '2px',
        width: '95px'
    },
    detailsRow: {
        padding: 0,
        backgroundColor: '#f9f9f9'
    },
    detailsBox: {
        padding: '15px',
        border: '1px solid #ddd',
        margin: '0 8px 15px 8px',
        backgroundColor: '#fdfdfd'
    },
    detailsTitle: {
        fontSize: '14px',
        fontWeight: 'bold',
        margin: '0 0 12px 0',
        paddingBottom: '5px',
        borderBottom: '1px solid #ccc'
    },
    itemsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '11px',
        marginBottom: '15px'
    },
    itemsTh: {
        textAlign: 'left',
        padding: '6px 8px',
        backgroundColor: '#eee',
        borderBottom: '1px solid #ccc',
        fontWeight: 'bold'
    },
    itemsTd: {
        padding: '6px 8px',
        borderBottom: '1px solid #eee',
        textAlign: 'left'
    },
    itemsTdCenter: {
        padding: '6px 8px',
        borderBottom: '1px solid #eee',
        textAlign: 'center'
    },
    itemsTdRight: {
        padding: '6px 8px',
        borderBottom: '1px solid #eee',
        textAlign: 'right'
    },
    itemsTotalRow: {
        borderTop: '1px solid #ccc',
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5'
    },
    instructionsBox: {
        marginTop: '12px',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #eee',
        fontSize: '11px'
    }
};

export default AdminDashboard;