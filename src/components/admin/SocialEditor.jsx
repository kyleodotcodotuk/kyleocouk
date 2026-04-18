import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

export default function SocialEditor() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const handleSave = () => {
    alert('Content saved');
  };

  return (
    <AdminLayout>
      <div className="editor-container">
        <h1>Social Editor</h1>
        
        <div className="form-group">
          <label>Content</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit content here"
            rows="15"
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin')}>Back</button>
        </div>
      </div>
    </AdminLayout>
  );
}
