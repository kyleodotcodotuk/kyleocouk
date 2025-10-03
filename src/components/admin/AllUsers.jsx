
import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAllUsers } from '../../data/users';

export default function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  return (
    <AdminLayout>
      <section className="cms-section">
        <h1>All Users</h1>
        <p>View and manage all users registered in your CMS.</p>
        <div className="users-card-list">
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="user-cards">
              {users.map(user => (
                <div className="user-card" key={user.id}>
                  <div className="user-card-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span className="user-card-initials">{user.initials || user.name[0]}</span>
                    )}
                  </div>
                  <div className="user-card-info">
                    <h3 className="user-card-name">{user.name}</h3>
                    <div className="user-card-role">{user.role}</div>
                    <div className="user-card-detail"><span className="material-icons">person</span> {user.username}</div>
                    <div className="user-card-detail"><span className="material-icons">email</span> {user.email}</div>
                    <div className="user-card-detail"><span className="material-icons">location_on</span> {user.location}</div>
                    <div className={`user-card-status ${user.isActive ? 'active' : 'inactive'}`}>{user.status || (user.isActive ? 'Active' : 'Inactive')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}
