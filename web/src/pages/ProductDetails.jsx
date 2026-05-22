// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../hooks/useCart';
import axiosInstance from '../api/axiosConfig';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { addToCart, loading: cartLoading } = useCart(user);
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/products/${id}`);
            setProduct(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching product details:', err);
            setError('Product not found or failed to load.');
            setProduct(null);
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

    const handleAddToCart = async () => {
        if (!user) {
            showMessage('Please login first!', 'error');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
            return;
        }

        const success = await addToCart(product.id, quantity);
        if (success) {
            showMessage(`${quantity} x ${product.name} added to cart!`, 'success');
            setQuantity(1);
        } else {
            showMessage('Failed to add to cart. Please try again.', 'error');
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading product details...</div>;
    }

    if (error || !product) {
        return (
            <div style={styles.container}>
                <button onClick={() => navigate('/products')} style={styles.backButton}>
                    ← Back to Products
                </button>
                <div style={styles.errorContainer}>
                    <p style={styles.errorText}>{error}</p>
                    <button onClick={() => navigate('/products')} style={styles.button}>
                        Return to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {message && (
                <div style={{
                    ...styles.message,
                    backgroundColor: messageType === 'success' ? '#4caf50' : '#f44336'
                }}>
                    {message}
                </div>
            )}

            <button onClick={() => navigate('/products')} style={styles.backButton}>
                ← Back to Products
            </button>

            <div style={styles.detailsWrapper}>
                <div style={styles.imageSection}>
                    {product.imageUrl && (
                        <img 
                            src={`http://localhost:8080${product.imageUrl}`} 
                            alt={product.name}
                            style={styles.productImage}
                        />
                    )}
                </div>

                <div style={styles.infoSection}>
                    <h1 style={styles.productName}>{product.name}</h1>
                    
                    <div style={styles.priceSection}>
                        <div style={styles.price}>₱{parseFloat(product.price).toFixed(2)}</div>
                    </div>

                    <div style={styles.descriptionSection}>
                        <h3 style={styles.sectionTitle}>Description</h3>
                        <p style={styles.description}>
                            {product.description || 'No description available'}
                        </p>
                    </div>

                    {product.stock !== undefined && (
                        <div style={styles.stockSection}>
                            <span style={styles.stockLabel}>Stock:</span>
                            <span style={{
                                ...styles.stockValue,
                                color: product.stock > 0 ? '#4caf50' : '#f44336'
                            }}>
                                {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                            </span>
                        </div>
                    )}

                    {product.categoryName && (
                        <div style={styles.categorySection}>
                            <span style={styles.categoryLabel}>Category:</span>
                            <span style={styles.categoryValue}>{product.categoryName}</span>
                        </div>
                    )}

                    <div style={styles.cartSection}>
                        <div style={styles.quantityContainer}>
                            <label style={styles.quantityLabel}>Quantity:</label>
                            <div style={styles.quantityControls}>
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={styles.quantityButton}
                                >
                                    −
                                </button>
                                <input 
                                    type="number" 
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    style={styles.quantityInput}
                                />
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={styles.quantityButton}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={handleAddToCart}
                            style={{
                                ...styles.button,
                                opacity: product.stock === 0 ? 0.6 : 1,
                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                            }}
                            disabled={cartLoading || product.stock === 0}
                        >
                            {cartLoading ? 'Adding to Cart...' : 'Add to Cart'}
                        </button>
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
        backgroundColor: '#fafafa',
        minHeight: 'calc(100vh - 80px)'
    },
    loading: {
        textAlign: 'center',
        padding: '60px 20px',
        fontSize: '16px',
        color: '#666'
    },
    backButton: {
        padding: '10px 20px',
        fontSize: '14px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        background: 'white',
        color: '#333',
        cursor: 'pointer',
        marginBottom: '30px',
        transition: 'all 0.2s',
        fontWeight: '500'
    },
    errorContainer: {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #eee'
    },
    errorText: {
        fontSize: '16px',
        color: '#f44336',
        marginBottom: '20px'
    },
    message: {
        color: 'white',
        padding: '12px 15px',
        borderRadius: '4px',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '14px'
    },
    detailsWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        border: '1px solid #eee',
        alignItems: 'start'
    },
    imageSection: {
        display: 'flex',
        justifyContent: 'center'
    },
    productImage: {
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
        borderRadius: '8px',
        objectFit: 'cover',
        backgroundColor: '#f5f5f5',
        border: '1px solid #eee'
    },
    infoSection: {
        display: 'flex',
        flexDirection: 'column'
    },
    productName: {
        fontSize: '32px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '20px'
    },
    priceSection: {
        marginBottom: '25px',
        paddingBottom: '20px',
        borderBottom: '2px solid #eee'
    },
    price: {
        fontSize: '28px',
        fontWeight: '600',
        color: '#800000'
    },
    descriptionSection: {
        marginBottom: '25px'
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '10px'
    },
    description: {
        fontSize: '15px',
        color: '#666',
        lineHeight: '1.6'
    },
    stockSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '15px'
    },
    stockLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#555'
    },
    stockValue: {
        fontSize: '14px',
        fontWeight: '500'
    },
    categorySection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '25px'
    },
    categoryLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#555'
    },
    categoryValue: {
        fontSize: '14px',
        color: '#777',
        backgroundColor: '#f5f5f5',
        padding: '5px 12px',
        borderRadius: '4px'
    },
    cartSection: {
        marginTop: 'auto'
    },
    quantityContainer: {
        marginBottom: '20px'
    },
    quantityLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#555',
        display: 'block',
        marginBottom: '10px'
    },
    quantityControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: 'fit-content'
    },
    quantityButton: {
        width: '36px',
        height: '36px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        background: 'white',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: '500',
        color: '#333',
        transition: 'all 0.2s'
    },
    quantityInput: {
        width: '60px',
        height: '36px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        textAlign: 'center',
        padding: '5px'
    },
    button: {
        width: '100%',
        padding: '14px',
        background: '#800000',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'background 0.2s'
    }
};

export default ProductDetails;
