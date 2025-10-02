// Security utilities for content validation and sanitization
export class SecurityService {
  
  // Sanitize HTML content to prevent XSS
  static sanitizeHtml(html) {
    if (!html) return '';
    
    // Basic HTML sanitization - in production, use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  }
  
  // Validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validate URL format
  static validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  // Validate content fields
  static validateContent(section, data) {
    const errors = {};
    
    switch (section) {
      case 'personal':
        if (!data.name || data.name.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters long';
        }
        if (data.name && data.name.length > 100) {
          errors.name = 'Name must be less than 100 characters';
        }
        
        if (!data.email || !this.validateEmail(data.email)) {
          errors.email = 'Please enter a valid email address';
        }
        
        if (!data.title || data.title.trim().length < 2) {
          errors.title = 'Title must be at least 2 characters long';
        }
        if (data.title && data.title.length > 100) {
          errors.title = 'Title must be less than 100 characters';
        }
        
        if (!data.location || data.location.trim().length < 2) {
          errors.location = 'Location must be at least 2 characters long';
        }
        if (data.location && data.location.length > 100) {
          errors.location = 'Location must be less than 100 characters';
        }
        
        if (!data.bio || data.bio.trim().length < 10) {
          errors.bio = 'Bio must be at least 10 characters long';
        }
        if (data.bio && data.bio.length > 2000) {
          errors.bio = 'Bio must be less than 2000 characters';
        }
        break;
        
      case 'expertise':
        if (!data.description || data.description.trim().length < 10) {
          errors.description = 'Description must be at least 10 characters long';
        }
        if (data.description && data.description.length > 5000) {
          errors.description = 'Description must be less than 5000 characters';
        }
        break;
        
      case 'social':
        if (data.github && !this.validateUrl(data.github)) {
          errors.github = 'Please enter a valid GitHub URL';
        }
        if (data.bitcoin && !this.validateUrl(data.bitcoin)) {
          errors.bitcoin = 'Please enter a valid Bitcoin URL';
        }
        if (data.linkedin && !this.validateUrl(data.linkedin)) {
          errors.linkedin = 'Please enter a valid LinkedIn URL';
        }
        if (data.twitter && !this.validateUrl(data.twitter)) {
          errors.twitter = 'Please enter a valid Twitter URL';
        }
        break;
        
      default:
        // No specific validation for unknown sections
        break;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  // Sanitize content data
  static sanitizeContent(section, data) {
    const sanitized = { ...data };
    
    switch (section) {
      case 'personal':
        if (sanitized.name) sanitized.name = this.sanitizeText(sanitized.name);
        if (sanitized.title) sanitized.title = this.sanitizeText(sanitized.title);
        if (sanitized.location) sanitized.location = this.sanitizeText(sanitized.location);
        if (sanitized.email) sanitized.email = this.sanitizeText(sanitized.email);
        if (sanitized.bio) sanitized.bio = this.sanitizeText(sanitized.bio);
        break;
        
      case 'expertise':
        if (sanitized.description) sanitized.description = this.sanitizeText(sanitized.description);
        break;
        
      case 'social':
        // URLs are validated but not sanitized to preserve functionality
        break;
        
      default:
        // No specific sanitization for unknown sections
        break;
    }
    
    return sanitized;
  }
  
  // Basic text sanitization
  static sanitizeText(text) {
    if (!text) return '';

    return text
      .trim()
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .substring(0, 10000); // Limit length
  }  // Rate limiting for API calls
  static checkRateLimit(action) {
    const now = Date.now();
    const key = `rateLimit_${action}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const data = JSON.parse(stored);
      const timeSinceLastCall = now - data.timestamp;
      
      // Allow max 10 calls per minute
      if (data.count >= 10 && timeSinceLastCall < 60000) {
        return {
          allowed: false,
          retryAfter: Math.ceil((60000 - timeSinceLastCall) / 1000)
        };
      }
      
      // Reset counter if more than a minute has passed
      if (timeSinceLastCall >= 60000) {
        localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: now }));
      } else {
        localStorage.setItem(key, JSON.stringify({ count: data.count + 1, timestamp: data.timestamp }));
      }
    } else {
      localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: now }));
    }
    
    return { allowed: true };
  }
  
  // Generate CSRF-like token for form submissions
  static generateFormToken() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return btoa(`${timestamp}_${random}`);
  }
  
  // Validate form token (basic implementation)
  static validateFormToken(token) {
    try {
      const decoded = atob(token);
      const [timestamp] = decoded.split('_');
      const now = Date.now();
      
      // Token valid for 1 hour
      return (now - parseInt(timestamp)) < 3600000;
    } catch {
      return false;
    }
  }
  
  // Log security events
  static logSecurityEvent(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      details: details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Store security logs (keep last 100 entries)
    const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    logs.unshift(logEntry);
    localStorage.setItem('securityLogs', JSON.stringify(logs.slice(0, 100)));
    
    // In production, this should also send to a logging service
    console.log('Security Event:', logEntry);
  }
  
  // Get security logs
  static getSecurityLogs() {
    return JSON.parse(localStorage.getItem('securityLogs') || '[]');
  }
  
  // Check for suspicious activity
  static checkSuspiciousActivity() {
    const logs = this.getSecurityLogs();
    const recentLogs = logs.filter(log => 
      Date.now() - new Date(log.timestamp).getTime() < 300000 // Last 5 minutes
    );
    
    // Check for too many failed login attempts
    const failedLogins = recentLogs.filter(log => log.event === 'failed_login');
    if (failedLogins.length >= 5) {
      return {
        suspicious: true,
        reason: 'Multiple failed login attempts',
        recommendation: 'Consider temporarily blocking this session'
      };
    }
    
    // Check for rapid content updates
    const contentUpdates = recentLogs.filter(log => log.event === 'content_update');
    if (contentUpdates.length >= 20) {
      return {
        suspicious: true,
        reason: 'Rapid content modifications',
        recommendation: 'Unusual activity detected'
      };
    }
    
    return { suspicious: false };
  }
}