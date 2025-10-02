import React, { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

export default function SettingsEditor() {
  const { resetContent } = useContent();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetContent = () => {
    resetContent();
    setShowResetConfirm(false);
    setMessage('All content has been reset to defaults!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogoutAndRedirect = () => {
    logout();
    navigate('/');
  };

  return (
    <AdminLayout>
      <div className="content-editor">
        <div className="editor-header">
          <button onClick={() => navigate('/admin')} className="btn-back">
            ← Back to Dashboard
          </button>
          <h2>Site Settings</h2>
        </div>

        <div className="edit-form">
          <h3>Content Management</h3>
          
          <div className="form-group">
            <label>Reset All Content</label>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              This will reset all your content (personal info and expertise) back to the original defaults.
              This action cannot be undone.
            </p>
            
            {!showResetConfirm ? (
              <button 
                onClick={() => setShowResetConfirm(true)}
                className="btn-danger"
                style={{ marginRight: '1rem' }}
              >
                Reset All Content
              </button>
            ) : (
              <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 1rem 0', color: '#856404' }}>
                  <strong>Are you sure?</strong> This will permanently reset all your content.
                </p>
                <button 
                  onClick={handleResetContent}
                  className="btn-danger"
                  style={{ marginRight: '0.5rem' }}
                >
                  Yes, Reset Everything
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

          <h3>Account Management</h3>
          
          <div className="form-group">
            <label>Session Management</label>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              End your current session and return to the public website.
            </p>
            <button 
              onClick={handleLogoutAndRedirect}
              className="btn-secondary"
            >
              Logout & Return to Site
            </button>
          </div>

          {message && <div className="success-message">{message}</div>}
        </div>

        <div className="editor-help">
          <h3>About Grey Cat CMS</h3>
          <p>This is a basic content management system built for your personal website.</p>
          <p>All changes are stored locally in your browser. For a production site, consider implementing a proper backend database.</p>
          <p>Current features include personal information editing and expertise management.</p>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#999' }}>
            Grey Cat CMS v1.0 | Built with React & localStorage
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}