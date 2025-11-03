import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../data/users';
import { postsAPI } from '../../data/posts';
import AdminLayout from './AdminLayout';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userContentStats, setUserContentStats] = useState([]);

  useEffect(() => {
    const loadDashboardData = () => {
      try {
        const user = usersAPI.getCurrentUser();
        setCurrentUser(user);

        // Get all users and their content
        const allUsers = usersAPI.getAllUsers();
        const allPosts = postsAPI.getAllPosts();

        const userStats = allUsers.map(user => {
          const userPosts = allPosts.filter(post => post.authorId === user.id);
          const publishedPosts = userPosts.filter(post => post.status === 'published');
          const draftPosts = userPosts.filter(post => post.status === 'draft');
          
          // Calculate real-time online status
          const onlineStatus = getOnlineStatus(user);

          return {
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            initials: user.initials,
            lastLogin: user.lastLogin,
            lastSeen: user.lastSeen,
            location: user.location,
            phone: user.phone,
            status: onlineStatus,
            totalPosts: userPosts.length,
            publishedPosts: publishedPosts.length,
            draftPosts: draftPosts.length,
            recentPost: userPosts.length > 0 ? userPosts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] : null
          };
        });

        setUserContentStats(userStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setUserContentStats([]);
      }
    };

    loadDashboardData();

    // Refresh dashboard data every 30 seconds for real-time status updates
    const refreshInterval = setInterval(loadDashboardData, 30000);

    // Listen for user changes via storage events
    const handleStorageChange = (e) => {
      if (e.key === 'cmsSession' || e.key === 'cmsUsers' || e.key === 'cmsPosts') {
        loadDashboardData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getOnlineStatus = (user) => {
    if (!user.lastSeen) return 'offline';
    
    const now = new Date();
    const lastSeen = new Date(user.lastSeen);
    const minutesAgo = Math.floor((now - lastSeen) / (1000 * 60));
    
    if (minutesAgo < 5) return 'online';
    if (minutesAgo < 30) return 'away';
    return 'offline';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FF9800';
      case 'offline': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  // Loading state
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

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Welcome back, {currentUser.name}!</h1>
          <p>Overview of users and their content contributions</p>
        </div>

        <div className="user-content-widget">
          <div className="widget-header">
            <h2>
              <span className="material-icons">people</span>
              Users & Content Overview
            </h2>
            <p>See what everyone's been working on</p>
          </div>

          <div className="user-content-grid">
            {userContentStats.map(user => (
              <div key={user.id} className="user-content-card">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span className="initials">{user.initials}</span>
                    )}
                    <div 
                      className="status-indicator" 
                      style={{ backgroundColor: getStatusColor(user.status) }}
                      title={getStatusText(user.status)}
                    ></div>
                  </div>
                  
                  <div className="user-details">
                    <h3>
                      {user.name}
                      <span className="online-status">{getStatusText(user.status)}</span>
                    </h3>
                    <p className="user-location">
                      <span className="material-icons">location_on</span>
                      {user.location || 'Location not set'}
                    </p>
                    {user.phone && (
                      <p className="user-phone">
                        <span className="material-icons">phone</span>
                        {user.phone}
                      </p>
                    )}
                    <p className="last-login">
                      Last login: {formatDate(user.lastLogin)}
                    </p>
                  </div>
                </div>

                <div className="content-stats">
                  <div className="stat-row">
                    <div className="stat-item">
                      <span className="stat-number">{user.totalPosts}</span>
                      <span className="stat-label">Total Posts</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{user.publishedPosts}</span>
                      <span className="stat-label">Published</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{user.draftPosts}</span>
                      <span className="stat-label">Drafts</span>
                    </div>
                  </div>

                  {user.recentPost && (
                    <div className="recent-post">
                      <span className="material-icons">article</span>
                      <div className="post-info">
                        <p className="post-title">{user.recentPost.title}</p>
                        <p className="post-date">
                          {formatDate(user.recentPost.updatedAt)}
                        </p>
                      </div>
                      <span className={`post-status ${user.recentPost.status}`}>
                        {user.recentPost.status}
                      </span>
                    </div>
                  )}

                  {!user.recentPost && user.totalPosts === 0 && (
                    <div className="no-content">
                      <span className="material-icons">edit_note</span>
                      <p>No content created yet</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {userContentStats.length === 0 && (
            <div className="empty-state">
              <span className="material-icons">people_outline</span>
              <h3>No users found</h3>
              <p>There are no users in the system yet.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}