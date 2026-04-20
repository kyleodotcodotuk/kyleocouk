/**
 * React Image Upload Hook
 * Custom hook for uploading images to the image processing server
 * 
 * Usage:
 *   const { uploadImage, loading, error, result } = useImageUpload();
 *   await uploadImage(file);
 */

import { useState } from 'react';

const API_URL = process.env.REACT_APP_IMAGE_UPLOAD_URL || 'http://localhost:3001';

export function useImageUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const uploadImage = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Upload processing failed');
      }

      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      console.error('Image upload error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadMultiple = async (files) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(`${API_URL}/upload-batch`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Batch upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Batch upload failed');
      }

      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      console.error('Batch upload error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadImage,
    uploadMultiple,
    loading,
    error,
    result,
  };
}

export default useImageUpload;
