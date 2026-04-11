// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { register } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(form.username, form.email, form.password);
        if (result.success) {
            setSuccess('Registration successful! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Register</h1>
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({...form, username: e.target.value})}
                        style={styles.input}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({...form, password: e.target.value})}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.registerBtn}>Register</button>
                </form>
                
                <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' },
    card: { background: 'white', padding: '40px', borderRadius: '10px', width: '400px' },
    title: { textAlign: 'center', marginBottom: '20px' },
    error: { background: '#fee', color: '#c33', padding: '10px', borderRadius: '5px', marginBottom: '20px' },
    success: { background: '#efe', color: '#3c3', padding: '10px', borderRadius: '5px', marginBottom: '20px' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' },
    registerBtn: { width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    link: { textAlign: 'center', marginTop: '20px' }
};

export default Register;