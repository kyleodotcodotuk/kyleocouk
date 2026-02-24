import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider, useContent } from './contexts/ContentContext';
import { Main, NotFound } from "./components";
import Login from './components/admin/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import Portfolio from './components/admin/Portfolio';
import ProjectEditor from './components/admin/ProjectEditor';
import BlogManager from './components/admin/BlogManager';
import BlogEditor from './components/admin/BlogEditor';
import MediaLibrary from './components/admin/MediaLibrary';
import Settings from './components/admin/Settings';
import UserManager from './components/admin/UserManager';
import PortfolioPage from './components/PortfolioPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import {
  FavouritesPage
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
          
          {/* Public Portfolio routes */}
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Portfolio Management */}
          <Route path="/admin/portfolio" element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          } />
          <Route path="/admin/portfolio/projects" element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          } />
          <Route path="/admin/portfolio/projects/create" element={
            <ProtectedRoute>
              <ProjectEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/portfolio/projects/edit/:id" element={
            <ProtectedRoute>
              <ProjectEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/portfolio/skills" element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          } />

          {/* Blog Management */}
          <Route path="/admin/blog" element={
            <ProtectedRoute>
              <BlogManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/blog/posts" element={
            <ProtectedRoute>
              <BlogManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/blog/drafts" element={
            <ProtectedRoute>
              <BlogManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/blog/create" element={
            <ProtectedRoute>
              <BlogEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/blog/edit/:id" element={
            <ProtectedRoute>
              <BlogEditor />
            </ProtectedRoute>
          } />

          {/* Media Library */}
          <Route path="/admin/media" element={
            <ProtectedRoute>
              <MediaLibrary />
            </ProtectedRoute>
          } />
          <Route path="/admin/media/images" element={
            <ProtectedRoute>
              <MediaLibrary />
            </ProtectedRoute>
          } />
          <Route path="/admin/media/videos" element={
            <ProtectedRoute>
              <MediaLibrary />
            </ProtectedRoute>
          } />
          <Route path="/admin/media/documents" element={
            <ProtectedRoute>
              <MediaLibrary />
            </ProtectedRoute>
          } />

          {/* User Management */}
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <UserManager />
            </ProtectedRoute>
          } />

          {/* Settings */}
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings/profile" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings/site" element={
            <ProtectedRoute requiredPermissions={['manage_settings', 'system_settings']}>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings/security" element={
            <ProtectedRoute requiredPermissions={['manage_settings', 'system_settings']}>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Favourites */}
          <Route path="/admin/favourites" element={
            <ProtectedRoute>
              <FavouritesPage />
            </ProtectedRoute>
          } />

          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
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
