import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../data/users';
import AdminLayout from './AdminLayout';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = usersAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1>Dashboard</h1>
        {currentUser ? (
          <div>
            <p>Welcome back!</p>
            <p>Admin CMS is ready for development.</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </AdminLayout>
  );
}
