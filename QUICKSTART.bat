@echo off
REM Quick Start: Image Optimization System Setup (Windows)

echo.
echo 🖼️  Image Optimization System - Quick Setup
echo ==========================================
echo.

REM Step 1: Install Dependencies
echo 📦 Step 1: Installing dependencies...
call npm install express@4.18.2 multer@1.4.5-lts.1 sharp@0.33.0 cors@2.8.5 dotenv@16.4.5

REM Step 2: Install Dev Dependencies
echo.
echo 📦 Step 2: Installing dev dependencies...
call npm install --save-dev concurrently

REM Step 3: Create .env file
echo.
echo ⚙️  Step 3: Creating .env configuration...
if exist .env (
    echo ✓ .env already exists
) else (
    copy .env.example .env
    echo ✓ .env file created
)

REM Step 4: Create uploads directory
echo.
echo 📁 Step 4: Creating uploads directory...
if not exist "public\uploads" (
    mkdir public\uploads
)
echo ✓ Directory created

REM Step 5: Success
echo.
echo ✅ Setup Complete!
echo.
echo 📋 Quick Start Commands:
echo   npm run server     - Start image processing server only (port 3001)
echo   npm start          - Start React app only (port 3000)
echo   npm run dev        - Start both server and React (recommended)
echo.
echo 🧪 Testing:
echo   node test-image-processing.js ^<image-path^>
echo.
echo 📚 Documentation:
echo   - IMAGE_OPTIMIZATION_GUIDE.md (complete guide)
echo   - src/services/imageProcessingMiddleware.js (core logic)
echo   - server.js (Express server setup)
echo   - src/hooks/useImageUpload.js (React hook)
echo   - src/components/ImageUploadExample.jsx (example component)
echo.
echo 🚀 Ready to go! Start with: npm run dev
echo.
pause
