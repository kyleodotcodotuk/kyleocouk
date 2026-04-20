# Image Optimization & Asset Management System

Complete Node.js middleware for automatic image processing with optimization, format conversion, and LQIP generation.

## Features

✅ **Automatic Image Resizing** - Max 1200px width maintaining aspect ratio
✅ **WebP Conversion** - Modern format with better compression
✅ **LQIP Generation** - 20px wide Base64 placeholder for optimistic UI blurring
✅ **Metadata Extraction** - Original dimensions and file info
✅ **Batch Processing** - Handle multiple images efficiently
✅ **Error Handling** - Comprehensive validation and error responses
✅ **File Size Limits** - 50MB max upload size

## Installation

### Prerequisites
- Node.js 16+ (with ES modules support)
- npm or yarn

### Install Dependencies

```bash
npm install express multer sharp cors dotenv
```

Or with specific versions:

```bash
npm install express@4.18.2 multer@1.4.5-lts.1 sharp@0.33.0 cors@2.8.5 dotenv@16.4.5
```

### Update package.json

Add to your `package.json` `devDependencies` and `scripts`:

```json
{
  "type": "module",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "server": "node server.js",
    "dev": "concurrently \"npm start\" \"npm run server\""
  },
  "devDependencies": {
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  }
}
```

Install concurrent task runner (optional but recommended):
```bash
npm install --save-dev concurrently
```

## File Structure

```
src/
├── services/
│   └── imageProcessingMiddleware.js    # Core image processing logic
├── hooks/
│   └── useImageUpload.js               # React hook for uploads
└── components/
    └── ImageUploadExample.jsx          # Example React component

server.js                                # Express.js server with upload endpoints
.env.example                             # Environment configuration template
```

## Configuration

### Create `.env` file

```env
PORT=3001
REACT_APP_IMAGE_UPLOAD_URL=http://localhost:3001
SAVE_UPLOADS=true
UPLOAD_DIR=public/uploads
```

### Environment Variables

- `PORT` - Server port (default: 3001)
- `REACT_APP_IMAGE_UPLOAD_URL` - Frontend API URL
- `SAVE_UPLOADS` - Save processed images to disk (true/false)
- `UPLOAD_DIR` - Directory for storing uploads

## API Endpoints

### POST /upload
Upload and process a single image.

**Request:**
```bash
curl -X POST -F "file=@image.jpg" http://localhost:3001/upload
```

**Response:**
```json
{
  "success": true,
  "original": {
    "width": 3840,
    "height": 2160,
    "format": "jpeg",
    "size": 2048576
  },
  "optimized": {
    "width": 1200,
    "height": 675,
    "format": "webp",
    "size": 256000,
    "buffer": "Buffer(...)"
  },
  "lqip": {
    "base64": "data:image/webp;base64,UklGRiYAAABXRUJQ...",
    "width": 20,
    "height": 11
  },
  "filename": "image.webp",
  "timestamp": "2024-04-20T10:30:45.123Z"
}
```

### POST /upload-batch
Upload and process multiple images.

**Request:**
```bash
curl -X POST -F "files=@image1.jpg" -F "files=@image2.png" http://localhost:3001/upload-batch
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "images": [
    { /* First image results */ },
    { /* Second image results */ }
  ]
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "Image Processing Server",
  "timestamp": "2024-04-20T10:30:45.123Z"
}
```

## Usage Examples

### Backend - Image Processing Middleware

```javascript
import { processImage, saveProcessedImage } from './src/services/imageProcessingMiddleware.js';
import fs from 'fs';

// Process an image
const imageBuffer = fs.readFileSync('photo.jpg');
const result = await processImage(imageBuffer, 'photo.jpg');

console.log('Original:', result.original);
// Output: { width: 3840, height: 2160, format: 'jpeg', size: 2048576 }

console.log('Optimized:', result.optimized);
// Output: { width: 1200, height: 675, format: 'webp', size: 256000, ... }

console.log('LQIP:', result.lqip.base64);
// Output: data:image/webp;base64,UklGRiYAAABWRUJQ...

// Save to disk
await saveProcessedImage(result.optimized.buffer, 'public/uploads/photo.webp');
```

