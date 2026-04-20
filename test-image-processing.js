/**
 * Image Processing Middleware - Testing & Demo
 * Run this file to test the image processing without needing Express server
 * 
 * Usage:
 *   node test-image-processing.js <path-to-image>
 */

import { processImage, batchProcessImages } from './src/services/imageProcessingMiddleware.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Demo: Process a single image
 */
async function demoSingleImageProcessing(imagePath) {
  console.log('═══════════════════════════════════════════════');
  console.log('📸 Single Image Processing Demo');
  console.log('═══════════════════════════════════════════════\n');

  try {
    // Read image file
    const imageBuffer = await fs.readFile(imagePath);
    console.log(`✓ Loaded image: ${path.basename(imagePath)}`);
    console.log(`  File size: ${(imageBuffer.length / 1024).toFixed(2)} KB\n`);

    // Process image
    console.log('Processing image...\n');
    const result = await processImage(imageBuffer, path.basename(imagePath));

    if (!result.success) {
      console.error('❌ Processing failed:', result.error);
      return;
    }

    // Display results
    console.log('✓ Processing Complete\n');
    displayResults(result);

    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Demo: Batch process multiple images
 */
async function demoBatchProcessing(imagePaths) {
  console.log('═══════════════════════════════════════════════');
  console.log('📸 Batch Image Processing Demo');
  console.log('═══════════════════════════════════════════════\n');

  try {
    // Read all image files
    const buffers = await Promise.all(
      imagePaths.map((p) => fs.readFile(p))
    );

    console.log(`✓ Loaded ${imagePaths.length} images\n`);
    console.log('Processing batch...\n');

    // Process batch
    const results = await batchProcessImages(buffers);

    console.log(`✓ Batch Processing Complete\n`);
    results.forEach((result, index) => {
      console.log(`─────────────────────────────────────────────`);
      console.log(`Image ${index + 1}:`);
      console.log(`─────────────────────────────────────────────`);
      displayResults(result, false);
      console.log();
    });

    return results;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Display processing results in a formatted table
 */
function displayResults(result, detailed = true) {
  if (!result.success) {
    console.error('❌ Error:', result.error);
    return;
  }

  // Original Image Info
  console.log('📷 ORIGINAL IMAGE');
  console.log(`   Resolution: ${result.original.width} × ${result.original.height}px`);
  console.log(`   Format: ${result.original.format.toUpperCase()}`);
  console.log(`   File Size: ${(result.original.size / 1024).toFixed(2)} KB\n`);

  // Optimized Image Info
  console.log('⚡ OPTIMIZED (WebP)');
  console.log(`   Resolution: ${result.optimized.width} × ${result.optimized.height}px`);
  console.log(`   Format: ${result.optimized.format.toUpperCase()}`);
  console.log(`   File Size: ${(result.optimized.size / 1024).toFixed(2)} KB`);

  const compression =
    ((result.original.size - result.optimized.size) / result.original.size) *
    100;
  const ratio = (result.original.size / result.optimized.size).toFixed(2);
  console.log(`   Compression: ${compression.toFixed(1)}% (${ratio}x smaller)\n`);

  // LQIP Info
  console.log('🌫️  LOW-QUALITY IMAGE PLACEHOLDER (LQIP)');
  console.log(`   Resolution: ${result.lqip.width} × ${result.lqip.height}px`);
  console.log(`   Base64 Length: ${result.lqip.base64.length} characters`);
  console.log(`   Sample: ${result.lqip.base64.substring(0, 60)}...\n`);

  // Metadata
  if (detailed) {
    console.log('📋 METADATA');
    console.log(`   Filename: ${result.filename}`);
    console.log(`   Timestamp: ${result.timestamp}\n`);

    // Full JSON
    console.log('📝 FULL JSON RESPONSE');
    console.log(JSON.stringify(result, (key, value) => {
      if (key === 'buffer' && value instanceof Object) {
        return '[Buffer]';
      }
      return value;
    }, 2));
  }
}

/**
 * Generate a sample image for testing
 */
async function generateTestImage() {
  const { createCanvas } = await import('canvas').catch(() => null);
  
  if (!createCanvas) {
    console.warn(
      '⚠️  Canvas module not available. Please provide an image file.\n'
    );
    return null;
  }

  // Create a sample image with canvas
  const canvas = createCanvas(2400, 1600);
  const ctx = canvas.getContext('2d');

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 2400, 1600);
  gradient.addColorStop(0, '#FF6B6B');
  gradient.addColorStop(1, '#4ECDC4');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2400, 1600);

  // Draw text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Test Image', 1200, 800);

  // Save to buffer
  const buffer = canvas.toBuffer('image/jpeg');
  return buffer;
}

/**
 * Main execution
 */
async function main() {
  console.log('🖼️  Image Processing Middleware - Demo & Test\n');

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node test-image-processing.js <image-path>');
    console.log('  node test-image-processing.js <image1> <image2> ...\n');
    console.log('Example:');
    console.log('  node test-image-processing.js ./sample.jpg');
    console.log('  node test-image-processing.js ./photo1.jpg ./photo2.jpg ./photo3.png\n');
    return;
  }

  if (args.length === 1) {
    // Single image processing
    await demoSingleImageProcessing(args[0]);
  } else {
    // Batch processing
    await demoBatchProcessing(args);
  }
}

// Run demo
main().catch(console.error);
