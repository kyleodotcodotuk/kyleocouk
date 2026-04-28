import React, { createContext, useContext, useState, useEffect } from 'react';
import cmsApi from '../services/cmsApi';
import { isRouteAvailable } from '../config/adminRoutes';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Validate and clean up user favorites on login
const validateAndCleanFavorites = () => {
  try {
    const storedFavorites = JSON.parse(localStorage.getItem('cmsFavourites')) || [];
    const validFavorites = storedFavorites.filter(fav => {
      if (!fav || !fav.path) return false;
      // Explicitly exclude removed pages by label or path
      if (fav.label === 'general' || fav.path.includes('/general') || fav.path === 'general') return false;
      return isRouteAvailable(fav.path);
    });
    
    if (validFavorites.length !== storedFavorites.length) {
      // Update favorites with only valid ones
      localStorage.setItem('cmsFavourites', JSON.stringify(validFavorites));
      console.log(`Cleaned up favorites: removed ${storedFavorites.length - validFavorites.length} invalid entries`);
    }
  } catch (error) {
    console.error('Error validating favorites:', error);
    // If there's an error, clear corrupted data
    localStorage.setItem('cmsFavourites', JSON.stringify([]));
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await cmsApi.getCurrentUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const result = await cmsApi.login(username, password);
      if (result.success) {
        setIsAuthenticated(true);
        // Validate and clean up favorites on login
        validateAndCleanFavorites();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await cmsApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};