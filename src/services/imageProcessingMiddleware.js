/**
 * Image Processing Middleware using Sharp
 * Handles image uploads with automatic optimization:
 * - Resizes to max-width 1200px (maintaining aspect ratio)
 * - Converts to WebP format
 * - Generates LQIP (Low-Quality Image Placeholder) at 20px wide
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

/**
 * Process an uploaded image and generate metadata
 * @param {Buffer} imageBuffer - The uploaded image buffer
 * @param {string} filename - Original filename (for reference)
 * @returns {Promise<Object>} Object containing processed image data and metadata
 */
export async function processImage(imageBuffer, filename = 'image') {
  try {
    // Get original image metadata
    const originalMetadata = await sharp(imageBuffer).metadata();

    // Calculate new dimensions maintaining aspect ratio
    const newWidth = Math.min(1200, originalMetadata.width);
    const newHeight = Math.round(
      (newWidth / originalMetadata.width) * originalMetadata.height
    );

    // 1. Resize and convert to WebP
    const webpBuffer = await sharp(imageBuffer)
      .resize(newWidth, newHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    // 2. Generate Low-Quality Image Placeholder (LQIP) at 20px wide
    const lqipBuffer = await sharp(imageBuffer)
      .resize(20, 20, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 50 })
      .toBuffer();

    // Convert LQIP to Base64 for inline embedding
    const lqipBase64 = `data:image/webp;base64,${lqipBuffer.toString('base64')}`;

    // 3. Return comprehensive metadata object
    return {
      success: true,
      original: {
        width: originalMetadata.width,
        height: originalMetadata.height,
        format: originalMetadata.format,
        size: imageBuffer.length,
      },
      optimized: {
        width: newWidth,
        height: newHeight,
        format: 'webp',
        size: webpBuffer.length,
        buffer: webpBuffer, // Can be used directly or saved to disk
      },
      lqip: {
        base64: lqipBase64,
        width: 20,
        height: Math.round((20 / originalMetadata.width) * originalMetadata.height),
      },
      filename: `${path.parse(filename).name}.webp`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: 'Failed to process image',
    };
  }
}

/**
 * Express/Node.js middleware for image upload handling
 * Usage: app.post('/upload', uploadMiddleware, handleUpload);
 */
export function imageUploadMiddleware(req, res, next) {
  // Check if file exists in request
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded',
    });
  }

  // Verify file is an image
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/tiff',
  ];

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      error: 'File must be a valid image format',
      allowedFormats: allowedMimeTypes,
    });
  }

  // Store buffer in req for next middleware
  req.imageBuffer = req.file.buffer;
  req.imageFilename = req.file.originalname;

  next();
}

/**
 * Handler to process image and return metadata
 * Usage: app.post('/upload', multerMiddleware, imageUploadMiddleware, imageProcessHandler);
 */
export async function imageProcessHandler(req, res) {
  try {
    const result = await processImage(req.imageBuffer, req.imageFilename);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Image processing failed',
      details: error.message,
    });
  }
}

/**
 * Save processed image to disk
 * @param {Buffer} buffer - Image buffer to save
 * @param {string} outputPath - Full path where to save the file
 * @returns {Promise<boolean>}
 */
export async function saveProcessedImage(buffer, outputPath) {
  try {
    await fs.writeFile(outputPath, buffer);
    return true;
  } catch (error) {
    console.error('Failed to save image:', error.message);
    return false;
  }
}

/**
 * Batch process multiple images
 * @param {Array<Buffer>} imageBuffers - Array of image buffers
 * @returns {Promise<Array>} Array of processed image results
 */
export async function batchProcessImages(imageBuffers) {
  return Promise.all(
    imageBuffers.map((buffer, index) =>
      processImage(buffer, `image-${index}`)
    )
  );
}

export default {
  processImage,
  imageUploadMiddleware,
  imageProcessHandler,
  saveProcessedImage,
  batchProcessImages,
};
