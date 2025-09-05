import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user doesn't have required role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'user') {
      return <Navigate to="/dashboard/db-dashboard" replace />;
    } else if (user.role === 'admin' || user.role === 'superadmin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    // Fallback to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 