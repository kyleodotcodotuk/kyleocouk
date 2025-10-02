import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../data/users';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const availableUsers = getAllUsers();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials. Check the available users below.');
    }
    
    setLoading(false);
  };

  const handleQuickLogin = (user) => {
    setUsername(user.username);
    setPassword(user.password);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>CMS Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="available-users">
          <h3>Available Users</h3>
          <div className="users-grid">
            {availableUsers.map(user => (
              <div 
                key={user.id} 
                className="user-card"
                onClick={() => handleQuickLogin(user)}
              >
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="user-initials">{user.initials}</div>
                  )}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-role">{user.role}</div>
                  <div className="user-credentials">
                    <small>Username: {user.username}</small>
                    <small>Password: {user.password}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="login-hint">
            <small>Click on any user card to auto-fill their credentials</small>
          </p>
        </div>
      </div>
    </div>
  );
}