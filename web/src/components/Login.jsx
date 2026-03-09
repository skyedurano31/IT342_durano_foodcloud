import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig.jsx';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const token = btoa(`${username}:${password}`);
      console.log('Logging in with:', username);
      
      const response = await axiosInstance.post('/auth/login', 
        { username, password },
        { headers: { Authorization: `Basic ${token}` } }
      );
      
      console.log('Login response:', response.data);
      
      localStorage.setItem('auth', JSON.stringify({
        token: token,
        username: response.data.username || username
      }));
      
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password_hash: password
      });
      
      console.log('Register response:', response.data);
      
      if (response.data.success) {
        setSuccess('Registration successful! You can now login.');
        setUsername('');
        setPassword('');
        setEmail('');
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 2000);
      } else {
        setError(response.data.message || 'Registration failed');
      }
      
    } catch (err) {
      console.error('Register error:', err);
      setError('Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      
      {error && <p style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>{error}</p>}
      {success && <p style={{ color: 'green', padding: '10px', border: '1px solid green', borderRadius: '4px' }}>{success}</p>}
      
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        {!isLogin && (
          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
              required
            />
          </div>
        )}

        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          {isLogin ? 'Login' : 'Register'}
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
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
}

export default Login;