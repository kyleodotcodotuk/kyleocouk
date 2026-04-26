import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-page"> 
        <div className="not-found-content">
           
          <h1>404 &middot; Page Not Found</h1>
          <p className="error-message">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="not-found-actions">
            <button onClick={goHome} className="btn btn-primary">
              <span className="btn-icon">🏠</span>
              Go Home
            </button>
            <button onClick={goBack} className="btn btn-secondary">
              <span className="btn-icon">←</span>
              Go Back
            </button>
          </div>

          <div className="helpful-links">
            <h3>You might find useful:</h3>
            <ul>
              <li><a href="/">Homepage</a></li>
              <li><a href="/admin/portfolio">Portfolio</a></li>
              <li><a href="/login">Admin Login</a></li>
            </ul>
          </div>
        </div>

        <div className="not-found-illustration">
          <div className="floating-elements">
            <div className="element element-1">💻</div>
            <div className="element element-2">🔍</div>
            <div className="element element-3">📄</div>
            <div className="element element-4">❓</div>
          </div>
        </div> 
    </div>
  );
}