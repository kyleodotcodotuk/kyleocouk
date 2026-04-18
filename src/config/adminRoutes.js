// Dynamic route configuration for admin menu
// This configuration automatically generates the sidebar menu based on available routes

export const adminRoutes = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/admin',
    active: true
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: 'work',
    expanded: false,
    children: [
      { 
        id: 'portfolio-projects', 
        label: 'Projects', 
        icon: 'folder_special',
        path: '/admin/portfolio/projects'
      },
      { 
        id: 'portfolio-skills', 
        label: 'Skills & Expertise', 
        icon: 'psychology',
        path: '/admin/portfolio/skills'
      }
    ]
  },
  {
    id: 'media',
    label: 'Media Library',
    icon: 'perm_media',
    path: '/admin/media'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    expanded: false,
    children: [
      { 
        id: 'profile-settings', 
        label: 'Profile Settings', 
        icon: 'account_circle',
        path: '/admin/settings/profile'
      },
      { 
        id: 'site-settings', 
        label: 'Site Settings', 
        icon: 'web',
        path: '/admin/settings/site'
      }
    ]
  }
];

// Helper function to check if a route exists and user has permission
export const isRouteAvailable = (path, userPermissions = [], routePermissions = []) => {
  // Available routes in your application
  const availableRoutes = [
    '/admin',
    '/admin/portfolio',
    '/admin/portfolio/projects',
    '/admin/portfolio/skills',
    '/admin/media',
    '/admin/settings',
    '/admin/settings/profile',
    '/admin/settings/site',
    '/admin/favourites'
  ];
  
  // Check if route is available
  if (!availableRoutes.includes(path)) {
    return false;
  }

  // Check site settings permissions
  if (path === '/admin/settings/site') {
    return userPermissions.includes('manage_settings') || 
           userPermissions.includes('system_settings') || 
           userPermissions.includes('*');
  }

  // Check route-specific permissions if provided
  if (routePermissions && routePermissions.length > 0) {
    return routePermissions.some(permission => 
      userPermissions.includes(permission) || userPermissions.includes('*')
    );
  }

  // Default: route is available
  return true;
};

// Get current user permissions
export const getUserPermissions = () => {
  try {
    // Import here to avoid circular dependency
    const { usersAPI } = require('../data/users');
    const currentUser = usersAPI.getCurrentUser();
    return currentUser?.permissions || [];
  } catch (error) {
    return [];
  }
};

// Filter routes based on availability and permissions
export const getAvailableRoutes = (userPermissions = null) => {
  const permissions = userPermissions || getUserPermissions();
  
  return adminRoutes.filter(route => {
    if (route.children) {
      // Filter children based on permissions
      const availableChildren = route.children.filter(child => {
        const childPermissions = child.permissions || [];
        return isRouteAvailable(child.path, permissions, childPermissions);
      });
      
      // Special handling for settings menu
      if (route.id === 'settings') {
        if (availableChildren.length === 0) {
          return false; // No available settings at all
        } else if (availableChildren.length === 1 && availableChildren[0].id === 'profile-settings') {
          // Only profile settings available - return as single item
          return {
            ...route,
            path: availableChildren[0].path,
            children: undefined // Remove children to make it a single item
          };
        } else {
          // Multiple settings available - return with children
          return { ...route, children: availableChildren };
        }
      }
      
      // For other menus with children
      if (availableChildren.length > 0) {
        return { ...route, children: availableChildren };
      }
      return false;
    }
    
    // For routes without children, check permissions
    const routePermissions = route.permissions || [];
    return isRouteAvailable(route.path, permissions, routePermissions);
  }).filter(route => route !== false);
};