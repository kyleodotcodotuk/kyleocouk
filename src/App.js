import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import { ToastProvider } from './contexts/ToastContext';
import { PagesProvider } from './contexts/PagesContext';
import { Main, NotFound } from "./components";
import {
  AdminDashboard,
  ComponentsPage,
  Login,
  MediaLibrary,
  PageEditor,
  PagesList,
  ProtectedRoute,
  Settings
} from './components/admin';
import './sass/_all.scss';

const adminPages = [
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/admin/pages', element: <PagesList /> },
  { path: '/admin/pages/:pageId', element: <PageEditor /> },
  { path: '/admin/components', element: <ComponentsPage /> },
  { path: '/admin/media', element: <MediaLibrary /> },
  { path: '/admin/settings', element: <Settings /> }
];

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <PagesProvider>
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
        </PagesProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
