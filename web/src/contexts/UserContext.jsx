// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                const response = await axiosInstance.get('/api/auth/me');
                console.log('User data with ID:', response.data);
                // Now response.data includes { id, username, email, role, authProvider }
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const token = btoa(`${username}:${password}`);
            const response = await axiosInstance.get('/api/auth/me', {
                headers: { Authorization: `Basic ${token}` }
            });
            console.log('Login response with ID:', response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('authToken', token);
            setUser(response.data);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Invalid credentials' };
        }
    };

    const register = async (username, email, password) => {
        try {
            await axiosInstance.post('/api/auth/register', {
                username,
                email,
                password_hash: password
            });
            return { success: true };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const googleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <UserContext.Provider value={{ user, loading, login, register, logout, googleLogin }}>
            {children}
        </UserContext.Provider>
    );
};