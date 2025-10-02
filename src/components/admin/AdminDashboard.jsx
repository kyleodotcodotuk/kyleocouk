import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../data/users';
import AdministratorDashboard from './dashboards/AdministratorDashboard';
import OwnerDashboard from './dashboards/OwnerDashboard';
import EditorDashboard from './dashboards/EditorDashboard';
import AdminLayout from './AdminLayout';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };

    // Load user initially
    loadCurrentUser();

    // Listen for user changes via storage events
    const handleStorageChange = (e) => {
      if (e.key === 'currentUserId') {
        loadCurrentUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events for same-window updates
    const handleUserChange = () => {
      loadCurrentUser();
    };

    window.addEventListener('userChanged', handleUserChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChanged', handleUserChange);
    };
  }, []);

  // Route to appropriate dashboard based on user role
  if (!currentUser) {
    return (
      <AdminLayout>
        <div className="admin-dashboard loading">
          <div className="loading-spinner">
            <span className="material-icons">hourglass_empty</span>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Route users to their specific dashboard based on role
  switch (currentUser.role) {
    case 'Administrator':
      return <AdministratorDashboard />;
    case 'Owner':
      return <OwnerDashboard />;
    case 'Editor':
      return <EditorDashboard />;
    default:
      // Fallback for unknown roles - default to Editor dashboard
      return <EditorDashboard />;
  }
}