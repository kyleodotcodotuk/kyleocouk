// Minimal users data for admin authentication
const DEFAULT_USERS = [
  {
    id: 1,
    username: 'admin',
    name: 'Admin',
    password: 'Admin2024!',
    role: 'ADMIN',
    permissions: ['*'] // Admin has all permissions
  },
  {
    id: 2,
    username: 'visitor',
    name: 'Visitor',
    password: 'Visitor2024!',
    role: 'VISITOR',
    permissions: [] // Visitor has no special permissions
  }
];

export const usersAPI = {
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  authenticateUser: (username, password) => {
    const user = DEFAULT_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      const userData = { id: user.id, username: user.username, name: user.name, role: user.role, permissions: user.permissions };
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Invalid credentials' };
  },
  logoutUser: () => {
    localStorage.removeItem('currentUser');
  },
  isUserAuthenticated: () => {
    return !!localStorage.getItem('currentUser');
  },
  getAllUsers: () => {
    return DEFAULT_USERS;
  },
  updateUserActivity: () => {
    // Activity tracking - minimal implementation
    localStorage.setItem('cms_last_activity', new Date().toISOString());
  }
};

export const getCurrentUser = () => usersAPI.getCurrentUser();
export const getAllUsers = () => usersAPI.getAllUsers();
export const authenticateUser = (email, password) => usersAPI.authenticateUser(email, password);
export const logoutUser = () => usersAPI.logoutUser();
export const isUserAuthenticated = () => usersAPI.isUserAuthenticated();
