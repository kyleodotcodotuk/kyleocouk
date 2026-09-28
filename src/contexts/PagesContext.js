import React, { createContext, useContext, useState } from 'react';
import defaultPages from '../data/pages';

// Demo-only persistence, like ContentContext: pages are kept in this browser
const STORAGE_KEY = 'cms_pages';

const PagesContext = createContext();

export const usePages = () => {
  const context = useContext(PagesContext);
  if (!context) {
    throw new Error('usePages must be used within a PagesProvider');
  }
  return context;
};

const loadPages = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : defaultPages;
  } catch {
    return defaultPages;
  }
};

export const PagesProvider = ({ children, initialPages }) => {
  const [pages, setPages] = useState(() => initialPages || loadPages());

  const persist = (update) => {
    setPages((prev) => {
      const next = update(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable (private mode etc.) - keep the in-memory edit
      }
      return next;
    });
  };

  const savePage = (page) =>
    persist((prev) =>
      prev.some((p) => p.id === page.id) ? prev.map((p) => (p.id === page.id ? page : p)) : [...prev, page]
    );

  const deletePage = (id) => persist((prev) => prev.filter((p) => p.id !== id));

  const resetPages = () => persist(() => defaultPages);

  return (
    <PagesContext.Provider value={{ pages, savePage, deletePage, resetPages }}>
      {children}
    </PagesContext.Provider>
  );
};
