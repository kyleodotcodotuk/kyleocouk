import React, { createContext, useContext, useState } from 'react';
import defaultContent from '../data/content';

// Demo-only persistence: edits made in the admin are kept in this browser
// so "View site" reflects them. There is deliberately no server behind this.
const STORAGE_KEY = 'cms_content';

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
    };
  } catch {
    return defaultContent;
  }
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(loadContent);

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
