import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import Breadcrumbs from './Breadcrumbs';
import useDocumentTitle, { CMS_NAME } from '../../hooks/useDocumentTitle';
import { confirmDiscardChanges } from '../../utils/unsavedChanges';

// `title` names the page in the tab and breadcrumbs. `parents` lists any
// pages between the dashboard and this one, as [{ label, to }].
export default function AdminLayout({ title, parents = [], showBreadcrumbs = true, children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useDocumentTitle(title ? `${title} · ${CMS_NAME}` : CMS_NAME);

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
    if (!confirmDiscardChanges()) return;
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
      {/* Handled in JS so the URL doesn't gain a #main that the router would see */}
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to main content
      </a>
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
            <CommandPalette onLogout={handleLogout} />
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
        <main className="container" id="main-content" tabIndex={-1} ref={mainRef}>
          {title && showBreadcrumbs && <Breadcrumbs parents={parents} current={title} />}
          {children}
        </main>
      </div>
    </div>
  );
}
