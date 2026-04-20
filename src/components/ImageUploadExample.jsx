/**
 * Example React Component: Image Upload with Optimized Display
 * Demonstrates using the image processing middleware
 */

import React, { useState } from 'react';
import useImageUpload from '../hooks/useImageUpload';
import './ImageUploadExample.scss';

export function ImageUploadExample() {
  const [preview, setPreview] = useState(null);
  const { uploadImage, loading, error, result } = useImageUpload();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Show preview of original file
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);

      // Upload and process
      await uploadImage(file);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="image-upload-container">
      <h2>Image Upload & Optimization</h2>

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />

      {/* Loading state */}
      {loading && <p className="status loading">Processing image...</p>}

      {/* Error state */}
      {error && <p className="status error">Error: {error}</p>}

      {/* Results */}
      {result && (
        <div className="results">
          <h3>Optimization Results</h3>

          {/* Original Image Info */}
          <div className="section">
            <h4>Original Image</h4>
            <ul>
              <li>
                Dimensions: {result.original.width} × {result.original.height}px
              </li>
              <li>Format: {result.original.format}</li>
              <li>Size: {(result.original.size / 1024).toFixed(2)} KB</li>
            </ul>
          </div>

          {/* Optimized Image Info */}
          <div className="section">
            <h4>Optimized WebP</h4>
            <ul>
              <li>
                Dimensions: {result.optimized.width} × {result.optimized.height}px
              </li>
              <li>Format: {result.optimized.format}</li>
              <li>Size: {(result.optimized.size / 1024).toFixed(2)} KB</li>
              <li>
                Compression:{' '}
                {(
                  ((result.original.size - result.optimized.size) /
                    result.original.size) *
                  100
                ).toFixed(1)}
                %
              </li>
            </ul>
          </div>

          {/* LQIP Preview */}
          <div className="section">
            <h4>Low-Quality Image Placeholder (LQIP)</h4>
            <img
              src={result.lqip.base64}
              alt="LQIP"
              className="lqip-preview"
              title="LQIP - Used for optimistic UI blur effect"
            />
            <p className="lqip-info">
              {result.lqip.width} × {result.lqip.height}px (Base64 embedded)
            </p>
          </div>

          {/* Original Preview */}
          {preview && (
            <div className="section">
              <h4>Original Image Preview</h4>
              <img src={preview} alt="Original" className="preview-image" />
            </div>
          )}

          {/* JSON Response */}
          <div className="section json-response">
            <h4>Full API Response</h4>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploadExample;
