#!/bin/bash
# Quick Start: Image Optimization System Setup

echo "🖼️  Image Optimization System - Quick Setup"
echo "=========================================="
echo ""

# Step 1: Install Dependencies
echo "📦 Step 1: Installing dependencies..."
npm install express@4.18.2 multer@1.4.5-lts.1 sharp@0.33.0 cors@2.8.5 dotenv@16.4.5

# Step 2: Install Dev Dependencies
echo ""
echo "📦 Step 2: Installing dev dependencies..."
npm install --save-dev concurrently

# Step 3: Create .env file
echo ""
echo "⚙️  Step 3: Creating .env configuration..."
cp .env.example .env
echo "✓ .env file created"

# Step 4: Create uploads directory
echo ""
echo "📁 Step 4: Creating uploads directory..."
mkdir -p public/uploads
echo "✓ Directory created"

# Step 5: Verify setup
echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Quick Start Commands:"
echo "  npm run server     - Start image processing server only (port 3001)"
echo "  npm start          - Start React app only (port 3000)"
echo "  npm run dev        - Start both server and React (recommended)"
echo ""
echo "🧪 Testing:"
echo "  node test-image-processing.js <image-path>"
echo ""
echo "📚 Documentation:"
echo "  - IMAGE_OPTIMIZATION_GUIDE.md (complete guide)"
echo "  - src/services/imageProcessingMiddleware.js (core logic)"
echo "  - server.js (Express server setup)"
echo "  - src/hooks/useImageUpload.js (React hook)"
echo "  - src/components/ImageUploadExample.jsx (example component)"
echo ""
echo "🚀 Ready to go! Start with: npm run dev"
