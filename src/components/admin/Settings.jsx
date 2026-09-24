import React, { useState, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { useContent } from '../../contexts/ContentContext';
import defaultContent from '../../data/content';

const TABS = [
  { id: 'profile', label: 'Profile', icon: 'account_circle' },
  { id: 'social', label: 'Social Links', icon: 'share' },
];

export default function Settings() {
  const { content, updateContent, resetContent } = useContent();
  const [activeTab, setActiveTab] = useState('profile');
  const [draft, setDraft] = useState(content);
  const [status, setStatus] = useState(null);
  const tabRefs = useRef({});

  const handleChange = (section, key, value) => {
    setDraft((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    setStatus(null);
  };

  const saveSettings = () => {
    updateContent('personal', draft.personal);
    updateContent('social', draft.social);
    setStatus({ type: 'success', message: 'Saved. Open "View Site" to see your changes.' });
  };

  const handleReset = () => {
    resetContent();
    setDraft(defaultContent);
    setStatus({ type: 'info', message: 'Content reset to the defaults.' });
  };

  // Arrow-key navigation between tabs, per the WAI-ARIA tabs pattern
  const handleTabKeyDown = (e) => {
    const index = TABS.findIndex((tab) => tab.id === activeTab);
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % TABS.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActiveTab(TABS[next].id);
    tabRefs.current[TABS[next].id]?.focus();
  };

  const field = (section, key, label, props = {}) => {
    const id = `${section}-${key}`;
    const Input = props.multiline ? 'textarea' : 'input';
    const { multiline, ...rest } = props;
    return (
      <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <Input
          id={id}
          value={draft[section][key] || ''}
          onChange={(e) => handleChange(section, key, e.target.value)}
          {...rest}
        />
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="fullWidth">
          <div className="widget">
            <h1>Settings</h1>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={saveSettings}>
                <span className="material-icons" aria-hidden="true">save</span>
                Save Changes
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>
                <span className="material-icons" aria-hidden="true">restart_alt</span>
                Reset to defaults
              </button>
            </div>

            <div aria-live="polite">
              {status && (
                <div className={`alert alert-${status.type}`}>
                  <span className="material-icons" aria-hidden="true">
                    {status.type === 'success' ? 'check' : 'info'}
                  </span>
                  {status.message}
                </div>
              )}
            </div>

            <div className="settings-container">
              <div className="settings-sidebar">
                <div
                  className="settings-nav"
                  role="tablist"
                  aria-label="Settings sections"
                  aria-orientation="vertical"
                  onKeyDown={handleTabKeyDown}
                >
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      ref={(el) => (tabRefs.current[tab.id] = el)}
                      id={`tab-${tab.id}`}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`panel-${tab.id}`}
                      tabIndex={activeTab === tab.id ? 0 : -1}
                      className={activeTab === tab.id ? 'active' : ''}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="material-icons" aria-hidden="true">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-content">
                {activeTab === 'profile' && (
                  <div
                    className="settings-section"
                    role="tabpanel"
                    id="panel-profile"
                    aria-labelledby="tab-profile"
                  >
                    <h2>Profile</h2>
                    <p>These details appear on the public homepage.</p>
                    {field('personal', 'name', 'Full name', { type: 'text', autoComplete: 'name' })}
                    {field('personal', 'email', 'Email address', { type: 'email', autoComplete: 'email' })}
                    {field('personal', 'location', 'Location', { type: 'text' })}
                    {field('personal', 'bio', 'Bio', { multiline: true, rows: 5 })}
                  </div>
                )}

                {activeTab === 'social' && (
                  <div
                    className="settings-section"
                    role="tabpanel"
                    id="panel-social"
                    aria-labelledby="tab-social"
                  >
                    <h2>Social Links</h2>
                    <p>Leave a field empty to hide that icon.</p>
                    {field('social', 'github', 'GitHub URL', { type: 'url' })}
                    {field('social', 'bitcoin', 'Bitcoin / Strike URL', { type: 'url' })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