### Frontend - React Hook

```jsx
import { useState } from 'react';
import useImageUpload from '../hooks/useImageUpload';

function MyComponent() {
  const { uploadImage, loading, error, result } = useImageUpload();

  const handleUpload = async (file) => {
    try {
      const data = await uploadImage(file);
      console.log('Upload successful:', data);
      
      // Use LQIP for placeholder
      setPlaceholder(data.lqip.base64);
      
      // Display optimized image when ready
      setImage(data.optimized.path || data.optimized.buffer);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {loading && <p>Processing...</p>}
      {error && <p>Error: {error}</p>}
      {result && <p>Optimized: {result.filename}</p>}
    </div>
  );
}
```

### Frontend - Progressive Image Loading Pattern

```jsx
function OptimizedImage({ originalFile }) {
  const [imageData, setImageData] = useState(null);
  const { uploadImage } = useImageUpload();

  useEffect(() => {
    uploadImage(originalFile).then(setImageData);
  }, [originalFile]);

  return (
    <div className="image-container">
      {/* Blur placeholder while loading */}
      {imageData?.lqip && (
        <img
          src={imageData.lqip.base64}
          className="blur-placeholder"
          style={{ filter: 'blur(10px)' }}
          alt="placeholder"
        />
      )}
      
      {/* Final optimized image */}
      {imageData?.optimized && (
        <img
          src={imageData.optimized.path}
          className="final-image"
          alt="optimized"
          onLoad={() => console.log('Image loaded')}
        />
      )}
    </div>
  );
}
```

## Running the System

### Development (Both React & Server)

```bash
npm run dev
```

This runs both the React development server and the image processing server concurrently.

### Production Server Only

```bash
npm run server
```

### React Development Only

```bash
npm start
```

## Performance & Optimization Tips

1. **LQIP Base64** - Include in HTML/CSS to avoid extra network request
   ```css
   .image {
     background-image: url('data:image/webp;base64,...');
     background-size: cover;
   }
   ```

2. **WebP Fallbacks** - Always provide fallback for older browsers
   ```jsx
   <picture>
     <source srcSet={webpPath} type="image/webp" />
     <img src={jpegPath} alt="fallback" />
   </picture>
   ```

3. **Caching** - Cache processed images by filename hash
4. **CDN** - Serve WebP from CDN for better performance
5. **Compression** - Adjust WebP quality (0-100) based on needs

## Error Handling

The middleware handles:
- Invalid file types
- Missing files
- File size limits (50MB)
- Image processing errors
- Disk write failures

Example error response:
```json
{
  "success": false,
  "error": "File too large (max 50MB)"
}
```

## Supported Image Formats

**Input:** JPEG, PNG, GIF, WebP, TIFF
**Output:** WebP (optimized), WebP (LQIP)

## Troubleshooting

### Sharp installation issues

On Windows, you may need build tools:
```bash
npm install --build-from-source
```

On macOS with M1:
```bash
npm install --arch=arm64
```

### Port already in use

Change PORT in `.env`:
```env
PORT=3002
```

### CORS errors

Ensure CORS is enabled in server.js and frontend has correct API URL:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## Advanced Usage

### Custom Image Quality

Modify in `imageProcessingMiddleware.js`:

```javascript
.webp({ quality: 85 }) // Increase quality (0-100)
```

### Custom LQIP Size

```javascript
.resize(30, 30, { // Change from 20px to 30px
  fit: 'inside',
  withoutEnlargement: true,
})
```

### Responsive Images

Process multiple sizes:
```javascript
const sizes = [640, 1024, 1200];
const webpVersions = await Promise.all(
  sizes.map(width => sharp(imageBuffer)
    .resize(width, null, { withoutEnlargement: true })
    .webp()
    .toBuffer())
);
```

## License

MIT

## Support

For issues, check:
1. Sharp documentation: https://sharp.pixelplumbing.com/
2. Express middleware: https://expressjs.com/
3. Multer file upload: https://www.npmjs.com/package/multer
