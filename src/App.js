import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import { ToastProvider } from './contexts/ToastContext';
import { Main, NotFound } from "./components";
import {
  AdminDashboard,
  ComponentsPage,
  FavouritesPage,
  Login,
  MediaLibrary,
  ProtectedRoute,
  Settings
} from './components/admin';
import './sass/_all.scss';

const adminPages = [
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/admin/components', element: <ComponentsPage /> },
  { path: '/admin/media', element: <MediaLibrary /> },
  { path: '/admin/settings', element: <Settings /> },
  { path: '/admin/favourites', element: <FavouritesPage /> }
];

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <ToastProvider>
          <Router>
            <div className="default">
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/login" element={<Login />} />

                {adminPages.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<ProtectedRoute>{element}</ProtectedRoute>}
                  />
                ))}

                {/* 404 - Catch all unmatched routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
