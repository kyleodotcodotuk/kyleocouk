
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { supabase, isSupabaseAvailable } from '../../lib/supabase';
import LoadingSpinner from '../common/LoadingSpinner';

const LOCAL_KEY = 'cms_images';

export default function Images() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  // Load images from Supabase or localStorage
  useEffect(() => {
    const fetchImages = async () => {
      setError('');
      if (isSupabaseAvailable()) {
        const { data, error } = await supabase.storage.from('images').list('', { limit: 100 });
        if (error) setError(error.message);
        else setFiles(data || []);
      } else {
        // Fallback: localStorage
        const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
        setFiles(local);
      }
    };
    fetchImages();
  }, [uploading]);

  // Handle file upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      if (isSupabaseAvailable()) {
        const { error } = await supabase.storage.from('images').upload(file.name, file, { upsert: true });
        if (error) setError(error.message);
      } else {
        // Fallback: localStorage (base64)
        const reader = new FileReader();
        reader.onload = () => {
          const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
          local.push({ name: file.name, data: reader.result });
          localStorage.setItem(LOCAL_KEY, JSON.stringify(local));
          setFiles(local);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
  };

  // Handle preview
  const handlePreview = async (file) => {
    if (isSupabaseAvailable()) {
      const { data } = supabase.storage.from('images').getPublicUrl(file.name);
      setPreviewUrl(data.publicUrl);
    } else {
      setPreviewUrl(file.data);
    }
  };

  return (
    <AdminLayout>
      <section className="cms-section">
        <h1>Images</h1>
        <p>Manage your image library. Upload, edit, or delete images here.</p>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        {uploading && <LoadingSpinner message="Uploading..." />}
        {error && <div className="error-message">{error}</div>}
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
