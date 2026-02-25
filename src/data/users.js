// Simplified User System
// This provides basic user management with admin and regular users

import { AuthService } from '../services/authService';

// User roles and their permissions
export const USER_ROLES = {
  ADMIN: {
    name: 'Admin',
    permissions: [
      'manage_users', 'manage_posts', 'manage_media', 'manage_settings',
      'publish_posts', 'delete_posts', 'moderate_comments', 'view_analytics',
      'manage_categories', 'manage_tags', 'backup_data', 'system_settings'
    ]
  },
  USER: {
    name: 'User',
    permissions: [
      'create_posts', 'edit_own_posts', 'publish_own_posts', 'upload_media'
    ]
  }
};

// Sample users for development - these will be hashed on first initialization
const defaultUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'Admin2024!', // Will be hashed during initialization
    name: 'Administrator',
    firstName: 'Kyle',
    lastName: 'O\'Neil',
    email: 'admin@kyleo.co.uk',
    phone: '+44 7700 900123',
    initials: 'KO',
    role: 'ADMIN',
    location: 'Manchester, UK',
    status: 'online',
    avatar: '/img/static/010.jpg',
    bio: 'Full-stack developer and system administrator',
    lastLogin: null,
    lastSeen: new Date().toISOString(),
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: USER_ROLES.ADMIN.permissions,
    preferences: {
      theme: 'dark',
      notifications: true,
      emailNotifications: true
    }
  },
  {
    id: 2,
    username: 'user1',
    password: 'User2024!', // Will be hashed during initialization
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@kyleo.co.uk',
    phone: '+44 7700 900456',
    initials: 'SJ',
    role: 'USER',
    location: 'London, UK',
    status: 'away',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    bio: 'Content creator and writer',
    lastLogin: null,
    lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    isActive: true,
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: USER_ROLES.USER.permissions,
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: false
    }
  },
  {
    id: 3,
    username: 'user2',
    password: 'User2024!', // Will be hashed during initialization
    name: 'Mike Wilson',
    firstName: 'Mike',
    lastName: 'Wilson',
    email: 'mike@kyleo.co.uk',
    phone: '+44 7700 900789',
    initials: 'MW',
    role: 'USER',
    location: 'Birmingham, UK',
    status: 'offline',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Technical writer and developer',
    lastLogin: null,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isActive: true,
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: USER_ROLES.USER.permissions,
    preferences: {
      theme: 'dark',
      notifications: false,
      emailNotifications: true
    }
  },
  {
    id: 4,
    username: 'user3',
    password: 'User2024!', // Will be hashed during initialization
    name: 'Emma Davis',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma@kyleo.co.uk',
    initials: 'ED',
    role: 'USER',
    location: 'Leeds, UK',
    status: 'offline',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Designer and content strategist',
    lastLogin: null,
    isActive: true,
    createdAt: new Date('2024-01-04').toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: USER_ROLES.USER.permissions,
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: true
    }
  },
  {
    id: 5,
    username: 'user4',
    password: 'User2024!', // Will be hashed during initialization
    name: 'James Taylor',
    firstName: 'James',
    lastName: 'Taylor',
    email: 'james@kyleo.co.uk',
    initials: 'JT',
    role: 'USER',
    location: 'Bristol, UK',
    status: 'offline',
    avatar: null,
    bio: 'Marketing specialist and blogger',
    lastLogin: null,
    isActive: true,
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: USER_ROLES.USER.permissions,
    preferences: {
      theme: 'dark',
      notifications: false,
      emailNotifications: false
    }
  }
];

// Users API
export class UsersAPI {
  constructor() {
    this.storageKey = 'cmsUsers';
    this.sessionKey = 'cmsSession';
    this.tokenKey = 'cmsAuthToken';
    this.initialized = false;
    this.initPromise = this.initializeUsers();
  }

  // Ensure initialization is complete before operations
  async ensureInitialized() {
    if (!this.initialized) {
      await this.initPromise;
      this.initialized = true;
    }
  }

