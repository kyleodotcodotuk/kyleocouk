// Authentication service with browser-compatible password hashing and JWT tokens
import CryptoJS from 'crypto-js';

// JWT Secret - in production this should be from environment variable
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET || 'fallback-jwt-secret-key-2024';
const JWT_EXPIRES_IN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export class AuthService {
  // Hash password using PBKDF2
  static async hashPassword(password) {
    try {
      // Generate a random salt
      const salt = CryptoJS.lib.WordArray.random(128/8).toString();
      
      // Use PBKDF2 for password hashing
      const hash = CryptoJS.PBKDF2(password, salt, {
        keySize: 256/32,
        iterations: 10000
      }).toString();
      
      return `${salt}:${hash}`;
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  // Verify password against hash
  static async verifyPassword(password, storedHash) {
    try {
      const [salt, hash] = storedHash.split(':');
      if (!salt || !hash) return false;
      
      // Recreate hash with same salt
      const recreatedHash = CryptoJS.PBKDF2(password, salt, {
        keySize: 256/32,
        iterations: 10000
      }).toString();
      
      return recreatedHash === hash;
    } catch (error) {
      return false;
    }
  }

  // Generate simple JWT-like token
  static generateToken(user) {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      userId: user.id || user.userId,
      username: user.username,
      role: user.role,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + JWT_EXPIRES_IN) / 1000),
      iss: 'kyleo-cms',
      aud: 'kyleo-cms-users'
    };

    // Create signature using HMAC SHA256
    const encodedHeader = btoa(JSON.stringify(header)).replace(/[=]/g, '');
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/[=]/g, '');
    const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, JWT_SECRET).toString();

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      const [headerB64, payloadB64, signature] = token.split('.');
      
      if (!headerB64 || !payloadB64 || !signature) {
        throw new Error('Invalid token format');
      }

      // Verify signature
      const expectedSignature = CryptoJS.HmacSHA256(`${headerB64}.${payloadB64}`, JWT_SECRET).toString();
      if (signature !== expectedSignature) {
        throw new Error('Invalid token signature');
      }

      // Decode payload
      const payload = JSON.parse(atob(payloadB64));
      
      // Check expiration
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && currentTime > payload.exp) {
        throw new Error('Token has expired');
      }

      return payload;
    } catch (error) {
      if (error.message === 'Token has expired') {
        throw new Error('Token has expired');
      } else {
        throw new Error('Invalid token');
      }
    }
  }

  // Decode token without verification (for client-side use)
  static decodeToken(token) {
    try {
      const [, payloadB64] = token.split('.');
      return JSON.parse(atob(payloadB64));
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Generate secure session data
  static generateSession(user, token) {
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        avatar: user.avatar,
        initials: user.initials
      },
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
  }

  // Validate password strength
  static validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
      score: this.calculatePasswordScore(password)
    };
  }

  // Calculate password strength score (0-100)
  static calculatePasswordScore(password) {
    let score = 0;
    
    // Length bonus
    score += Math.min(password.length * 4, 25);
    
    // Character variety bonus
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    
    // Pattern penalties
    if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 10; // Common patterns
    
    // Length penalties for very short passwords
    if (password.length < 8) score -= 20;
    if (password.length < 6) score -= 20;
    
    return Math.max(0, Math.min(100, score));
  }

  // Generate secure random password
  static generateSecurePassword(length = 16) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    
    // Ensure at least one character from each required type
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Uppercase
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Lowercase
    password += "0123456789"[Math.floor(Math.random() * 10)]; // Number
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)]; // Special character
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password to avoid predictable patterns
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  // Rate limiting for login attempts
  static checkRateLimit(identifier) {
    const key = `rate_limit_${identifier}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(attempt => now - attempt < windowMs);
    
    // Check if too many attempts
    if (recentAttempts.length >= 5) {
      const oldestAttempt = Math.min(...recentAttempts);
      const timeUntilReset = Math.ceil((oldestAttempt + windowMs - now) / 1000 / 60);
      return {
        allowed: false,
        message: `Too many login attempts. Try again in ${timeUntilReset} minutes.`,
        retryAfter: oldestAttempt + windowMs
      };
    }
    
    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return {
      allowed: true,
      attemptsRemaining: 5 - recentAttempts.length
    };
  }

  // Clear rate limit for successful login
  static clearRateLimit(identifier) {
    const key = `rate_limit_${identifier}`;
    localStorage.removeItem(key);
  }

  // Security event logging
  static logSecurityEvent(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      ip: 'client-side', // In production, this would come from server
      sessionId: sessionStorage.getItem('session_id') || 'anonymous'
    };

    // Store in localStorage (in production, send to server)
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.unshift(logEntry);
    
    // Keep only last 100 entries
    if (logs.length > 100) {
      logs.splice(100);
    }
    
    localStorage.setItem('security_logs', JSON.stringify(logs));
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Security Event:', logEntry);
    }
  }
}

export default AuthService;