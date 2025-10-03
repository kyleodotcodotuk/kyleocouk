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
import {
  NewPage, FavouritesPage, UserSettings, SecuritySettings,
  AllPosts, DraftPosts, PublishedPosts,
  Pages, CreatePage, ExistingPages, PageTemplates,
  Categories, CreateCategory, ManageCategories,
  AllUsers, RolesPermissions, UserGroups,
  Images, Videos, Documents
} from './components/admin';
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
          <Route path="/admin/settings/user" element={
            <ProtectedRoute>
              <UserSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings/security" element={
            <ProtectedRoute>
              <SecuritySettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/posts/create" element={
            <ProtectedRoute>
              <NewPage />
            </ProtectedRoute>
          } />
            <Route path="/admin/posts" element={<ProtectedRoute><AllPosts /></ProtectedRoute>} />
            <Route path="/admin/posts/drafts" element={<ProtectedRoute><DraftPosts /></ProtectedRoute>} />
            <Route path="/admin/posts/published" element={<ProtectedRoute><PublishedPosts /></ProtectedRoute>} />

            {/* Pages */}
            <Route path="/admin/pages" element={<ProtectedRoute><Pages /></ProtectedRoute>} />
            <Route path="/admin/pages/create" element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
            <Route path="/admin/pages/templates" element={<ProtectedRoute><PageTemplates /></ProtectedRoute>} />
            <Route path="/admin/pages/existing" element={<ProtectedRoute><ExistingPages /></ProtectedRoute>} />

            {/* Categories */}
            <Route path="/admin/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/admin/categories/create" element={<ProtectedRoute><CreateCategory /></ProtectedRoute>} />
            <Route path="/admin/categories/manage" element={<ProtectedRoute><ManageCategories /></ProtectedRoute>} />

            {/* Users */}
            <Route path="/admin/users" element={<ProtectedRoute><AllUsers /></ProtectedRoute>} />
            <Route path="/admin/users/roles" element={<ProtectedRoute><RolesPermissions /></ProtectedRoute>} />
            <Route path="/admin/users/groups" element={<ProtectedRoute><UserGroups /></ProtectedRoute>} />

            {/* Media */}
            <Route path="/admin/media/images" element={<ProtectedRoute><Images /></ProtectedRoute>} />
            <Route path="/admin/media/videos" element={<ProtectedRoute><Videos /></ProtectedRoute>} />
            <Route path="/admin/media/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/admin/favourites" element={
            <ProtectedRoute>
              <FavouritesPage />
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