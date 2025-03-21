import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { RouteNames } from '../constants';

// Component to protect routes that require authentication
export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const isAdmin = AuthService.isAdmin();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={RouteNames.LOGIN} />;
  }

  // If route requires admin and user is not admin, redirect to home
  if (adminOnly && !isAdmin) {
    return <Navigate to={RouteNames.HOME} />;
  }

  // Otherwise, render the protected component
  return children;
};

// Component to protect routes that require admin privileges
export const AdminRoute = ({ children }) => {
  return <ProtectedRoute adminOnly={true}>{children}</ProtectedRoute>;
};

// Component to make routes read-only for non-admin users
export const ReadOnlyRoute = ({ children, component }) => {
  const isAdmin = AuthService.isAdmin();
  
  // If user is admin, render the editable component
  if (isAdmin) {
    return children;
  }
  
  // Otherwise, render the read-only component
  return component;
};
