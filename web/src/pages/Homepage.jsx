import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axiosInstance from '../api/axiosConfig';

const Homepage = () => {
    const { user } = useUser();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/api/categories');
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/products?categoryId=${categoryId}`);
    };

    const getCategoryImage = (categoryName) => {
        const imageName = categoryName.toLowerCase().replace(/\s+/g, '-');
        return `/images/${imageName}.png`;
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>LAMIAN NA OG MASUSTANSYA PA!</h1>
                <p style={styles.subtitle}>palit namo</p>
            </div>

            {/* Centered Image */}
            <div style={styles.centerImageContainer}>
                <img 
                    src="/images/centerimage.png"  // Change to your image filename
                    alt="Delicious Food"
                    style={styles.centerImage}
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            </div>

            {/* Categories Section */}
            <div style={styles.categoriesSection}>
                <div style={styles.categoriesGrid}>
                    {!loading && categories.length > 0 ? (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                style={styles.categoryCard}
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                <img 
                                    src={getCategoryImage(category.name)} 
                                    alt={category.name}
                                    style={styles.categoryImage}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <h3 style={styles.categoryName}>{category.name}</h3>
                                {category.description && (
                                    <p style={styles.categoryDescription}>
                                        {category.description}
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={styles.noCategories}>
                            {loading ? 'Loading categories...' : 'No categories available'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 80px)',
        backgroundColor: '#fafafa'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    title: {
        fontSize: '36px',
        color: '#800000',
        margin: '0 0 10px 0',
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: '16px',
        color: '#666',
        margin: 0
    },
 centerImageContainer: {
    textAlign: 'center',
    marginBottom: '50px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto 50px auto'
},
centerImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
},
    categoriesSection: {
        marginTop: '20px'
    },
    categoriesTitle: {
        fontSize: '24px',
        color: '#800000',
        textAlign: 'center',
        marginBottom: '30px',
        fontWeight: '500',
        borderBottom: '2px solid #800000',
        display: 'inline-block',
        width: 'auto',
        paddingBottom: '8px'
    },
    categoriesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '25px'
    },
    categoryCard: {
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        textAlign: 'center',
        border: '1px solid #eee'
    },
    categoryImage: {
        width: '100%',
        height: '160px',
        objectFit: 'cover',
        marginBottom: '15px',
        borderRadius: '6px'
    },
    categoryName: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        margin: '0 0 8px 0'
    },
    categoryDescription: {
        fontSize: '12px',
        color: '#777',
        margin: 0,
        lineHeight: '1.4'
    },
    noCategories: {
        textAlign: 'center',
        color: '#999',
        fontSize: '14px',
        gridColumn: '1 / -1'
    }
};

// Add hover effect
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    .category-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(styleSheet);

export default Homepage;