import React, { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

export default function PersonalEditor() {
  const { content, updateContent } = useContent();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: content.personal.name || '',
    title: content.personal.title || '',
    location: content.personal.location || '',
    email: content.personal.email || '',
    bio: content.personal.bio || ''
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
    updateContent('personal', formData);
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
          <h2>Edit Personal Information</h2>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Job Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="8"
              required
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
      </div>
    </AdminLayout>
  );
}