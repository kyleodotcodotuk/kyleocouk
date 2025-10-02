import React, { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

export default function ExpertiseEditor() {
  const { content, updateContent } = useContent();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    description: content.expertise.description || ''
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
    updateContent('expertise', formData);
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
          <h2>Edit Expertise Content</h2>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="description">Expertise Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="10"
              placeholder="Describe your expertise and skills..."
              required
            />
            <small>Use line breaks to separate paragraphs.</small>
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