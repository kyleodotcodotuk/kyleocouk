import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { usersAPI } from '../../data/users';
import Sidebar from './Sidebar'; 

export default function AdminLayout({ children }) {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardInfo, setDashboardInfo] = useState({
    currentTime: new Date(),
    userIP: 'Loading...',
    location: 'Loading...',
    sessionStart: localStorage.getItem('cms_session_start') || new Date().toISOString()
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

    // Get user IP and location
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setDashboardInfo(prev => ({
          ...prev,
          userIP: data.ip || 'Unknown',
          location: `${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`
        }));
      } catch (error) {
        setDashboardInfo(prev => ({
          ...prev,
          userIP: 'Private Network',
          location: 'Local Environment'
        }));
      }
    };

    // Set session start time if not exists
    if (!localStorage.getItem('cms_session_start')) {
      localStorage.setItem('cms_session_start', new Date().toISOString());
    }

    fetchUserInfo();

    return () => {
      clearInterval(timer);
      window.removeEventListener('click', trackActivity);
      window.removeEventListener('keypress', trackActivity);
      window.removeEventListener('scroll', trackActivity);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('admin-menu-open', isMobileMenuOpen);

    return () => {
      document.body.classList.remove('admin-menu-open');
    };
  }, [isMobileMenuOpen]);

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
      localStorage.removeItem('cms_session_start');
      logout();
      navigate('/');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="back-end-admin">
      <div className="admin-layout">
        <div className="admin-static-header">
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="material-icons">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
             
        <div className="admin-static-info">{formatTime(dashboardInfo.currentTime)} <br />
           {formatDate(dashboardInfo.currentTime)}
        </div> 
        {/* Login buttons */}
        <div className="admin-static-actions">
          <button onClick={() => window.open('/', '_blank')} className="btn btn-primary">
            <span className="btn-icon"><span className="material-icons">subtitles</span></span>
            View Site
          </button>
          <button onClick={handleLogout} className="btn btn-secondary">
            <span className="btn-icon"><span className="material-icons">exit_to_app</span></span>
            Logout
          </button>
        </div>
      </div>

      
        <div className="admin-body">
          <Sidebar isOpen={isMobileMenuOpen} onNavigate={closeMobileMenu} />
          <main className="admin-main">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}