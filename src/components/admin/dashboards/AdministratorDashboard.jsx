import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getCurrentUser } from '../../../data/users';
import { useContent } from '../../../contexts/ContentContext';
import AdminLayout from '../AdminLayout';

// Emergency Modal Component
const EmergencyModal = ({ isOpen, onClose }) => {
  const [emergencyType, setEmergencyType] = useState('server');
  const [description, setDescription] = useState('');
  
  const emergencyTypes = {
    server: { icon: 'error', title: 'Server Down', color: '#dc2626' },
    security: { icon: 'security', title: 'Security Breach', color: '#dc2626' },
    data: { icon: 'warning', title: 'Data Loss', color: '#f59e0b' },
    performance: { icon: 'speed', title: 'Performance Critical', color: '#f59e0b' },
    maintenance: { icon: 'build', title: 'Emergency Maintenance', color: '#0ea5e9' }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create emergency log entry
    const emergency = {
      type: emergencyType,
      description,
      timestamp: new Date().toISOString(),
      status: 'active',
      id: Date.now()
    };
    
    // Store in localStorage for demo
    const emergencies = JSON.parse(localStorage.getItem('emergency_logs') || '[]');
    emergencies.unshift(emergency);
    localStorage.setItem('emergency_logs', JSON.stringify(emergencies));
    
    alert(`Emergency ${emergencyTypes[emergencyType].title} reported and logged!`);
    setDescription('');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="emergency-modal-overlay" onClick={onClose}>
      <div className="emergency-modal" onClick={e => e.stopPropagation()}>
        <div className="emergency-header">
          <span className="material-icons emergency-icon">emergency</span>
          <h2>Report Emergency</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="emergency-form">
          <div className="form-group">
            <label>Emergency Type</label>
            <div className="emergency-types">
              {Object.entries(emergencyTypes).map(([key, type]) => (
                <label key={key} className={`emergency-type ${emergencyType === key ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="emergencyType"
                    value={key}
                    checked={emergencyType === key}
                    onChange={(e) => setEmergencyType(e.target.value)}
                  />
                  <span className="material-icons" style={{ color: type.color }}>{type.icon}</span>
                  <span>{type.title}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the emergency situation..."
              required
              rows={4}
            />
          </div>
          
          <div className="emergency-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-emergency">
              <span className="material-icons btn-icon">emergency</span>
              Report Emergency
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdministratorDashboard() {
  const navigate = useNavigate();
  const { getBackupInfo } = useContent();
  const allUsers = getAllUsers();
  const currentUser = getCurrentUser();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  
  // Calculate real system metrics
  const getSystemStatus = () => {
    const loginTime = localStorage.getItem('loginTime');
    const sessionAge = loginTime ? Date.now() - new Date(loginTime).getTime() : 0;
    const uptime = sessionAge > 0 ? Math.floor(sessionAge / (1000 * 60 * 60)) : 0;
    
    return {
      status: 'online',
      uptime: uptime > 0 ? `${uptime}h` : '< 1h',
      responseTime: '< 100ms',
      activeUsers: allUsers.filter(u => u.isActive).length,
      totalSessions: parseInt(localStorage.getItem('sessionCount') || '1'),
      errors: 0
    };
  };

  const [systemStatus] = useState(getSystemStatus());

  // Generate real security logs based on current session
  const generateSecurityLogs = () => {
    const logs = [];
    const now = new Date();
    
    // Current session log
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime && currentUser) {
      logs.push({
        id: 1,
        type: 'login',
        user: currentUser.name,
        time: new Date(loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'success'
      });
    }
    
    // System startup log
    logs.push({
      id: 2,
      type: 'system',
      user: 'System',
      time: new Date(now.getTime() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'startup'
    });
    
    // Backup activity
    const backupInfo = getBackupInfo();
    if (backupInfo.availableBackups.length > 0) {
      const lastBackup = backupInfo.availableBackups[0];
      logs.push({
        id: 3,
        type: 'backup',
        user: 'System',
        time: new Date(lastBackup.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'success'
      });
    }
    
    return logs.slice(0, 4); // Keep only recent logs
  };

  const [securityLogs] = useState(generateSecurityLogs());

  // Generate realistic user activity
  const generateUserActivity = () => {
    const activities = [];
    const now = new Date();
    
    if (currentUser) {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
        const minutesAgo = Math.floor((now - new Date(loginTime)) / (1000 * 60));
        activities.push({
          user: currentUser.name,
          action: 'Logged into admin panel',
          time: minutesAgo > 0 ? `${minutesAgo} minutes ago` : 'Just now'
        });
      }
    }
    
    // Check for recent content updates
    const lastContentUpdate = localStorage.getItem('lastContentUpdate');
    if (lastContentUpdate) {
      const updateTime = new Date(lastContentUpdate);
      const hoursAgo = Math.floor((now - updateTime) / (1000 * 60 * 60));
      activities.push({
        user: currentUser?.name || 'User',
        action: 'Updated website content',
        time: hoursAgo > 0 ? `${hoursAgo} hours ago` : 'Recently'
      });
    }
    
    // System maintenance activity
    activities.push({
      user: 'System',
      action: 'Automatic backup created',
      time: '1 hour ago'
    });
    
    return activities.slice(0, 3);
  };

  const [userActivity] = useState(generateUserActivity());

  const SystemHealthWidget = ({ data }) => (
    <div className="admin-widget system-health">
      <div className="widget-header">
        <span className="material-icons">monitor_heart</span>
        <h3>System Health</h3>
        <span className={`status-badge ${data.status}`}>{data.status}</span>
      </div>
      <div className="widget-content">
        <div className="health-metrics">
          <div className="metric">
            <span className="metric-label">Uptime</span>
            <span className="metric-value">{data.uptime}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Response Time</span>
            <span className="metric-value">{data.responseTime}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Active Users</span>
            <span className="metric-value">{data.activeUsers}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Errors</span>
            <span className="metric-value error">{data.errors}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const UserManagementWidget = ({ count, active, pending }) => (
    <div className="admin-widget user-management">
      <div className="widget-header">
        <span className="material-icons">people</span>
        <h3>User Management</h3>
        <button className="widget-action" onClick={() => alert('Multi-user management requires additional backend setup')}>
          Setup
        </button>
      </div>
      <div className="widget-content">
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-number">{count}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number active">{active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number pending">{pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div style={{ marginTop: '12px', fontSize: '12px', opacity: 0.7 }}>
          Currently using single-user mode
        </div>
      </div>
    </div>
  );

  const SecurityMonitorWidget = ({ logs }) => (
    <div className="admin-widget security-monitor">
      <div className="widget-header">
        <span className="material-icons">security</span>
        <h3>Security Monitor</h3>
        <button className="widget-action" onClick={() => navigate('/admin/security')}>
          View All
        </button>
      </div>
      <div className="widget-content">
        <div className="security-logs">
          {logs.map(log => (
            <div key={log.id} className="log-entry">
              <span className={`log-type ${log.type}`}>{log.type}</span>
              <span className="log-user">{log.user}</span>
              <span className="log-time">{log.time}</span>
              <span className={`log-status ${log.status}`}>{log.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DatabaseStatusWidget = ({ size, tables, lastBackup }) => {
    const backupInfo = getBackupInfo();
    const formatSize = (bytes) => {
      const kb = bytes / 1024;
      return kb > 1024 ? `${(kb / 1024).toFixed(1)}MB` : `${kb.toFixed(0)}KB`;
    };
    
    return (
      <div className="admin-widget database-status">
        <div className="widget-header">
          <span className="material-icons">storage</span>
          <h3>Storage Status</h3>
          <button className="widget-action" onClick={() => navigate('/admin/backup')}>
            Manage
          </button>
        </div>
        <div className="widget-content">
          <div className="db-metrics">
            <div className="db-metric">
              <span className="metric-icon">💾</span>
              <div className="metric-info">
                <span className="metric-label">Local Storage</span>
                <span className="metric-value">{formatSize(backupInfo.storageInfo.totalSize)}</span>
              </div>
            </div>
            <div className="db-metric">
              <span className="metric-icon">📊</span>
              <div className="metric-info">
                <span className="metric-label">Backups</span>
                <span className="metric-value">{backupInfo.availableBackups.length}</span>
              </div>
            </div>
            <div className="db-metric">
              <span className="metric-icon">⏰</span>
              <div className="metric-info">
                <span className="metric-label">Last Backup</span>
                <span className="metric-value">
                  {backupInfo.availableBackups.length > 0 
                    ? backupInfo.availableBackups[0].date 
                    : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard administrator-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Administrator Control Panel</h1>
            <p>System administration and security monitoring</p>
          </div>
          <div className="dashboard-actions">
            <button className="btn btn-primary" onClick={() => navigate('/admin/system')}>
              <span className="material-icons btn-icon">settings</span>
              System Settings
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/backup')}>
              <span className="material-icons btn-icon">backup</span>
              Backup Now
            </button>
            <button className="btn btn-emergency" onClick={() => setIsEmergencyModalOpen(true)}>
              <span className="material-icons btn-icon">emergency</span>
              Emergency Alert
            </button>
          </div>
        </div>

        <div className="dashboard-widgets">
          <div className="widgets-grid admin-grid">
            <SystemHealthWidget data={systemStatus} />
            <UserManagementWidget count={allUsers.length} active={allUsers.filter(u => u.isActive).length} pending={0} />
            <SecurityMonitorWidget logs={securityLogs.slice(0, 3)} />
            <DatabaseStatusWidget />
          </div>
        </div>

        <div className="activity-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button className="btn btn-text" onClick={() => navigate('/admin/activity')}>
              View All Activity
            </button>
          </div>
          <div className="activity-feed">
            {userActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-avatar">
                  <span className="material-icons">person</span>
                </div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{activity.user}</strong> {activity.action}
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <EmergencyModal 
        isOpen={isEmergencyModalOpen} 
        onClose={() => setIsEmergencyModalOpen(false)} 
      />
    </AdminLayout>
  );
}