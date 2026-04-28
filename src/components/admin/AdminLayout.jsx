import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../../data/users';
import Sidebar from './Sidebar'; 

export default function AdminLayout({ children }) {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dashboardInfo, setDashboardInfo] = useState({
    currentTime: new Date()
  });

  useEffect(() => {
    // Update time every second and track user activity
    const timer = setInterval(() => {
      setDashboardInfo(prev => ({
        ...prev,
        currentTime: new Date()
      }));
      
      // Update user activity every 30 seconds
      if (isAuthenticated) {
        usersAPI.updateUserActivity();
      }
    }, 1000);

    // Track user activity on page interactions
    const trackActivity = () => {
      if (isAuthenticated) {
        usersAPI.updateUserActivity();
      }
    };

    // Listen for user interactions
    window.addEventListener('click', trackActivity);
    window.addEventListener('keypress', trackActivity);
    window.addEventListener('scroll', trackActivity);

    return () => {
      clearInterval(timer);
      window.removeEventListener('click', trackActivity);
      window.removeEventListener('keypress', trackActivity);
      window.removeEventListener('scroll', trackActivity);
    };
  }, [isAuthenticated]);



  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

 

  const handleLogout = () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to logout?\n\nThis will end your current session and redirect you to the homepage.'
    );
    
    if (isConfirmed) {
      logout();
      navigate('/');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="back-end-admin">
      <div className="main-layout">
        {/* CMS HEADER */}
        <div className="cms-static-inside-header">
          
        <div className="inside-header-static-info">
          <span className="material-icons">radio_button_checked</span>
          {formatTime(dashboardInfo.currentTime)} <br /> 
           {formatDate(dashboardInfo.currentTime)}
        </div> 
        {/* Login buttons */}
        <div className="inside-header-actions">
          <button onClick={() => window.open('/', '_blank')} className="btn btn-primary">
            <span className="btn-icon"><span className="material-icons">subtitles</span></span>
            View Site
          </button>
          <button onClick={handleLogout} className="btn btn-logout">
            <span className="btn-icon"><span className="material-icons">exit_to_app</span></span>
            Logout
          </button>
        </div>
      </div>

      
  
          <Sidebar />
          <main className="container">
            {children}
          </main>
        </div> 
    </div>
  );
}