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
        <section className="welcome widget">
        Your Dashboard 
        </section>
        {currentUser ? (
          <section className="widget">
            <h2>Welcome back !</h2>
            <p>Admin CMS is ready for development.</p>
          </section>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </AdminLayout>
  );
}
