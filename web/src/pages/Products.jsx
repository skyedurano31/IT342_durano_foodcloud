// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../hooks/useCart';
import axiosInstance from '../api/axiosConfig';

const Products = () => {
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('categoryId');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categoryId || '');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const { user } = useUser();
    const { addToCart, loading: cartLoading } = useCart(user);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categoryId && !selectedCategory) {
            setSelectedCategory(categoryId);
        }
    }, [categoryId]);

    useEffect(() => {
        if (selectedCategory) {
            const filtered = products.filter(product => {
                return String(product.categoryId) === String(selectedCategory);
            });
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [selectedCategory, products]);

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get('/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            showMessage('Failed to load products', 'error');
            setLoading(false);
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

            {/* Category Filter */}
            <div style={styles.filterContainer}>
                <button 
                    onClick={() => setSelectedCategory('')}
                    style={selectedCategory === '' ? styles.filterButtonActive : styles.filterButton}
                >
                    All
                </button>
                {categories.map(category => (
                    <button 
                        key={category.id}
                        onClick={() => setSelectedCategory(String(category.id))}
                        style={selectedCategory === String(category.id) ? styles.filterButtonActive : styles.filterButton}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            
            <div style={styles.grid}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.id} style={styles.card}>
                            {product.imageUrl && (
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name}
                                    style={styles.productImage}
                                />
                            )}
                            <h3 style={styles.productName}>{product.name}</h3>
                            <p style={styles.productDesc}>{product.description || 'Delicious food item'}</p>
                            <div style={styles.price}>₱{parseFloat(product.price).toFixed(2)}</div>
                            <button 
                                onClick={() => handleAddToCart(product.id, product.name)}
                                style={styles.button}
                                disabled={cartLoading}
                            >
                                {cartLoading ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={styles.emptyState}>
                        <p>No products found in this category.</p>
                    </div>
                )}
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
    title: { 
        fontSize: '28px',
        fontWeight: '500',
        textAlign: 'center', 
        marginBottom: '30px', 
        color: '#800000',
        paddingBottom: '10px',
        borderBottom: '2px solid #800000',
        display: 'inline-block',
        width: 'auto'
    },
    loading: { 
        textAlign: 'center', 
        padding: '60px', 
        fontSize: '14px',
        color: '#666'
    },
    message: { 
        color: 'white', 
        padding: '10px 15px', 
        borderRadius: '4px', 
        marginBottom: '20px', 
        textAlign: 'center',
        fontSize: '13px'
    },
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
        gap: '25px' 
    },
    card: { 
        border: '1px solid #eee', 
        borderRadius: '8px', 
        padding: '20px', 
        background: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    productImage: { 
        width: '100%', 
        height: '160px', 
        objectFit: 'cover', 
        borderRadius: '6px', 
        marginBottom: '15px',
        backgroundColor: '#f5f5f5'
    },
    productName: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '8px'
    },
    productDesc: {
        fontSize: '13px',
        color: '#777',
        marginBottom: '12px',
        lineHeight: '1.4'
    },
    price: { 
        fontSize: '20px', 
        fontWeight: '600', 
        color: '#800000', 
        margin: '12px 0' 
    },
    button: { 
        width: '100%', 
        padding: '10px', 
        background: '#800000', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer', 
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background 0.2s'
    },
    filterContainer: { 
        marginBottom: '35px', 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'center',
        flexWrap: 'wrap' 
    },
    filterButton: {
        padding: '8px 20px',
        fontSize: '13px',
        border: '1px solid #ddd',
        borderRadius: '25px',
        cursor: 'pointer',
        background: 'white',
        color: '#555',
        fontWeight: '500',
        transition: 'all 0.2s'
    },
    filterButtonActive: {
        padding: '8px 20px',
        fontSize: '13px',
        border: '1px solid #800000',
        borderRadius: '25px',
        cursor: 'pointer',
        background: '#800000',
        color: 'white',
        fontWeight: '500',
        transition: 'all 0.2s'
    },
    emptyState: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '60px',
        color: '#888',
        fontSize: '14px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #eee'
    }
};

// Add hover effect
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    .product-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(styleSheet);

export default Products;