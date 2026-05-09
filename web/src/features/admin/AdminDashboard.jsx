import React, { useState, useEffect } from 'react';
import { useUser } from '../../shared/UserContext';
import axiosInstance from '../../shared/axiosConfig';

const AdminDashboard = () => {
    const { user, logout } = useUser();
    const [activeTab, setActiveTab] = useState('orders');
    
    // Orders
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusUpdating, setStatusUpdating] = useState(null);
    const [message, setMessage] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Products
    const [showProductForm, setShowProductForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [productsLoading, setProductsLoading] = useState(false);

    const orderStatuses = ['PENDING', 'PREPARING', 'DELIVERED', 'CANCELLED'];

    useEffect(() => {
        fetchAllOrders();
    }, []);

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
            fetchCategories();
        }
    }, [activeTab]);

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

    const fetchProducts = async () => {
        try {
            setProductsLoading(true);
            const response = await axiosInstance.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            showMessage('Failed to load products', 'error');
        } finally {
            setProductsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price || !formData.categoryId) {
            showMessage('Please fill in all required fields');
            return;
        }

        try {
            setProductsLoading(true);
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('categoryId', formData.categoryId);
            
            if (imageFile) {
                data.append('image', imageFile);
            }

            await axiosInstance.post('/api/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            showMessage('Product added successfully!');
            setFormData({ name: '', description: '', price: '', categoryId: '' });
            setImageFile(null);
            setImagePreview(null);
            setShowProductForm(false);
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            showMessage('Failed to add product. Please try again.');
        } finally {
            setProductsLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axiosInstance.delete(`/api/products/${productId}`);
                showMessage('Product deleted successfully!');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                showMessage('Failed to delete product.');
            }
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    if (loading && activeTab === 'orders') {
        return <div style={styles.loading}>Loading orders...</div>;
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Admin Dashboard</h1>
                    <p style={styles.subtitle}>Manage orders and products</p>
                </div>
                <div style={styles.userInfo}>
                    <span style={styles.username}>{user?.username}</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabContainer}>
                <button 
                    onClick={() => setActiveTab('orders')}
                    style={activeTab === 'orders' ? styles.tabActive : styles.tab}
                >
                    Orders
                </button>
                <button 
                    onClick={() => setActiveTab('products')}
                    style={activeTab === 'products' ? styles.tabActive : styles.tab}
                >
                    Products
                </button>
            </div>

            {/* Messages */}
            {message && (
                <div style={{...styles.successMessage, backgroundColor: message.includes('Failed') ? '#f8d7da' : '#d4edda', color: message.includes('Failed') ? '#721c24' : '#155724'}}>
                    {message}
                </div>
            )}
            {error && (
                <div style={styles.errorMessage}>{error}</div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
            <>
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
            </>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
            <div style={styles.productsSection}>
                <div style={styles.productsHeader}>
                    <h2 style={styles.sectionTitle}>Products</h2>
                    <button 
                        onClick={() => setShowProductForm(!showProductForm)}
                        style={styles.addProductBtn}
                    >
                        {showProductForm ? '✕ Cancel' : '+ Add Product'}
                    </button>
                </div>

                {/* Add Product Form */}
                {showProductForm && (
                    <div style={styles.formContainer}>
                        <form onSubmit={handleAddProduct} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Product Name *</label>
                                <input 
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    placeholder="Enter product name"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Category *</label>
                                <select 
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleFormChange}
                                    style={styles.select}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.formRow}>
                                <div style={{...styles.formGroup, flex: 1}}>
                                    <label style={styles.label}>Price (₱) *</label>
                                    <input 
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleFormChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                <div style={{...styles.formGroup, flex: 1}}>
                                    <label style={styles.label}>Image</label>
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    placeholder="Enter product description"
                                    style={styles.textarea}
                                    rows="3"
                                />
                            </div>

                            {imagePreview && (
                                <div style={styles.previewContainer}>
                                    <p style={styles.previewLabel}>Image Preview:</p>
                                    <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                                </div>
                            )}

                            <div style={styles.formActions}>
                                <button 
                                    type="submit"
                                    style={styles.submitBtn}
                                    disabled={productsLoading}
                                >
                                    {productsLoading ? 'Adding...' : 'Add Product'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setShowProductForm(false);
                                        setFormData({ name: '', description: '', price: '', categoryId: '' });
                                        setImageFile(null);
                                        setImagePreview(null);
                                    }}
                                    style={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products Grid */}
                {productsLoading && !showProductForm ? (
                    <p style={styles.noProducts}>Loading products...</p>
                ) : products.length === 0 ? (
                    <p style={styles.noProducts}>No products found. Add your first product!</p>
                ) : (
                    <div style={styles.productsGrid}>
                        {products.map(product => (
                            <div key={product.id} style={styles.productCard}>
                                {product.imageUrl && (
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.name}
                                        style={styles.productCardImage}
                                    />
                                )}
                                <div style={styles.productCardContent}>
                                    <h3 style={styles.productCardName}>{product.name}</h3>
                                    <p style={styles.productCardDesc}>{product.description || 'No description'}</p>
                                    <p style={styles.productCardPrice}>₱{parseFloat(product.price).toFixed(2)}</p>
                                    <p style={styles.productCardCategory}>
                                        Category: {product.categoryName || 'N/A'}
                                    </p>
                                    <button 
                                        onClick={() => handleDeleteProduct(product.id)}
                                        style={styles.deleteBtn}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            )}
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
    tabContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        borderBottom: '2px solid #ddd',
        paddingBottom: '0'
    },
    tab: {
        padding: '12px 20px',
        fontSize: '14px',
        border: 'none',
        background: 'transparent',
        color: '#666',
        cursor: 'pointer',
        fontWeight: '500',
        borderBottom: '2px solid transparent',
        transition: 'all 0.2s'
    },
    tabActive: {
        padding: '12px 20px',
        fontSize: '14px',
        border: 'none',
        background: 'transparent',
        color: '#800000',
        cursor: 'pointer',
        fontWeight: '600',
        borderBottom: '2px solid #800000',
        transition: 'all 0.2s'
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
    productsSection: {
        marginTop: '10px'
    },
    productsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
    },
    addProductBtn: {
        padding: '8px 16px',
        background: '#800000',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500'
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
    noProducts: {
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
    formContainer: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #eee',
        marginBottom: '30px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGroup: {
        marginBottom: '15px'
    },
    formRow: {
        display: 'flex',
        gap: '15px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '6px',
        display: 'block',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '8px 12px',
        fontSize: '13px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontFamily: 'inherit',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '8px 12px',
        fontSize: '13px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontFamily: 'inherit',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        padding: '8px 12px',
        fontSize: '13px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        resize: 'vertical'
    },
    previewContainer: {
        marginBottom: '15px'
    },
    previewLabel: {
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#333'
    },
    previewImage: {
        maxWidth: '200px',
        maxHeight: '200px',
        borderRadius: '4px',
        border: '1px solid #ddd'
    },
    formActions: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px'
    },
    submitBtn: {
        padding: '10px 20px',
        background: '#800000',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600'
    },
    cancelBtn: {
        padding: '10px 20px',
        background: '#e0e0e0',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600'
    },
    productsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
    },
    productCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    productCardImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        backgroundColor: '#f5f5f5'
    },
    productCardContent: {
        padding: '15px'
    },
    productCardName: {
        fontSize: '15px',
        fontWeight: '600',
        margin: '0 0 8px 0',
        color: '#333'
    },
    productCardDesc: {
        fontSize: '12px',
        color: '#666',
        margin: '0 0 8px 0',
        lineHeight: '1.4',
        maxHeight: '36px',
        overflow: 'hidden'
    },
    productCardPrice: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#800000',
        margin: '8px 0'
    },
    productCardCategory: {
        fontSize: '12px',
        color: '#777',
        margin: '8px 0 12px 0'
    },
    deleteBtn: {
        width: '100%',
        padding: '8px',
        background: '#cc0000',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600'
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