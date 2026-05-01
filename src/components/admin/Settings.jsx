import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import { getCurrentUser } from '../../data/users';

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Load current user on mount
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Check if user has admin permissions for site settings
  const hasAdminPermissions = useCallback(() => {
    if (!currentUser) return false;
    const permissions = currentUser.permissions || [];
    return permissions.includes('*') ||
           permissions.includes('manage_settings') || 
           permissions.includes('system_settings');
  }, [currentUser]);

  const handleTabChange = (newTab) => {
    // Check permissions before allowing tab change
    if (newTab === 'site' && !hasAdminPermissions()) {
      return; // Don't allow access
    }
    setActiveTab(newTab);
  };
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('portfolioSettings');
    const defaultSettings = {
      // Profile settings
      name: 'Kyle OConnor',
      email: 'hello@kyleo.co.uk',
      bio: 'Web designer and developer based in Manchester, UK',
      location: 'Manchester, UK',
      website: 'https://kyleo.co.uk',
      
      // Site settings
      siteTitle: 'Kyle O - Web Designer',
      siteDescription: 'Professional web design and development services',
      timezone: 'Europe/London',
      language: 'en-GB',
      cmsVersion: localStorage.getItem('cmsVersion') || 'Grey Cat v.1.2'
    };
    
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [editorContent, setEditorContent] = useState(() => {
    return localStorage.getItem('settingsEditorContent') || '';
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('portfolioSettings', JSON.stringify(settings));
    localStorage.setItem('cmsVersion', settings.cmsVersion);
    localStorage.setItem('settingsEditorContent', editorContent);
    alert('Settings saved successfully!');
  };

  return (
    <AdminLayout>
       <div className="dashboard">
        {/* Full sized widget */}
        <div className="fullWidth"> 
        <div className="widget">
          <h1>Settings</h1>
          <button className="btn btn-primary" onClick={saveSettings}>
            <span className="material-icons">save</span>
            Save Changes
          </button>


        <div className="settings-container">
          <div className="settings-sidebar">
            <div className="settings-nav">
              <button 
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => handleTabChange('profile')}
              >
                <span className="material-icons">account_circle</span>
                Profile
              </button>
              {hasAdminPermissions() && (
                <button 
                  className={activeTab === 'site' ? 'active' : ''}
                  onClick={() => handleTabChange('site')}
                >
                  <span className="material-icons">web</span>
                  Site Settings
                </button>
              )}
              <button 
                className={activeTab === 'editor' ? 'active' : ''}
                onClick={() => handleTabChange('editor')}
              >
                <span className="material-icons">edit</span>
                Settings Editor
              </button>
            </div>
          </div>

          <div className="settings-content">
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2>Profile Settings</h2>
                <p>Update your personal information and professional details.</p>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => handleSettingChange('name', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={settings.bio}
                    onChange={(e) => handleSettingChange('bio', e.target.value)}
                    rows={4}
                    placeholder="Tell visitors about yourself..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={settings.location}
                      onChange={(e) => handleSettingChange('location', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      value={settings.website}
                      onChange={(e) => handleSettingChange('website', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'site' && hasAdminPermissions() && (
              <div className="settings-section">
                <h2>Site Settings</h2>
                <p>Configure your website's global settings and preferences.</p>

                <div className="form-group">
                  <label>Site Title</label>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => handleSettingChange('siteTitle', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Site Description</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    rows={3}
                    placeholder="Brief description for SEO and social sharing"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    >
                      <option value="Europe/London">London (GMT/BST)</option>
                      <option value="America/New_York">New York (EST/EDT)</option>
                      <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
                      <option value="Europe/Paris">Paris (CET/CEST)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                    >
                      <option value="en-GB">English (UK)</option>
                      <option value="en-US">English (US)</option>
                      <option value="fr-FR">French</option>
                      <option value="de-DE">German</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>CMS Version</label>
                    <input
                      type="text"
                      value={settings.cmsVersion}
                      onChange={(e) => handleSettingChange('cmsVersion', e.target.value)}
                      placeholder="e.g., Grey Cat v.1.0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Fallback for non-admin users trying to access admin sections */}
            {!hasAdminPermissions() && (activeTab === 'site') && (
              <div className="settings-section">
                <h2>Access Restricted</h2>
                <p>You don't have permission to access this section. Only administrators can manage site settings.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleTabChange('profile')}
                >
                  <span className="material-icons">account_circle</span>
                  Go to Profile Settings
                </button>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="settings-section">
                <h2>Settings Editor</h2>
                <p>Edit custom settings content and configuration.</p>

                <div className="form-group">
                  <label>Content</label>
                  <textarea 
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Edit content here"
                    rows="15"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>        </div>
    </AdminLayout>
  );
}