// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, googleLogin, user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/products');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (!result.success) setError(result.error);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Login</h1>
                {error && <div style={styles.error}>{error}</div>}
                
                <button onClick={googleLogin} style={styles.googleBtn}>
                    Login with Google
                </button>
                
                <div style={styles.divider}>OR</div>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.loginBtn}>Login</button>
                </form>
                
                <p style={styles.link}>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' },
    card: { background: 'white', padding: '40px', borderRadius: '10px', width: '400px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    title: { textAlign: 'center', marginBottom: '20px' },
    error: { background: '#fee', color: '#c33', padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' },
    googleBtn: { width: '100%', padding: '12px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' },
    divider: { textAlign: 'center', margin: '20px 0', color: '#666' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' },
    loginBtn: { width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    link: { textAlign: 'center', marginTop: '20px' }
};

export default Login;