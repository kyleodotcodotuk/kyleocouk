// Media Library and File Upload System
// This provides comprehensive file upload and media management functionality

// File types and their configurations
export const FILE_TYPES = {
  IMAGE: {
    name: 'Images',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxSize: 5 * 1024 * 1024, // 5MB
    category: 'image'
  },
  DOCUMENT: {
    name: 'Documents',
    extensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/rtf'],
    maxSize: 10 * 1024 * 1024, // 10MB
    category: 'document'
  },
  VIDEO: {
    name: 'Videos',
    extensions: ['.mp4', '.webm', '.ogg', '.avi', '.mov'],
    mimeTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/quicktime'],
    maxSize: 50 * 1024 * 1024, // 50MB
    category: 'video'
  },
  AUDIO: {
    name: 'Audio',
    extensions: ['.mp3', '.wav', '.ogg', '.aac'],
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac'],
    maxSize: 10 * 1024 * 1024, // 10MB
    category: 'audio'
  }
};

// Sample media files for development
const sampleMediaFiles = [
  {
    id: 1,
    filename: 'hero-image.jpg',
    originalName: 'hero-image.jpg',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop',
    size: 245760, // bytes
    type: 'image/jpeg',
    category: 'image',
    alt: 'Modern workspace with laptop and coffee',
    title: 'Hero Image',
    description: 'Main hero image for homepage',
    uploadedBy: 1,
    uploadedAt: new Date('2024-01-15').toISOString(),
    tags: ['hero', 'workspace', 'laptop'],
    folder: 'homepage',
    isPublic: true,
    usageCount: 3,
    dimensions: { width: 1200, height: 800 }
  },
  {
    id: 2,
    filename: 'profile-photo.jpg',
    originalName: 'profile-photo.jpg',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    size: 89234,
    type: 'image/jpeg',
    category: 'image',
    alt: 'Professional headshot',
    title: 'Profile Photo',
    description: 'Professional profile photograph',
    uploadedBy: 1,
    uploadedAt: new Date('2024-01-10').toISOString(),
    tags: ['profile', 'headshot', 'professional'],
    folder: 'profile',
    isPublic: true,
    usageCount: 5,
    dimensions: { width: 400, height: 400 }
  },
  {
    id: 3,
    filename: 'project-screenshot.png',
    originalName: 'project-screenshot.png',
    url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=225&fit=crop',
    size: 432100,
    type: 'image/png',
    category: 'image',
    alt: 'Web development project screenshot',
    title: 'Project Screenshot',
    description: 'Screenshot of web development project',
    uploadedBy: 2,
    uploadedAt: new Date('2024-01-08').toISOString(),
    tags: ['project', 'screenshot', 'web-development'],
    folder: 'projects',
    isPublic: true,
    usageCount: 1,
    dimensions: { width: 800, height: 600 }
  }
];

// Media API Class
export class MediaAPI {
  constructor() {
    this.storageKey = 'mediaLibrary';
    this.foldersKey = 'mediaFolders';
    this.initializeMedia();
  }

  // Initialize media with sample data if none exist
  initializeMedia() {
    const existingMedia = this.getAllMedia();
    if (existingMedia.length === 0) {
      localStorage.setItem(this.storageKey, JSON.stringify(sampleMediaFiles));
    }

    // Initialize default folders
    const folders = this.getFolders();
    if (folders.length === 0) {
      const defaultFolders = [
        { id: 1, name: 'homepage', path: 'homepage', parent: null, createdAt: new Date().toISOString() },
        { id: 2, name: 'profile', path: 'profile', parent: null, createdAt: new Date().toISOString() },
        { id: 3, name: 'projects', path: 'projects', parent: null, createdAt: new Date().toISOString() },
        { id: 4, name: 'blog', path: 'blog', parent: null, createdAt: new Date().toISOString() }
      ];
      localStorage.setItem(this.foldersKey, JSON.stringify(defaultFolders));
    }
  }

  // Get all media files
  getAllMedia() {
    try {
      const media = localStorage.getItem(this.storageKey);
      return media ? JSON.parse(media) : [];
    } catch (error) {
      console.error('Error loading media:', error);
      return [];
    }
  }

  // Get media by ID
  getMediaById(id) {
    const media = this.getAllMedia();
    return media.find(file => file.id === parseInt(id));
  }

  // Get media by category
  getMediaByCategory(category) {
    const media = this.getAllMedia();
    return media.filter(file => file.category === category);
  }

