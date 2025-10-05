
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { supabase, isSupabaseAvailable } from '../../lib/supabase';
import LoadingSpinner from '../common/LoadingSpinner';

const LOCAL_KEY = 'cms_documents';

export default function Documents() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      setError('');
      if (isSupabaseAvailable()) {
        const { data, error } = await supabase.storage.from('documents').list('', { limit: 100 });
        if (error) setError(error.message);
        else setFiles(data || []);
      } else {
        const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
        setFiles(local);
      }
    };
    fetchDocs();
  }, [uploading]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      if (isSupabaseAvailable()) {
        const { error } = await supabase.storage.from('documents').upload(file.name, file, { upsert: true });
        if (error) setError(error.message);
      } else {
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

  const handlePreview = async (file) => {
    if (isSupabaseAvailable()) {
      const { data } = supabase.storage.from('documents').getPublicUrl(file.name);
      setPreviewUrl(data.publicUrl);
    } else {
      setPreviewUrl(file.data);
    }
  };

  return (
    <AdminLayout>
      <section className="cms-section">
        <h1>Documents</h1>
        <p>Manage your document library. Upload, edit, or delete documents here.</p>
        <input type="file" onChange={handleUpload} disabled={uploading} />
        {uploading && <LoadingSpinner message="Uploading..." />}
        {error && <div className="error-message">{error}</div>}
        <div className="file-tree">
          {files.length === 0 && <p>No documents uploaded yet.</p>}
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
            <iframe src={previewUrl} title="Document Preview" style={{ width: 400, height: 500, border: 0 }} />
            <button onClick={() => setPreviewUrl(null)}>Close Preview</button>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
