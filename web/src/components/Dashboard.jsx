import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try to get user from localStorage first (traditional login)
        let userData = localStorage.getItem('user');
        
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // For Google login, fetch from backend
          const response = await axiosInstance.get('/api/auth/me');
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        // Not authenticated, redirect to login
        navigate('/login');
      }
    };
    
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1>Dashboard</h1>
      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Welcome, {user.username}!</strong></p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Login Type:</strong> {user.authProvider === 'google' ? 'Google' : 'Username/Password'}</p>
      </div>
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;