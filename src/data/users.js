// Admin user configuration for production deployment
// This creates a single admin user for your CMS

const ADMIN_CONFIG = {
  username: 'admin',
  password: 'Admin2024!', // Change this to your preferred secure password
  name: 'Administrator',
  email: 'admin@kyleo.co.uk',
  role: 'Administrator'
};

// Single admin user for production
export const users = [
  {
    id: 1,
    username: ADMIN_CONFIG.username,
    password: ADMIN_CONFIG.password, // In production, this should be hashed
    name: ADMIN_CONFIG.name,
    initials: 'AD',
    role: ADMIN_CONFIG.role,
    email: ADMIN_CONFIG.email,
    location: 'Manchester, UK',
    status: 'online',
    permissions: ['all'],
    avatar: null,
    lastLogin: new Date().toISOString(),
    isActive: true,
    isProduction: true // Production flag
  }
];

// Production admin account
export const currentUser = users[0]; // Administrator account

// Function to get user by username
export const getUserByUsername = (username) => {
  return users.find(user => user.username.toLowerCase() === username.toLowerCase());
};

// Function to get user by id
export const getUserById = (id) => {
  return users.find(user => user.id === id);
};

// Function to get all users (for multi-user support in future)
export const getAllUsers = () => {
  return [...users];
};

// Function to set current user
export const setCurrentUser = (userId) => {
  const user = getUserById(userId);
  if (user) {
    localStorage.setItem('currentUserId', userId.toString());
    localStorage.setItem('loginTime', new Date().toISOString());
    return user;
  }
  return null;
};

// Function to get current user from localStorage
export const getCurrentUser = () => {
  // Check session timeout (24 hours)
  const loginTime = localStorage.getItem('loginTime');
  if (loginTime) {
    const sessionAge = Date.now() - new Date(loginTime).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (sessionAge > twentyFourHours) {
      // Session expired, logout user
      logoutUser();
      return null;
    }
  }

  const savedUserId = localStorage.getItem('currentUserId');
  if (savedUserId) {
    return getUserById(parseInt(savedUserId));
  }
  return null; // No default user - must login
};

// Authentication function with enhanced security
export const authenticateUser = (username, password) => {
  const user = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() && 
    u.password === password
  );
  
  if (user) {
    // Update last login
    user.lastLogin = new Date().toISOString();
    
    // Set as current user with login timestamp
    localStorage.setItem('currentUserId', user.id.toString());
    localStorage.setItem('loginTime', new Date().toISOString());
    localStorage.setItem('cms_auth', 'true');
    
    // Log successful login for security monitoring
    console.log(`User ${user.name} logged in at ${user.lastLogin}`);
    
    return { success: true, user: user };
  }
  
  // Log failed login attempt for security monitoring
  console.warn(`Failed login attempt for username: ${username} at ${new Date().toISOString()}`);
  
  return { success: false, error: 'Invalid username or password' };
};

// Function to logout with cleanup
export const logoutUser = () => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    console.log(`User ${currentUser.name} logged out at ${new Date().toISOString()}`);
  }
  
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('loginTime');
  localStorage.removeItem('cms_auth');
};

// Function to check if user is authenticated and session is valid
export const isUserAuthenticated = () => {
  const authStatus = localStorage.getItem('cms_auth') === 'true';
  const currentUser = getCurrentUser(); // This checks session timeout
  return authStatus && currentUser !== null;
};