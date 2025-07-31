import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface PrivateRouteProps {
  children?: ReactNode;
  requiredRole?: UserRole;
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { authState } = useAuth();
  const location = useLocation();
  const { isAuthenticated, user } = authState;

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRole && user?.role !== requiredRole) {
    // If Super Admin access is required but user is not Super Admin
    if (requiredRole === UserRole.SUPER_ADMIN && user?.role !== UserRole.SUPER_ADMIN) {
      // Redirect to dashboard with unauthorized message
      return <Navigate to="/dashboard" state={{ unauthorized: true }} replace />;
    }
  }

  // If there are children, render them, otherwise render the outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
