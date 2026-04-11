// src/hooks/useCart.js - Make sure fetchCart is returned
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';

export const useCart = (user) => {
    const [cart, setCart] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        if (!user || !user.id) {
            console.log('No user ID, cannot fetch cart');
            return;
        }
        
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/cart?userId=${user.id}`);
            console.log('Cart response:', response.data);
            setCart(response.data);
            const count = response.data.itemCount || 0;
            setCartCount(count);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            setError(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const addToCart = async (productId, quantity) => {
        if (!user || !user.id) return false;
        
        setLoading(true);
        try {
            const response = await axiosInstance.post('/api/cart/add', {
                userId: user.id,
                productId: parseInt(productId),
                quantity: parseInt(quantity)
            });
            
            setCart(response.data);
            const count = response.data.itemCount || 0;
            setCartCount(count);
            return true;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (!user || !user.id) return false;
        
        try {
            const response = await axiosInstance.put(
                `/api/cart/items/${cartItemId}?userId=${user.id}&quantity=${quantity}`
            );
            setCart(response.data);
            return true;
        } catch (error) {
            console.error('Failed to update quantity:', error);
            return false;
        }
    };

    const removeFromCart = async (cartItemId) => {
        if (!user || !user.id) return false;
        
        try {
            const response = await axiosInstance.delete(
                `/api/cart/items/${cartItemId}?userId=${user.id}`
            );
            setCart(response.data);
            const count = response.data.itemCount || 0;
            setCartCount(count);
            return true;
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            return false;
        }
    };

    const clearCart = async () => {
        if (!user || !user.id) return false;
        
        try {
            await axiosInstance.delete(`/api/cart/clear?userId=${user.id}`);
            setCart(null);
            setCartCount(0);
            return true;
        } catch (error) {
            console.error('Failed to clear cart:', error);
            return false;
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchCart();
        }
    }, [user, fetchCart]);

    // MAKE SURE ALL FUNCTIONS ARE RETURNED
    return { 
        cart, 
        cartCount, 
        loading, 
        error,
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart,
        fetchCart  // ← THIS MUST BE HERE
    };
};