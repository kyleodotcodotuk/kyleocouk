
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../common/LoadingSpinner';

const LOCAL_KEY = 'cms_images';

export default function Images() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  // Load images from localStorage
  useEffect(() => {
    const fetchImages = () => {
      setError('');
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
      setFiles(local);
    };
    fetchImages();
  }, [uploading]);

  // Handle file upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
        local.push({ name: file.name, data: reader.result });
        localStorage.setItem(LOCAL_KEY, JSON.stringify(local));
        setFiles(local);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
  };

  // Handle preview
  const handlePreview = (file) => {
    setPreviewUrl(file.data);
  };

  return (
    <AdminLayout>
      <section className="cms-section">
        <h1>Images</h1>
        <p>Manage your image library. Upload, edit, or delete images here.</p>
        <form
          onSubmit={e => e.preventDefault()}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}
        >
          <label htmlFor="image-upload" style={{ fontWeight: 600 }}>Select an image to upload:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              style={{ flex: 1 }}
              onChange={e => {
                handleUpload(e);
                e.target.value = '';
              }}
              disabled={uploading}
            />
            <button
              type="button"
              onClick={() => document.getElementById('image-upload').click()}
              disabled={uploading}
              style={{ padding: '0.5rem 1.2rem', fontWeight: 600 }}
            >
              Upload
            </button>
          </div>
          {uploading && <LoadingSpinner message="Uploading..." />}
          {error && <div className="error-message">{error}</div>}
        </form>
        <div className="file-tree">
          {files.length === 0 && <p>No images uploaded yet.</p>}
          <ul>
            {files.map((file) => (
              <li key={file.id || file.name}>
                <button type="button" onClick={() => handlePreview(file)}>
                  {file.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {previewUrl && (
          <div className="file-preview">
            <img src={previewUrl} alt="Preview" style={{ maxWidth: 400, maxHeight: 400 }} />
            <button onClick={() => setPreviewUrl(null)}>Close Preview</button>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
