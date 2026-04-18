import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';


export default function PersonalEditor() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const handleSave = () => {
    alert('Personal info saved');
  };

  return (
    <AdminLayout>
      <div className="editor-container">
        <h1>Personal Information</h1>
        
        <div className="form-group">
          <label>Content</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit personal information here"
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