  // Get media by folder
  getMediaByFolder(folder) {
    const media = this.getAllMedia();
    return media.filter(file => file.folder === folder);
  }

  // Search media
  searchMedia(query) {
    const media = this.getAllMedia();
    const searchTerm = query.toLowerCase();
    
    return media.filter(file =>
      file.filename.toLowerCase().includes(searchTerm) ||
      file.title.toLowerCase().includes(searchTerm) ||
      file.description.toLowerCase().includes(searchTerm) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Upload file (simulate file upload)
  uploadFile(file, metadata = {}) {
    return new Promise((resolve, reject) => {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        reject(new Error(validation.error));
        return;
      }

      // Simulate file processing
      setTimeout(() => {
        try {
          // Create file URL (in real app, this would be uploaded to server/CDN)
          const fileURL = URL.createObjectURL(file);
          
          // Create media record
          const mediaFile = {
            id: this.generateId(),
            filename: this.generateFilename(file.name),
            originalName: file.name,
            url: fileURL, // In production, this would be the actual uploaded URL
            thumbnail: this.generateThumbnail(fileURL, file.type),
            size: file.size,
            type: file.type,
            category: this.getCategoryFromType(file.type),
            alt: metadata.alt || '',
            title: metadata.title || file.name,
            description: metadata.description || '',
            uploadedBy: metadata.uploadedBy || 1,
            uploadedAt: new Date().toISOString(),
            tags: metadata.tags || [],
            folder: metadata.folder || 'uploads',
            isPublic: metadata.isPublic !== false,
            usageCount: 0,
            dimensions: metadata.dimensions || null
          };

          // If it's an image, try to get dimensions
          if (mediaFile.category === 'image') {
            this.getImageDimensions(fileURL).then(dimensions => {
              mediaFile.dimensions = dimensions;
              this.saveMediaFile(mediaFile);
              resolve(mediaFile);
            }).catch(() => {
              this.saveMediaFile(mediaFile);
              resolve(mediaFile);
            });
          } else {
            this.saveMediaFile(mediaFile);
            resolve(mediaFile);
          }
        } catch (error) {
          reject(new Error('Failed to process file: ' + error.message));
        }
      }, 1000); // Simulate upload delay
    });
  }

  // Upload multiple files
  uploadMultipleFiles(files, metadata = {}) {
    const uploadPromises = Array.from(files).map(file => 
      this.uploadFile(file, metadata)
    );
    return Promise.allSettled(uploadPromises);
  }

  // Update media file
  updateMedia(id, updates) {
    const media = this.getAllMedia();
    const index = media.findIndex(file => file.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Media file not found');
    }

    media[index] = {
      ...media[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveMedia(media);
    return media[index];
  }

  // Delete media file
  deleteMedia(id) {
    const media = this.getAllMedia();
    const fileToDelete = this.getMediaById(id);
    
    if (!fileToDelete) {
      throw new Error('Media file not found');
    }

    // Revoke object URL to free memory
    if (fileToDelete.url.startsWith('blob:')) {
      URL.revokeObjectURL(fileToDelete.url);
    }
    if (fileToDelete.thumbnail && fileToDelete.thumbnail.startsWith('blob:')) {
      URL.revokeObjectURL(fileToDelete.thumbnail);
    }

    const filteredMedia = media.filter(file => file.id !== parseInt(id));
    this.saveMedia(filteredMedia);
    return true;
  }

  // Bulk delete media files
  bulkDeleteMedia(ids) {
    const media = this.getAllMedia();
    const filesToDelete = media.filter(file => ids.includes(file.id));
    
    // Revoke object URLs
    filesToDelete.forEach(file => {
      if (file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
      if (file.thumbnail && file.thumbnail.startsWith('blob:')) {
        URL.revokeObjectURL(file.thumbnail);
      }
    });

    const filteredMedia = media.filter(file => !ids.includes(file.id));
    this.saveMedia(filteredMedia);
    return true;
  }

  // File validation
  validateFile(file) {
    // Check file size
    const maxSize = Object.values(FILE_TYPES).reduce((max, type) => 
      Math.max(max, type.maxSize), 0
    );
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${this.formatFileSize(maxSize)}`
      };
    }

    // Check file type
    const isValidType = Object.values(FILE_TYPES).some(type =>
      type.mimeTypes.includes(file.type) ||
      type.extensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (!isValidType) {
      return {
        valid: false,
        error: 'File type not supported'
      };
    }

    return { valid: true };
  }

  // Folder management
  getFolders() {
    try {
      const folders = localStorage.getItem(this.foldersKey);
      return folders ? JSON.parse(folders) : [];
    } catch (error) {
      return [];
    }
  }

  createFolder(name, parent = null) {
    const folders = this.getFolders();
    
    // Check for duplicate names in same parent
    const existingFolder = folders.find(f => 
      f.name.toLowerCase() === name.toLowerCase() && f.parent === parent
    );
    
    if (existingFolder) {
      throw new Error('Folder with this name already exists');
    }

    const newFolder = {
      id: this.generateFolderId(),
      name,
      path: parent ? `${folders.find(f => f.id === parent)?.path}/${name}` : name,
      parent,
      createdAt: new Date().toISOString()
    };

    folders.push(newFolder);
    localStorage.setItem(this.foldersKey, JSON.stringify(folders));
    return newFolder;
  }

  deleteFolder(id) {
    const folders = this.getFolders();
    const media = this.getAllMedia();
    
    // Check if folder has subfolders
    const hasSubfolders = folders.some(f => f.parent === id);
    if (hasSubfolders) {
      throw new Error('Cannot delete folder that contains subfolders');
    }

    // Check if folder has media files
    const folderPath = folders.find(f => f.id === id)?.path;
    const hasFiles = media.some(m => m.folder === folderPath);
    if (hasFiles) {
      throw new Error('Cannot delete folder that contains files');
    }

    const filteredFolders = folders.filter(f => f.id !== id);
    localStorage.setItem(this.foldersKey, JSON.stringify(filteredFolders));
    return true;
  }

  // Statistics
  getMediaStatistics() {
    const media = this.getAllMedia();
    const totalSize = media.reduce((sum, file) => sum + file.size, 0);
    const categories = {};
    const folders = {};

    media.forEach(file => {
      categories[file.category] = (categories[file.category] || 0) + 1;
      folders[file.folder] = (folders[file.folder] || 0) + 1;
    });

    return {
      total: media.length,
      totalSize,
      totalSizeFormatted: this.formatFileSize(totalSize),
      categories,
      folders,
      recentUploads: media
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
        .slice(0, 10)
    };
  }

  // Utility methods
  generateId() {
    const media = this.getAllMedia();
    const maxId = media.reduce((max, file) => Math.max(max, file.id), 0);
    return maxId + 1;
  }

  generateFolderId() {
    const folders = this.getFolders();
    const maxId = folders.reduce((max, folder) => Math.max(max, folder.id), 0);
    return maxId + 1;
  }

  generateFilename(originalName) {
    const timestamp = Date.now();
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    return `${sanitizedName}-${timestamp}${extension}`;
  }

  getCategoryFromType(mimeType) {
    for (const [key, config] of Object.entries(FILE_TYPES)) {
      if (config.mimeTypes.includes(mimeType)) {
        return config.category;
      }
    }
    return 'other';
  }

  generateThumbnail(url, type) {
    // For images, return the same URL (in production, you'd generate actual thumbnails)
    if (type.startsWith('image/')) {
      return url;
    }
    // For other file types, return null or a default icon
    return null;
  }

  getImageDimensions(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  saveMediaFile(mediaFile) {
    const media = this.getAllMedia();
    media.push(mediaFile);
    this.saveMedia(media);
  }

  saveMedia(media) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(media));
    } catch (error) {
      console.error('Error saving media:', error);
      throw new Error('Failed to save media');
    }
  }

  // Increment usage count
  incrementUsage(id) {
    const media = this.getAllMedia();
    const index = media.findIndex(file => file.id === parseInt(id));
    
    if (index !== -1) {
      media[index].usageCount = (media[index].usageCount || 0) + 1;
      this.saveMedia(media);
    }
  }
}

// Create singleton instance
export const mediaAPI = new MediaAPI();

// Convenience functions
export const getAllMedia = () => mediaAPI.getAllMedia();
export const getMediaById = (id) => mediaAPI.getMediaById(id);
export const uploadFile = (file, metadata) => mediaAPI.uploadFile(file, metadata);
export const uploadMultipleFiles = (files, metadata) => mediaAPI.uploadMultipleFiles(files, metadata);
export const updateMedia = (id, updates) => mediaAPI.updateMedia(id, updates);
export const deleteMedia = (id) => mediaAPI.deleteMedia(id);
export const getMediaStatistics = () => mediaAPI.getMediaStatistics();
export const searchMedia = (query) => mediaAPI.searchMedia(query);