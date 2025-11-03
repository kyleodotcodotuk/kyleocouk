import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { usersAPI, USER_ROLES } from '../../data/users';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'AUTHOR',
    location: '',
    phone: '',
    bio: ''
  });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = usersAPI.getAllUsers();
    setUsers(allUsers);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.createUser(formData);
      setShowCreateModal(false);
      resetForm();
      loadUsers();
      showNotification('User created successfully!', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.updateUser(editingUser.id, formData);
      setEditingUser(null);
      resetForm();
      loadUsers();
      showNotification('User updated successfully!', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await usersAPI.deleteUser(userId);
        loadUsers();
        showNotification('User deleted successfully!', 'success');
      } catch (error) {
        showNotification(error.message, 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      role: 'AUTHOR',
      location: '',
      phone: '',
      bio: ''
    });
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username,
      email: user.email,
      password: '', // Don't pre-fill password
      role: user.role,
      location: user.location || '',
      phone: user.phone || '',
      bio: user.bio || ''
    });
  };

  const showNotification = (message, type) => {
    // You can implement a toast notification system here
    alert(message);
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'green';
      case 'away': return 'orange';
      case 'offline': return 'gray';
      default: return 'gray';
    }
  };

  const currentUser = usersAPI.getCurrentUser();
  const canManageUsers = usersAPI.hasPermission('manage_users');

  if (!canManageUsers) {
    return (
      <AdminLayout>
        <div className="user-manager">
          <div className="access-denied">
            <span className="material-icons">block</span>
            <h2>Access Denied</h2>
            <p>You don't have permission to manage users.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="user-manager">
        <div className="user-header">
          <h1>User Management</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="material-icons">person_add</span>
            Add New User
          </button>
        </div>

        <div className="user-controls">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All Users ({users.length})
            </button>
            {Object.keys(USER_ROLES).map(role => (
              <button
                key={role}
                className={filter === role ? 'active' : ''}
                onClick={() => setFilter(role)}
              >
                {USER_ROLES[role].name} ({users.filter(u => u.role === role).length})
              </button>
            ))}
          </div>
        </div>

        <div className="users-table">
          <div className="table-header">
            <div className="col-user">User</div>
            <div className="col-role">Role</div>
            <div className="col-status">Status</div>
            <div className="col-last-login">Last Login</div>
            <div className="col-actions">Actions</div>
          </div>

          {filteredUsers.map(user => (
            <div key={user.id} className="table-row">
              <div className="col-user">
                <div className="user-info">
                  <div className="avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{user.initials}</span>
                    )}
                  </div>
                  <div className="user-details">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <span className="username">@{user.username}</span>
                  </div>
                </div>
              </div>

              <div className="col-role">
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {USER_ROLES[user.role]?.name || user.role}
                </span>
              </div>

              <div className="col-status">
                <div className="status-indicator">
                  <span 
                    className="status-dot"
                    style={{ backgroundColor: getStatusColor(user.status) }}
                  ></span>
                  <span className="status-text">{user.status}</span>
                </div>
              </div>

              <div className="col-last-login">
                {user.lastLogin ? (
                  <span>{formatDate(user.lastLogin)}</span>
                ) : (
                  <span className="never">Never</span>
                )}
              </div>

              <div className="col-actions">
                <div className="action-buttons">
                  <button
                    className="btn btn-icon"
                    onClick={() => openEditModal(user)}
                    title="Edit user"
                  >
                    <span className="material-icons">edit</span>
                  </button>
                  
                  {user.id !== currentUser?.id && (
                    <button
                      className="btn btn-icon danger"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete user"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <span className="material-icons">people</span>
              <h3>No users found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create New User</h2>
                <button 
                  className="btn btn-icon"
                  onClick={() => setShowCreateModal(false)}
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="modal-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="form-group">
                    <label>Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      required
                    >
                      {Object.entries(USER_ROLES).map(([key, role]) => (
                        <option key={key} value={key}>{role.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g., Manchester, UK"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="e.g., +44 7700 900123"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Brief description about the user"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Edit User</h2>
                <button 
                  className="btn btn-icon"
                  onClick={() => setEditingUser(null)}
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="modal-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      minLength={8}
                    />
                  </div>

                  <div className="form-group">
                    <label>Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      required
                      disabled={editingUser.id === currentUser?.id}
                    >
                      {Object.entries(USER_ROLES).map(([key, role]) => (
                        <option key={key} value={key}>{role.name}</option>
                      ))}
                    </select>
                    {editingUser.id === currentUser?.id && (
                      <small>You cannot change your own role</small>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g., Manchester, UK"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="e.g., +44 7700 900123"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Brief description about the user"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}