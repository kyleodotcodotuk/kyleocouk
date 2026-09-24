import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="back-end-admin">
      <div className="main-layout">
        {/* CMS HEADER */}
        <div className="cms-static-inside-header">
          <div className="inside-header-static-info">
            <span className="material-icons" aria-hidden="true">radio_button_checked</span>
            <time dateTime={currentTime.toISOString()}>
              {formatTime(currentTime)} <br />
              {formatDate(currentTime)}
            </time>
          </div>
          {/* Header actions */}
          <div className="inside-header-actions">
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-primary">
              <span className="btn-icon"><span className="material-icons" aria-hidden="true">subtitles</span></span>
              View Site
            </a>
            <button onClick={handleLogout} className="btn btn-logout">
              <span className="btn-icon"><span className="material-icons" aria-hidden="true">exit_to_app</span></span>
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
