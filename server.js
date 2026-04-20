/**
 * Image Upload Server
 * Express.js server with image processing middleware
 * 
 * Usage:
 *   npm install express multer sharp dotenv cors
 *   node server.js
 * 
 * Example POST request:
 *   curl -X POST -F "file=@image.jpg" http://localhost:3001/upload
 */

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  processImage,
  imageUploadMiddleware,
  saveProcessedImage,
} from './imageProcessingMiddleware.js';

// Environment setup
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads (store in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/tiff',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

/**
 * POST /upload
 * Upload an image and receive optimized metadata
 */
app.post('/upload', upload.single('file'), imageUploadMiddleware, async (req, res) => {
  try {
    const result = await processImage(req.imageBuffer, req.imageFilename);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Optionally save the optimized WebP to disk
    if (process.env.SAVE_UPLOADS === 'true') {
      const outputDir = path.join(__dirname, '../../public/uploads');
      const outputPath = path.join(outputDir, result.filename);

      // Create directory if it doesn't exist
      await import('fs/promises').then((fs) =>
        fs.mkdir(outputDir, { recursive: true })
      );

      await saveProcessedImage(result.optimized.buffer, outputPath);
      result.optimized.path = `/uploads/${result.filename}`;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Image processing failed',
      details: error.message,
    });
  }
});

/**
 * POST /upload-batch
 * Upload multiple images at once
 */
app.post('/upload-batch', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded',
      });
    }

    const results = await Promise.all(
      req.files.map((file) => processImage(file.buffer, file.originalname))
    );

    res.json({
      success: true,
      count: results.length,
      images: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Batch processing failed',
      details: error.message,
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Image Processing Server',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Error handling middleware
 */
app.use((error, req, res, next) => {
  console.error('Error:', error);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large (max 50MB)',
      });
    }
  }

  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🖼️  Image Processing Server running on http://localhost:${PORT}`);
  console.log(`POST /upload - Process single image`);
  console.log(`POST /upload-batch - Process multiple images`);
  console.log(`GET /health - Health check`);
});

export default app;
