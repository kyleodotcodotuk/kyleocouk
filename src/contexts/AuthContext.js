import React, { createContext, useContext, useState } from 'react';

// The admin area is a front-end showcase, not a real CMS. "Signing in" just
// starts a demo session in this browser tab - there are no real accounts.
const SESSION_KEY = 'cms_demo_session';

export const DEMO_CREDENTIALS = { username: 'demo', password: 'demo' };

export const DEMO_USER = {
  name: "Kyle O'Connor",
  displayRole: 'Administrator',
  initials: 'KO',
  location: 'Manchester, UK',
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const readSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(readSession);

  const login = (username, password) => {
    const valid =
      username.trim().toLowerCase() === DEMO_CREDENTIALS.username &&
      password === DEMO_CREDENTIALS.password;
    if (valid) {
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch {
        // ignore - session just won't survive a refresh
      }
      setIsAuthenticated(true);
    }
    return valid;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user: isAuthenticated ? DEMO_USER : null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
