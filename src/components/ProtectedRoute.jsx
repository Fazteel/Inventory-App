import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Jika token tidak ada, redirect ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, izinkan akses ke halaman
  return children;
};

export default ProtectedRoute;
