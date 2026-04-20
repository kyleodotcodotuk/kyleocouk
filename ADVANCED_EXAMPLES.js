/**
 * Advanced Image Processing Examples
 * Additional use cases and advanced patterns for the image optimization system
 */

// ============================================================================
// EXAMPLE 1: Express Route with File Saving
// ============================================================================

import express from 'express';
import multer from 'multer';
import path from 'path';
import { processImage, saveProcessedImage } from './src/services/imageProcessingMiddleware.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Advanced upload endpoint with database storage
app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await processImage(req.file.buffer, req.file.originalname);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Save the optimized WebP
    const filename = `${Date.now()}_${result.filename}`;
    const filepath = path.join('public/uploads', filename);
    await saveProcessedImage(result.optimized.buffer, filepath);

    // Save metadata to database
    const imageRecord = {
      filename: filename,
      originalName: req.file.originalname,
      originalWidth: result.original.width,
      originalHeight: result.original.height,
      optimizedWidth: result.optimized.width,
      optimizedHeight: result.optimized.height,
      originalSize: result.original.size,
      optimizedSize: result.optimized.size,
      lqip: result.lqip.base64,
      url: `/uploads/${filename}`,
      uploadedAt: new Date(),
      compression: (
        ((result.original.size - result.optimized.size) / result.original.size) *
        100
      ).toFixed(2),
    };

    // TODO: Save imageRecord to database (MongoDB, PostgreSQL, etc.)
    // await db.collection('images').insertOne(imageRecord);

    res.json({
      success: true,
      image: imageRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================================
// EXAMPLE 2: React Component with Progressive Image Loading
// ============================================================================

/*
import React, { useState, useEffect } from 'react';
import useImageUpload from '../hooks/useImageUpload';

function ProgressiveImageUpload() {
  const [imageData, setImageData] = useState(null);
  const [displayMode, setDisplayMode] = useState('lqip'); // lqip | blur | final
  const { uploadImage, loading, error } = useImageUpload();

  const handleImageSelect = async (file) => {
    setDisplayMode('lqip');
    try {
      const data = await uploadImage(file);
      setImageData(data);
      
      // Simulate loading the final image
      setTimeout(() => setDisplayMode('final'), 1500);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="progressive-upload">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageSelect(e.target.files[0])}
        disabled={loading}
      />

      {loading && <p>Processing image...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}

      {imageData && (
        <div className="image-display">
          {displayMode === 'lqip' && (
            <img
              src={imageData.lqip.base64}
              alt="placeholder"
              className="lqip"
              style={{filter: 'blur(20px)'}}
            />
          )}

          {displayMode === 'blur' && (
            <img
              src={imageData.lqip.base64}
              alt="loading"
              className="blur"
              style={{filter: 'blur(10px)', transition: 'filter 0.3s ease'}}
            />
          )}

          {displayMode === 'final' && (
            <img
              src={imageData.optimized.path}
              alt="final"
              className="final"
              style={{transition: 'opacity 0.5s ease'}}
            />
          )}

          <div className="metrics">
            <p>Original: {(imageData.original.size / 1024).toFixed(0)} KB</p>
            <p>Optimized: {(imageData.optimized.size / 1024).toFixed(0)} KB</p>
            <p>
              Compression:{' '}
              {(
                ((imageData.original.size - imageData.optimized.size) /
                  imageData.original.size) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
*/

// ============================================================================
// EXAMPLE 3: Responsive Image Generation (Multiple Sizes)
// ============================================================================

import sharp from 'sharp';

async function generateResponsiveImages(imageBuffer, filename) {
  const sizes = [
    { width: 320, name: 'xs' },
    { width: 640, name: 'sm' },
    { width: 1024, name: 'md' },
    { width: 1200, name: 'lg' },
  ];

  const results = {};

  for (const size of sizes) {
    const webpBuffer = await sharp(imageBuffer)
      .resize(size.width, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    results[size.name] = {
      width: size.width,
      buffer: webpBuffer,
      size: webpBuffer.length,
      filename: `${filename.split('.')[0]}-${size.name}.webp`,
    };
  }

  return results;
}

// Usage:
// const responsive = await generateResponsiveImages(imageBuffer, 'photo.jpg');
// Output: {
//   xs: { width: 320, size: 45000, filename: 'photo-xs.webp' },
//   sm: { width: 640, size: 95000, filename: 'photo-sm.webp' },
//   md: { width: 1024, size: 165000, filename: 'photo-md.webp' },
//   lg: { width: 1200, size: 256000, filename: 'photo-lg.webp' }
// }

// ============================================================================
// EXAMPLE 4: Picture Element for Browser Fallback
// ============================================================================

/*
function ResponsiveImage({ imageData }) {
  return (
    <picture>
      
      <source
        srcSet={`
          ${imageData.sm.webp} 640w,
          ${imageData.md.webp} 1024w,
          ${imageData.lg.webp} 1200w
        `}
        type="image/webp"
      />

      
      <source
        srcSet={`
          ${imageData.sm.jpeg} 640w,
          ${imageData.md.jpeg} 1024w,
          ${imageData.lg.jpeg} 1200w
        `}
        type="image/jpeg"
      />

   
      <img
        src={imageData.original.url}
        alt="Product"
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
} 

// ============================================================================
// EXAMPLE 5: Database Schema (PostgreSQL with Supabase)
// ============================================================================

/*
-- Create images table
CREATE TABLE images (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  filename VARCHAR(255) UNIQUE NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  
  -- Original image data
  original_width INTEGER NOT NULL,
  original_height INTEGER NOT NULL,
  original_size BIGINT NOT NULL,
  original_format VARCHAR(10) NOT NULL,
  
  -- Optimized image data
  optimized_width INTEGER NOT NULL,
  optimized_height INTEGER NOT NULL,
  optimized_size BIGINT NOT NULL,
  optimized_path VARCHAR(255) NOT NULL,
  
  -- LQIP data
  lqip_base64 TEXT NOT NULL,
  
  -- Metadata
  compression_ratio DECIMAL(5, 2) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  mime_type VARCHAR(20) DEFAULT 'image/webp',
  
  -- User & timestamps
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  created_index ON (created_at DESC),
  user_index ON (user_id)
);

-- Queries
SELECT * FROM images ORDER BY created_at DESC LIMIT 10;
SELECT original_size, optimized_size, compression_ratio FROM images WHERE user_id = $1;
*/

// ============================================================================
// EXAMPLE 6: Caching Strategy
// ============================================================================

import NodeCache from 'node-cache';

const imageCache = new NodeCache({ stdTTL: 600 }); // 10 min TTL

async function processImageWithCache(imageBuffer, filename) {
  const cacheKey = `image_${filename}`;

  // Check cache
  const cached = imageCache.get(cacheKey);
  if (cached) {
    console.log('Cache hit:', filename);
    return cached;
  }

  // Process and cache
  const result = await processImage(imageBuffer, filename);

  if (result.success) {
    imageCache.set(cacheKey, result);
  }

  return result;
}

// ============================================================================
// EXAMPLE 7: Error Boundary React Component
// ============================================================================

/*
class ImageUploadErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Image upload error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '1rem',
          background: '#fee',
          border: '1px solid #f99',
          borderRadius: '4px',
        }}>
          <h3>Image Upload Error</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage:
// <ImageUploadErrorBoundary>
//   <ImageUploadComponent />
// </ImageUploadErrorBoundary>
*/

// ============================================================================
// EXAMPLE 8: Batch Upload with Progress
// ============================================================================

/*
async function uploadWithProgress(files, onProgress) {
  const results = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const result = await uploadImage(file);
    results.push(result);

    // Update progress
    const progress = ((i + 1) / total) * 100;
    onProgress?.({
      current: i + 1,
      total,
      percentage: progress,
      filename: file.name,
    });
  }

  return results;
}

// Usage:
// await uploadWithProgress(fileList, (progress) => {
//   setUploadProgress(progress.percentage);
//   console.log(`${progress.current}/${progress.total} - ${progress.percentage.toFixed(0)}%`);
// });
*/

// ============================================================================
// EXAMPLE 9: Video Thumbnail Generation (with sharp)
// ============================================================================

/*
import ffmpeg from 'fluent-ffmpeg';

async function generateVideoThumbnail(videoPath, timestamp = '00:00:01') {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshot({
        timestamps: [timestamp],
        filename: 'thumbnail.jpg',
        folder: '/tmp',
      })
      .on('end', async () => {
        const buffer = fs.readFileSync('/tmp/thumbnail.jpg');
        const result = await processImage(buffer, 'thumbnail.jpg');
        resolve(result);
      })
      .on('error', reject);
  });
}
*/

// ============================================================================
// EXAMPLE 10: Cloud Storage Integration (AWS S3)
// ============================================================================

/*
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

async function uploadToS3(imageBuffer, filename) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `images/${filename}`,
    Body: imageBuffer,
    ContentType: 'image/webp',
    CacheControl: 'max-age=31536000', // 1 year
  };

  return s3.upload(params).promise();
}

// Usage:
// const result = await processImage(imageBuffer, 'photo.jpg');
// await uploadToS3(result.optimized.buffer, result.filename);
*/

export {
  generateResponsiveImages,
  // processImageWithCache,
};
