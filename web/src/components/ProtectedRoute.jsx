import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const auth = localStorage.getItem('auth');
  console.log('ProtectedRoute - auth exists:', !!auth);
  
  if (!auth) {
    console.log('No auth, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;