import React, { createContext, useContext, useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import { ContentBackupService } from '../services/backupService';
import { SecurityService } from '../services/securityService';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({
    personal: {
      name: 'Kyle O\'Connor',
      title: 'UI Developer',
      location: 'Manchester · United Kingdom',
      email: 'info@kyleo.co.uk',
      bio: 'Hello, I am Kyle O\'Connor!\n\nCurrently a UI developer, AKA a front end developer, web designer or other similar terminology.\n\nI live in Tameside, more well known as a part of Greater Manchester. With a remote based job for a company in Surrey.\n\nInterested in any services, I\'ll see what I can do for you, email me.'
    },
    expertise: {
      description: 'I make sure a website or interface looks good, feels smooth, and is intuitive for all users.\n\nMy job is basically to turn a designer\'s vision into reality using code. However, due to factors like accessibility guidelines and common sense, I occasionally overrule the designer.\n\nHaving been doing it for almost a decade, I can confidently say I am an expert at front end development.\n\nThis content management system is a perfect example of my work - a clean, functional interface that\'s both powerful and easy to use.'
    },
    social: {
      github: 'https://github.com/kyleodotcodotuk',
      bitcoin: 'https://strike.me/kyleocouk/',
      linkedin: 'https://linkedin.com/in/kyle-oconnor',
      twitter: 'https://twitter.com/kyleocouk'
    }
  });
  const [loading, setLoading] = useState(true);

  // Load content from database service on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const contentData = await databaseService.getContent();
        setContent(contentData);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const updateContent = async (section, data) => {
    // Security validation
    const validation = SecurityService.validateContent(section, data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }
    
    // Rate limiting
    const rateLimit = SecurityService.checkRateLimit('content_update');
    if (!rateLimit.allowed) {
      throw new Error(`Rate limit exceeded. Please try again in ${rateLimit.retryAfter} seconds.`);
    }
    
    // Sanitize content
    const sanitizedData = SecurityService.sanitizeContent(section, data);
    
    try {
      // Create new content with updated section
      const newContent = {
        ...content,
        [section]: {
          ...content[section],
          ...sanitizedData
        }
      };
      
      // Save using database service (handles both local and remote)
      const saveResult = await databaseService.saveContent(newContent);
      
      if (saveResult.success) {
        setContent(newContent);
        
        // Log security event
        SecurityService.logSecurityEvent('content_update', { 
          section, 
          fieldsUpdated: Object.keys(data),
          savedTo: saveResult.remote ? 'database' : 'localStorage'
        });
        
        // Create automatic backup after successful update
        ContentBackupService.createAutoBackup(newContent);
        
        // Update last content update timestamp
        localStorage.setItem('lastContentUpdate', new Date().toISOString());
        
        return { 
          success: true, 
          content: newContent,
          offline: saveResult.offline,
          syncStatus: databaseService.getSyncStatus()
        };
      } else {
        throw new Error('Failed to save content');
      }
      
    } catch (error) {
      SecurityService.logSecurityEvent('content_update_failed', { section, error: error.message });
      console.error('Error updating content:', error);
      throw error;
    }
  };

  const resetContent = async () => {
    try {
      const result = await databaseService.resetContent();
      if (result.success) {
        const defaultContent = await databaseService.getContent();
        setContent(defaultContent);
        
        // Backup before reset
        ContentBackupService.createAutoBackup(defaultContent);
        
        return { success: true, content: defaultContent };
      } else {
        throw new Error('Failed to reset content');
      }
    } catch (error) {
      console.error('Error resetting content:', error);
      throw error;
    }
  };

  // New backup-related functions
  const exportContent = () => {
    return ContentBackupService.exportContent(content);
  };

  const importContent = async (file) => {
    try {
      const result = await ContentBackupService.importContent(file);
      if (result.success) {
        // Save imported content using database service
        const saveResult = await databaseService.saveContent(result.content);
        if (saveResult.success) {
          setContent(result.content);
          return { 
            ...result, 
            syncStatus: databaseService.getSyncStatus(),
            offline: saveResult.offline
          };
        }
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  const getBackupInfo = () => {
    return {
      availableBackups: ContentBackupService.getAvailableBackups(),
      storageInfo: ContentBackupService.getStorageInfo(),
      syncStatus: databaseService.getSyncStatus()
    };
  };

  const restoreFromBackup = async (backupKey) => {
    try {
      const result = ContentBackupService.restoreBackup(backupKey);
      if (result.success) {
        // Save restored content using database service
        const saveResult = await databaseService.saveContent(result.content);
        if (saveResult.success) {
          setContent(result.content);
          
          // Log security event
          SecurityService.logSecurityEvent('backup_restore', { backupKey });
          
          return { 
            ...result, 
            syncStatus: databaseService.getSyncStatus(),
            offline: saveResult.offline
          };
        }
      }
      return result;
    } catch (error) {
      SecurityService.logSecurityEvent('backup_restore_failed', { backupKey, error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Security-related functions
  const getSecurityInfo = () => {
    return {
      logs: SecurityService.getSecurityLogs(),
      suspiciousActivity: SecurityService.checkSuspiciousActivity()
    };
  };

  const validateContent = (section, data) => {
    return SecurityService.validateContent(section, data);
  };

  // Database-specific functions
  const getSyncStatus = () => {
    return databaseService.getSyncStatus();
  };

  const forceSync = async () => {
    try {
      await databaseService.forceSync();
      return { success: true, message: 'Sync completed successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const exportAllData = () => {
    return databaseService.exportData();
  };

  const importAllData = async (data) => {
    try {
      const result = await databaseService.importData(data);
      if (result.success) {
        const updatedContent = await databaseService.getContent();
        setContent(updatedContent);
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    content,
    updateContent,
    resetContent,
    loading,
    // Backup functionality
    exportContent,
    importContent,
    getBackupInfo,
    restoreFromBackup,
    // Security functionality
    getSecurityInfo,
    validateContent,
    // Database functionality
    getSyncStatus,
    forceSync,
    exportAllData,
    importAllData
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};