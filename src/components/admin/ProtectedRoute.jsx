import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUser } from '../../data/users';

export default function ProtectedRoute({ children, requiredPermissions = [] }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
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

  // Check specific settings routes
  const pathname = location.pathname;
  if (pathname === '/admin/settings/site') {
    const userPermissions = currentUser?.permissions || [];
    const hasSettingsPermission = userPermissions.includes('manage_settings') || 
                                  userPermissions.includes('system_settings') || 
                                  userPermissions.includes('*');
    
    if (!hasSettingsPermission) {
      // Redirect regular users to profile settings only
      return <Navigate to="/admin/settings/profile" replace />;
    }
  }

  return children;
}