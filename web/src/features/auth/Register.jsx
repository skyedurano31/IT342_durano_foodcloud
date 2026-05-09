// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../shared/UserContext';

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
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: 'url("/images/loginbackground.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
    },
card: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(15px)',
    padding: '25px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '300px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
},
    title: {
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: '500',
        color: '#800000',
        marginBottom: '25px',
        paddingBottom: '10px',
        borderBottom: '2px solid #800000',
        display: 'inline-block',
        width: 'auto'
    },
    error: {
        background: '#f8d7da',
        color: '#721c24',
        padding: '10px 15px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '13px'
    },
    success: {
        background: '#d4edda',
        color: '#155724',
        padding: '10px 15px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '13px'
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        marginBottom: '15px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '13px',
        transition: 'border-color 0.2s'
    },
    registerBtn: {
        width: '100%',
        padding: '12px',
        background: '#800000',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'background 0.2s'
    },
    link: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '13px',
        color: '#555'
    }
};

// Add focus effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    input:focus {
        outline: none;
        border-color: #800000;
    }
    button:hover {
        opacity: 0.9;
    }
    a {
        color: #800000;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(styleSheet);

export default Register;