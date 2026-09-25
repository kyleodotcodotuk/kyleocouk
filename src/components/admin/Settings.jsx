import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { applyTheme, THEME_DEFAULTS, useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import defaultContent from '../../data/content';

// WCAG relative luminance and contrast ratio, for the theme editor warning
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrastWithWhite = (hex) => 1.05 / (luminance(hex) + 0.05);

const TABS = [
  { id: 'profile', label: 'Profile', icon: 'account_circle' },
  { id: 'social', label: 'Social Links', icon: 'share' },
  { id: 'theme', label: 'Theme', icon: 'palette' },
];

export default function Settings() {
  const { content, updateContent, resetContent } = useContent();
  const [activeTab, setActiveTab] = useState('profile');
  const [draft, setDraft] = useState(content);
  const { showToast } = useToast();
  const tabRefs = useRef({});

  // Preview theme edits live across the whole CMS. Leaving the page puts
  // the saved theme back, so unsaved tweaks don't stick around.
  const savedTheme = useRef(content.theme);
  savedTheme.current = content.theme;
  useEffect(() => {
    applyTheme(draft.theme);
  }, [draft.theme]);
  useEffect(() => () => applyTheme(savedTheme.current), []);

  const handleChange = (section, key, value) => {
    setDraft((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const saveSettings = () => {
    updateContent('personal', draft.personal);
    updateContent('social', draft.social);
    updateContent('theme', draft.theme);
    showToast({ type: 'success', message: 'Saved. Open "View Site" to see your changes.' });
  };

  const handleReset = () => {
    resetContent();
    setDraft(defaultContent);
    showToast({ type: 'info', message: 'Content and theme reset to the defaults.' });
  };

  // Empty means 'not customised' (0 is a valid radius, so check explicitly)
  const themeValue = (key) =>
    draft.theme[key] === '' || draft.theme[key] == null ? THEME_DEFAULTS[key] : draft.theme[key];
  const mainContrast = contrastWithWhite(themeValue('mainColour'));

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
    const { multiline, hint, ...rest } = props;
    return (
      <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <Input
          id={id}
          value={draft[section][key] || ''}
          onChange={(e) => handleChange(section, key, e.target.value)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          {...rest}
        />
        {hint && <small id={`${id}-hint`}>{hint}</small>}
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
                    {field('personal', 'tagline', 'Tagline', { multiline: true, rows: 2 })}
                    {field('personal', 'location', 'Location', { type: 'text' })}
                    {field('personal', 'skills', 'Skills', {
                      type: 'text',
                      hint: 'Separate skills with commas. Three or four works best.',
                    })}
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
                    <p>Leave a field empty to hide that link.</p>
                    {field('social', 'github', 'GitHub URL', { type: 'url' })}
                    {field('social', 'linkedin', 'LinkedIn URL', { type: 'url' })}
                    {field('social', 'cv', 'CV URL', { type: 'url', hint: 'A link to a PDF or online CV.' })}
                  </div>
                )}

                {activeTab === 'theme' && (
                  <div
                    className="settings-section"
                    role="tabpanel"
                    id="panel-theme"
                    aria-labelledby="tab-theme"
                  >
                    <h2>Theme</h2>
                    <p>Changes preview live across the CMS. Save to apply them to the homepage too.</p>

                    <div className="form-group theme-field">
                      <label htmlFor="theme-main">Main colour</label>
                      <input
                        id="theme-main"
                        type="color"
                        value={themeValue('mainColour')}
                        onChange={(e) => handleChange('theme', 'mainColour', e.target.value)}
                        aria-describedby="theme-main-contrast"
                      />
                      <small id="theme-main-contrast">
                        White text contrast: {mainContrast.toFixed(1)}:1
                        {mainContrast < 4.5 ? ' - below the WCAG AA minimum of 4.5:1' : ' - passes WCAG AA'}
                      </small>
                    </div>

                    <div className="form-group theme-field">
                      <label htmlFor="theme-secondary">Secondary colour</label>
                      <input
                        id="theme-secondary"
                        type="color"
                        value={themeValue('secondaryColour')}
                        onChange={(e) => handleChange('theme', 'secondaryColour', e.target.value)}
                      />
                    </div>

                    <div className="form-group theme-field">
                      <label htmlFor="theme-radius">Corner radius</label>
                      <input
                        id="theme-radius"
                        type="range"
                        min="0"
                        max="24"
                        value={themeValue('radius')}
                        onChange={(e) => handleChange('theme', 'radius', Number(e.target.value))}
                        aria-valuetext={`${themeValue('radius')} pixels`}
                      />
                      <output htmlFor="theme-radius">{themeValue('radius')}px</output>
                    </div>
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
