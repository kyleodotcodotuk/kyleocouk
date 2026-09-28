import React, { createContext, useContext, useState } from 'react';

// The admin area is a front-end showcase, not a real CMS. "Signing in" just
// starts a demo session in this browser tab - there are no real accounts.
// These details ship in the JavaScript bundle, so they aren't a security
// measure: the admin login just keeps the guest view as the public default.
const SESSION_KEY = 'cms_demo_session';

const ACCOUNTS = {
  guest: {
    password: 'guest',
    user: {
      name: 'Guest',
      isGuest: true,
      displayRole: 'Guest',
      icon: 'person',
      detailIcon: 'visibility',
      location: 'Viewing the demo',
    },
  },
  kyle: {
    password: 'admin',
    user: {
      name: "Kyle O'Connor",
      isGuest: false,
      displayRole: 'Administrator',
      initials: 'KO',
      detailIcon: 'location_on',
      location: 'Manchester, UK',
    },
  },
};

// The public login offered on the sign-in page
export const DEMO_CREDENTIALS = { username: 'guest', password: ACCOUNTS.guest.password };

// Development shortcut for the admin button on the sign-in page - remove for live
export const ADMIN_CREDENTIALS = { username: 'kyle', password: ACCOUNTS.kyle.password };

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
    const saved = sessionStorage.getItem(SESSION_KEY);
    // Sessions from before accounts existed stored 'true'; treat them as guests
    if (saved === 'true') return 'guest';
    return ACCOUNTS[saved] ? saved : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(readSession);

  const login = (enteredUsername, password) => {
    const key = enteredUsername.trim().toLowerCase();
    const valid = Boolean(ACCOUNTS[key]) && ACCOUNTS[key].password === password;
    if (valid) {
      try {
        sessionStorage.setItem(SESSION_KEY, key);
      } catch {
        // ignore - session just won't survive a refresh
      }
      setUsername(key);
    }
    return valid;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setUsername(null);
  };

  const user = username ? ACCOUNTS[username].user : null;

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(user), user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