  // Initialize users with default data
  async initializeUsers() {
    const existingUsers = this.getAllUsers();
    
    // If no users exist or users don't have hashed passwords, initialize with secure defaults
    if (existingUsers.length === 0 || existingUsers.some(user => !user.passwordHash)) {
      console.log('Initializing users with secure password hashing...');
      
      try {
        // Hash all default user passwords
        const secureUsers = await Promise.all(
          defaultUsers.map(async (user) => {
            const passwordHash = await AuthService.hashPassword(user.password);
            return {
              ...user,
              passwordHash,
              password: undefined, // Remove plain text password
              securityVersion: 1, // Track security implementation version
              passwordLastChanged: new Date().toISOString(),
              loginAttempts: 0,
              lastFailedLogin: null,
              accountLocked: false,
              lockoutUntil: null
            };
          })
        );
        
        localStorage.setItem(this.storageKey, JSON.stringify(secureUsers));
        AuthService.logSecurityEvent('users_initialized', { count: secureUsers.length });
        console.log('✅ Users initialized with secure password hashing');
      } catch (error) {
        console.error('Failed to initialize users with password hashing:', error);
        // Fallback to plain text (development only)
        localStorage.setItem(this.storageKey, JSON.stringify(defaultUsers));
      }
    }
  }

  // Get all users
  getAllUsers() {
    try {
      const users = localStorage.getItem(this.storageKey);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  // Get user by ID
  getUserById(id) {
    const users = this.getAllUsers();
    return users.find(user => user.id === parseInt(id));
  }

  // Get user by username
  getUserByUsername(username) {
    const users = this.getAllUsers();
    return users.find(user => user.username.toLowerCase() === username.toLowerCase());
  }

  // Get user by email
  getUserByEmail(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Get users by role
  getUsersByRole(role) {
    const users = this.getAllUsers();
    return users.filter(user => user.role === role);
  }

  // Create new user
  async createUser(userData) {
    await this.ensureInitialized();
    const users = this.getAllUsers();
    
    // Validate password strength
    const passwordValidation = AuthService.validatePasswordStrength(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password requirements not met: ${passwordValidation.errors.join(', ')}`);
    }
    
    // Check for existing username/email
    if (this.getUserByUsername(userData.username)) {
      throw new Error('Username already exists');
    }
    if (this.getUserByEmail(userData.email)) {
      throw new Error('Email already exists');
    }

    try {
      // Hash the password
      const passwordHash = await AuthService.hashPassword(userData.password);
      
      const newUser = {
        ...userData,
        id: this.generateId(),
        initials: `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase(),
        name: `${userData.firstName} ${userData.lastName}`,
        status: 'offline',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
        passwordHash,
        password: undefined, // Remove plain text password
        securityVersion: 1,
        passwordLastChanged: new Date().toISOString(),
        loginAttempts: 0,
        lastFailedLogin: null,
        accountLocked: false,
        lockoutUntil: null,
        permissions: USER_ROLES[userData.role]?.permissions || [],
        preferences: {
          theme: 'dark',
          notifications: true,
          emailNotifications: true
        }
      };

      users.push(newUser);
      this.saveUsers(users);
      
      AuthService.logSecurityEvent('user_created', { 
        userId: newUser.id, 
        username: newUser.username,
        role: newUser.role 
      });
      
      return newUser;
    } catch (error) {
      AuthService.logSecurityEvent('user_creation_failed', { 
        username: userData.username,
        error: error.message 
      });
      throw error;
    }
  }

  // Update user
  updateUser(id, updates) {
    const users = this.getAllUsers();
    const index = users.findIndex(user => user.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('User not found');
    }

    // Check for username/email conflicts (excluding current user)
    if (updates.username) {
      const existingUser = this.getUserByUsername(updates.username);
      if (existingUser && existingUser.id !== parseInt(id)) {
        throw new Error('Username already exists');
      }
    }
    if (updates.email) {
      const existingUser = this.getUserByEmail(updates.email);
      if (existingUser && existingUser.id !== parseInt(id)) {
        throw new Error('Email already exists');
      }
    }

    const updatedUser = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Update name and initials if first/last name changed
    if (updates.firstName || updates.lastName) {
      updatedUser.name = `${updatedUser.firstName} ${updatedUser.lastName}`;
      updatedUser.initials = `${updatedUser.firstName[0]}${updatedUser.lastName[0]}`.toUpperCase();
    }

    // Update permissions if role changed
    if (updates.role) {
      updatedUser.permissions = USER_ROLES[updates.role]?.permissions || [];
    }

    users[index] = updatedUser;
    this.saveUsers(users);
    return updatedUser;
  }

  // Delete user
  deleteUser(id) {
    const users = this.getAllUsers();
    const userToDelete = this.getUserById(id);
    
    if (!userToDelete) {
      throw new Error('User not found');
    }

    // Prevent deleting the last admin
    const admins = users.filter(u => u.role === 'ADMIN' && u.id !== parseInt(id));
    if (userToDelete.role === 'ADMIN' && admins.length === 0) {
      throw new Error('Cannot delete the last Admin');
    }

    const filteredUsers = users.filter(user => user.id !== parseInt(id));
    this.saveUsers(filteredUsers);
    return true;
  }

  // Authentication
  async authenticateUser(username, password) {
    await this.ensureInitialized();
    const user = this.getUserByUsername(username);
    
    if (!user) {
      AuthService.logSecurityEvent('login_failed', { username, reason: 'user_not_found' });
      console.warn(`Failed login attempt for username: ${username} at ${new Date().toISOString()}`);
      return { success: false, error: 'Invalid username or password' };
    }

    if (!user.isActive) {
      AuthService.logSecurityEvent('login_failed', { username, reason: 'account_inactive' });
      return { success: false, error: 'Account is deactivated' };
    }

    // Check if account is locked
    if (user.accountLocked && user.lockoutUntil && new Date() < new Date(user.lockoutUntil)) {
      AuthService.logSecurityEvent('login_failed', { username, reason: 'account_locked' });
      return { success: false, error: 'Account is temporarily locked due to multiple failed attempts' };
    }

    try {
      // For legacy users without passwordHash, check plain text (temporary)
      let isValidPassword = false;
      if (user.passwordHash) {
        isValidPassword = await AuthService.verifyPassword(password, user.passwordHash);
      } else if (user.password) {
        // Legacy support - upgrade to hashed password
        isValidPassword = user.password === password;
        if (isValidPassword) {
          // Upgrade to hashed password
          user.passwordHash = await AuthService.hashPassword(password);
          user.password = undefined; // Remove plain text
          user.securityVersion = 1;
          user.passwordLastChanged = new Date().toISOString();
          this.updateUser(user.id, user);
        }
      }

      if (!isValidPassword) {
        // Increment failed login attempts
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        user.lastFailedLogin = new Date().toISOString();
        
        // Lock account after 5 failed attempts
        if (user.loginAttempts >= 5) {
          user.accountLocked = true;
          user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes
        }
        
        this.updateUser(user.id, user);
        
        AuthService.logSecurityEvent('login_failed', { 
          username, 
          reason: 'invalid_password',
          attempts: user.loginAttempts 
        });
        
        console.warn(`Failed login attempt for username: ${username} at ${new Date().toISOString()}`);
        return { success: false, error: 'Invalid username or password' };
      }

      // Reset failed login attempts on successful login
      if (user.loginAttempts > 0 || user.accountLocked) {
        user.loginAttempts = 0;
        user.accountLocked = false;
        user.lockoutUntil = null;
      }

      // Update last login and status
      this.updateUser(user.id, {
        lastLogin: new Date().toISOString(),
        status: 'online',
        loginAttempts: 0,
        accountLocked: false,
        lockoutUntil: null
      });

      // Generate JWT token
      const token = AuthService.generateToken({ 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      });

      // Create session with JWT
      const session = {
        userId: user.id,
        username: user.username,
        role: user.role,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        token
      };

      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      localStorage.setItem('cms_auth', 'true');

      AuthService.logSecurityEvent('login_success', { 
        userId: user.id, 
        username: user.username 
      });

      console.log(`User ${user.name} logged in at ${session.loginTime}`);
      return { success: true, user: this.getUserById(user.id), session };
    } catch (error) {
      AuthService.logSecurityEvent('login_error', { username, error: error.message });
      console.error('Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Session management
  getCurrentSession() {
    try {
      const session = localStorage.getItem(this.sessionKey);
      if (!session) return null;

      const sessionData = JSON.parse(session);
      
      // Check session timeout (24 hours)
      const sessionAge = Date.now() - new Date(sessionData.loginTime).getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (sessionAge > twentyFourHours) {
        this.logout();
        return null;
      }

      // Update last activity
      sessionData.lastActivity = new Date().toISOString();
      localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));

      return sessionData;
    } catch (error) {
      return null;
    }
  }

  getCurrentUser() {
    const session = this.getCurrentSession();
    if (!session) return null;
    
    return this.getUserById(session.userId);
  }

  // Check permissions
  hasPermission(permission, userId = null) {
    const user = userId ? this.getUserById(userId) : this.getCurrentUser();
    if (!user) return false;
    
    return user.permissions.includes(permission) || user.permissions.includes('*');
  }

  hasAnyPermission(permissions, userId = null) {
    return permissions.some(permission => this.hasPermission(permission, userId));
  }

  hasAllPermissions(permissions, userId = null) {
    return permissions.every(permission => this.hasPermission(permission, userId));
  }

  // Logout
  logout() {
    const session = this.getCurrentSession();
    if (session) {
      // Update user status to offline
      const user = this.getUserById(session.userId);
      if (user) {
        this.updateUser(user.id, { status: 'offline' });
        
        AuthService.logSecurityEvent('logout', { 
          userId: user.id, 
          username: user.username 
        });
        
        console.log(`User ${user.name} logged out at ${new Date().toISOString()}`);
      }
    }

    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem('cms_auth');
  }

  // Check authentication status
  isAuthenticated() {
    const authStatus = localStorage.getItem('cms_auth') === 'true';
    const currentUser = this.getCurrentUser();
    return authStatus && currentUser !== null;
  }

  // Update user activity and status
  updateUserActivity(userId = null) {
    const users = this.getAllUsers();
    const targetUser = userId ? users.find(u => u.id === userId) : this.getCurrentUser();
    
    if (!targetUser) return;

    const now = new Date().toISOString();
    const updates = {
      lastSeen: now,
      status: 'online'
    };

    this.updateUser(targetUser.id, updates);
  }

  // Calculate online status based on last activity
  calculateOnlineStatus(user) {
    if (!user.lastSeen) return 'offline';
    
    const now = new Date();
    const lastSeen = new Date(user.lastSeen);
    const minutesAgo = Math.floor((now - lastSeen) / (1000 * 60));
    
    if (minutesAgo < 5) return 'online';
    if (minutesAgo < 30) return 'away';
    return 'offline';
  }

  // User statistics
  getUserStatistics() {
    const users = this.getAllUsers();
    const roleStats = {};
    const statusStats = {};

    users.forEach(user => {
      roleStats[user.role] = (roleStats[user.role] || 0) + 1;
      statusStats[user.status] = (statusStats[user.status] || 0) + 1;
    });

    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      roles: roleStats,
      status: statusStats,
      recentLogins: users
        .filter(u => u.lastLogin)
        .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
        .slice(0, 5)
    };
  }

  // Helper methods
  generateId() {
    const users = this.getAllUsers();
    const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
    return maxId + 1;
  }

  saveUsers(users) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
      throw new Error('Failed to save users');
    }
  }
}

// Create singleton instance
export const usersAPI = new UsersAPI();

// Legacy compatibility (keeping existing exports)
export const users = usersAPI.getAllUsers();
export const currentUser = usersAPI.getCurrentUser();
export const getUserByUsername = (username) => usersAPI.getUserByUsername(username);
export const getUserById = (id) => usersAPI.getUserById(id);
export const getAllUsers = () => usersAPI.getAllUsers();
export const setCurrentUser = (userId) => usersAPI.updateUser(userId, { status: 'online' });
export const getCurrentUser = () => usersAPI.getCurrentUser();
export const authenticateUser = async (username, password) => await usersAPI.authenticateUser(username, password);
export const logoutUser = () => usersAPI.logout();
export const isUserAuthenticated = () => usersAPI.isAuthenticated();

// New convenience functions
export const createUser = async (userData) => await usersAPI.createUser(userData);
export const updateUser = (id, updates) => usersAPI.updateUser(id, updates);
export const deleteUser = (id) => usersAPI.deleteUser(id);
export const hasPermission = (permission, userId) => usersAPI.hasPermission(permission, userId);
export const getUserStatistics = () => usersAPI.getUserStatistics();