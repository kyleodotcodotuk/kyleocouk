import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUser } from '../../data/users';

export default function ProtectedRoute({ children, requiredPermissions = [] }) {
  const { isAuthenticated, loading } = useAuth();
 
  const currentUser = getCurrentUser();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check for specific route permissions
  if (requiredPermissions.length > 0 && currentUser) {
    const userPermissions = currentUser.permissions || [];
    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission) || userPermissions.includes('*')
    );

    if (!hasPermission) {
      // Redirect to dashboard if user doesn't have permission
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
}