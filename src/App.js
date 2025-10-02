import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider, useContent } from './contexts/ContentContext';
import { Main } from "./components";
import Login from './components/admin/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import PersonalEditor from './components/admin/PersonalEditor';
import ExpertiseEditor from './components/admin/ExpertiseEditor';
import SettingsEditor from './components/admin/SettingsEditor';
import ProtectedRoute from './components/admin/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import './sass/_all.scss';

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { loading } = useContent();

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (loading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" message="Loading your content..." />
      </div>
    );
  }

  return (
    <Router>
      <div className={`${isDarkMode ? 'light-theme' : 'default'}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <>
              <button className="theme-changer" onClick={toggleTheme}>
                Switch theme to: {isDarkMode ? 'Dark' : 'High-Vis'}
              </button>
              <Main />
            </>
          } />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/personal" element={
            <ProtectedRoute>
              <PersonalEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/expertise" element={
            <ProtectedRoute>
              <ExpertiseEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <SettingsEditor />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;