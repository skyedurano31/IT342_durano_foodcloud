import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Traditional Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = btoa(`${username}:${password}`);
      
      const response = await axiosInstance.get('/api/auth/me', {
        headers: { Authorization: `Basic ${token}` }
      });
      
      // Save user info
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('authToken', token);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.status === 401 ? 'Invalid username or password' : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axiosInstance.post('/api/auth/register', {
        username,
        email,
        password_hash: password
      });
      
      setSuccess('Registration successful! Please login.');
      setTimeout(() => {
        setIsLogin(true);
        setUsername('');
        setPassword('');
        setEmail('');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Login' : 'Register'}</h2>
      
      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '10px', background: '#ffeeee', borderRadius: '4px' }}>{error}</div>}
      {success && <div style={{ color: 'green', padding: '10px', marginBottom: '10px', background: '#eeffee', borderRadius: '4px' }}>{success}</div>}
      
      {/* Google Button - Only show on Login */}
      {isLogin && (
        <>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <span>🔵</span> Sign in with Google
          </button>
          
          <div style={{ textAlign: 'center', margin: '15px 0', color: '#666' }}>OR</div>
        </>
      )}
      
      {/* Traditional Login/Register Form */}
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          required
          disabled={loading}
        />

        {!isLogin && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
            disabled={loading}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '10px'
          }}
        >
          {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>

      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setError('');
          setSuccess('');
          setUsername('');
          setPassword('');
          setEmail('');
        }}
        style={{
          width: '100%',
          padding: '10px',
          background: 'none',
          border: 'none',
          color: '#007bff',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </button>
    </div>
  );
}

export default Login;