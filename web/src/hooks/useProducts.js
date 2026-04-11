// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchProducts = useCallback(async (page = 0, size = 12, search = '', category = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/api/products', {
                params: { page, size, search, category }
            });
            setProducts(response.data.content || response.data);
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(page);
        } catch (error) {
            setError('Failed to fetch products');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const getProduct = async (id) => {
        try {
            const response = await axiosInstance.get(`/api/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch product:', error);
            return null;
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        totalPages,
        currentPage,
        getProduct,
        fetchProducts,
        refreshProducts: () => fetchProducts(currentPage)
    };
};