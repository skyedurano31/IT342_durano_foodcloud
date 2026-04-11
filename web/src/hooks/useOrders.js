// src/hooks/useOrders.js
import { useState } from 'react';
import axiosInstance from '../api/axiosConfig';

export const useOrders = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkout = async (userId, orderDetails) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post('/api/orders/checkout', {
                userId,
                building: orderDetails.building,
                roomNumber: orderDetails.roomNumber,
                deliveryInstructions: orderDetails.deliveryInstructions || '',
                phoneNumber: orderDetails.phoneNumber,
                paymentMethod: orderDetails.paymentMethod
            });
            return { success: true, order: response.data };
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Checkout failed';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    const getOrder = async (orderId) => {
        try {
            const response = await axiosInstance.get(`/api/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch order:', error);
            return null;
        }
    };

    const getUserOrders = async (userId) => {
        try {
            const response = await axiosInstance.get(`/api/orders/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user orders:', error);
            return [];
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const response = await axiosInstance.post(`/api/orders/${orderId}/cancel`);
            return { success: true, order: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.message };
        }
    };

    return {
        loading,
        error,
        checkout,
        getOrder,
        getUserOrders,
        cancelOrder
    };
};