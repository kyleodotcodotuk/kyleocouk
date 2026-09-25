import React, { createContext, useContext, useEffect, useState } from 'react';
import defaultContent from '../data/content';

// Demo-only persistence: edits made in the admin are kept in this browser
// so "View site" reflects them. There is deliberately no server behind this.
const STORAGE_KEY = 'cms_content';

// Values shown in the theme editor when nothing has been customised.
// Keep in sync with src/sass/_tokens.scss.
export const THEME_DEFAULTS = {
  mainColour: '#4c436b',
  secondaryColour: '#729bbb',
  radius: 6,
};

// Theme overrides are written as inline custom properties on <html>, so they
// win over _tokens.scss everywhere. Shades, the sidebar and larger radii are
// derived from these in CSS, so they follow automatically. Empty values
// remove the override.
export const applyTheme = (theme = {}) => {
  const style = document.documentElement.style;
  const set = (name, value) =>
    value ? style.setProperty(name, value) : style.removeProperty(name);

  set('--main-colour', theme.mainColour);
  set('--secondary-colour', theme.secondaryColour);
  set('--border-radius', theme.radius !== '' && theme.radius != null ? `${theme.radius}px` : '');
};

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

const loadContent = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return defaultContent;
    return {
      personal: { ...defaultContent.personal, ...saved.personal },
      social: { ...defaultContent.social, ...saved.social },
      theme: { ...defaultContent.theme, ...saved.theme },
    };
  } catch {
    return defaultContent;
  }
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(loadContent);

  useEffect(() => {
    applyTheme(content.theme);
  }, [content.theme]);

  const updateContent = (section, data) => {
    setContent((prev) => {
      const next = { ...prev, [section]: { ...prev[section], ...data } };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable (private mode etc.) - keep the in-memory edit
      }
      return next;
    });
  };

  const resetContent = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setContent(defaultContent);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </ContentContext.Provider>
  );
};
