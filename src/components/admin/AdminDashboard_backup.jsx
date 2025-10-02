import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../../contexts/ContentContext';
import { getCurrentUser } from '../../data/users';
import AdministratorDashboard from './dashboards/AdministratorDashboard';
import OwnerDashboard from './dashboards/OwnerDashboard';
import EditorDashboard from './dashboards/EditorDashboard';
import AdminLayout from './AdminLayout';
import Avatar from '../common/Avatar';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { content } = useContent();
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

  // Function to get greeting based on user role and time
  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    const firstName = currentUser?.name?.split(' ')[0] || 'User';
    
    switch (currentUser?.role) {
      case 'Owner':
        return `${timeGreeting}, ${firstName}! Ready to manage your digital empire?`;
      case 'Administrator':
        return `${timeGreeting}, ${firstName}! All systems are under your control.`;
      case 'Editor':
        return `${timeGreeting}, ${firstName}! Time to create something amazing.`;
      default:
        return `${timeGreeting}, ${firstName}! Welcome to your dashboard.`;
    }
  };

  // Function to get role-specific dashboard title
  const getDashboardTitle = () => {
    switch (currentUser?.role) {
      case 'Owner':
        return 'Owner Command Center';
      case 'Administrator':
        return 'Administrator Control Panel';
      case 'Editor':
        return 'Content Management Hub';
      default:
        return 'User Dashboard';
    }
  };

  const managementSections = [
    {
      title: 'Family Profile',
      description: 'Manage personal and family information, bio, and contact details',
      action: () => navigate('/admin/personal'),
      icon: '◉',
      stats: '3 fields active'
    },
    {
      title: 'Skills & Experience',
      description: 'Update professional expertise and family achievements',
      action: () => navigate('/admin/expertise'),
      icon: '◈',
      stats: 'Last updated today'
    },
    {
      title: 'System Settings',
      description: 'Configure site preferences and administrative options',
      action: () => navigate('/admin/settings'),
      icon: '◎',
      stats: 'All systems normal'
    }
  ];

  const quickStats = [
    { label: 'Content Sections', value: '3', trend: 'stable' },
    { label: 'Last Update', value: 'Today', trend: 'up' },
    { label: 'Site Status', value: 'Active', trend: 'up' },
    { label: 'Admin Sessions', value: '1', trend: 'stable' }
  ];

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="dashboard-welcome">
          <Avatar name={currentUser?.name || content.personal.name} size="large" />
          <div className="welcome-text">
            <h2>{getDashboardTitle()}</h2>
            <p>{getPersonalizedGreeting()}</p>
            {currentUser && (
              <div className="user-context">
                <span className={`user-role-badge role-${currentUser.role.toLowerCase()}`}>
                  {currentUser.role}
                </span>
                <span className="user-location">{currentUser.location}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="dashboard-stats-overview">
          {quickStats.map((stat, index) => (
            <div key={index} className="stat-overview-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-trend trend-${stat.trend}`}>
                {stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→'}
              </div>
            </div>
          ))}
        </div>
        
        <div className="dashboard-grid">
          {managementSections.map((section, index) => (
            <div key={index} className="dashboard-card family-admin" onClick={section.action}>
              <div className="card-header">
                <div className="card-icon">{section.icon}</div>
                <div className="card-stats">{section.stats}</div>
              </div>
              <div className="card-content">
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
        
        <div className="dashboard-actions">
          <div className="action-card">
            <h4>Quick Actions</h4>
            <div className="action-buttons">
              <button onClick={() => navigate('/')} className="action-btn primary">
                <span className="btn-icon">🌐</span>
                View Live Site
              </button>
              <button onClick={() => navigate('/admin/personal')} className="action-btn secondary">
                <span className="btn-icon">✏️</span>
                Quick Edit
              </button>
              <button onClick={() => navigate('/admin/expertise')} className="action-btn secondary">
                <span className="btn-icon">🔄</span>
                Update Skills
              </button>
            </div>
          </div>
          
          <div className="action-card">
            <h4>Recent Activity</h4>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-time">2 hours ago</span>
                <span className="activity-desc">Profile information updated</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">1 day ago</span>
                <span className="activity-desc">Skills section modified</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">3 days ago</span>
                <span className="activity-desc">Site settings configured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}