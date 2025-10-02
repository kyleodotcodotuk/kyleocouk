import React, { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

export default function SocialEditor() {
  const { content, updateContent } = useContent();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    github: content.social.github || '',
    bitcoin: content.social.bitcoin || ''
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateContent('social', formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="content-editor">
        <div className="editor-header">
          <button onClick={() => navigate('/admin')} className="btn-back">
            ← Back to Dashboard
          </button>
          <h2>Edit Social Links</h2>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="github">GitHub URL:</label>
            <input
              type="url"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bitcoin">Bitcoin/Strike URL:</label>
            <input
              type="url"
              id="bitcoin"
              name="bitcoin"
              value={formData.bitcoin}
              onChange={handleChange}
              placeholder="https://strike.me/yourusername"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>

          {saved && <div className="success-message">Changes saved successfully!</div>}
        </form>

        <div className="editor-help">
          <h3>Social Links Help</h3>
          <p>Leave fields empty to hide those social links from your site.</p>
          <p>Make sure to include the full URL including https://</p>
        </div>
      </div>
    </AdminLayout>
  );
}