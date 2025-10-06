import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getAllUsers, setCurrentUser } from '../../data/users';

const Sidebar = () => {
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cmsFavourites')) || [];
    } catch {
      return [];
    }
  });

  // Add/remove a page from favourites
  const toggleFavourite = (fav) => {
    setFavourites(prev => {
      let updated;
      if (prev.some(f => f.path === fav.path)) {
        updated = prev.filter(f => f.path !== fav.path);
      } else {
        updated = [...prev, fav];
      }
      localStorage.setItem('cmsFavourites', JSON.stringify(updated));
      return updated;
    });
  };
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [currentUser, setCurrentUserState] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    // Load current user and all users
    const user = getCurrentUser();
    const users = getAllUsers();
    setCurrentUserState(user);
    setAllUsers(users);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-profile')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
      document.body.classList.toggle('dark-mode', savedMode === 'true');
    } else {
      // If no saved preference, default to dark mode
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleUserSwitch = (userId) => {
    setCurrentUser(userId);
    const newUser = getCurrentUser();
    setCurrentUserState(newUser);
    setShowUserDropdown(false);
    // Update session info for the new user
    localStorage.setItem('cms_session_start', new Date().toISOString());
    
    // Trigger custom event to notify other components
    window.dispatchEvent(new CustomEvent('userChanged', { detail: { user: newUser } }));
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.body.classList.toggle('dark-mode', newMode);
  };

  // Load menu state from localStorage if available
  const getInitialMenuItems = () => {
    const saved = localStorage.getItem('sidebarMenuItems');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback to default if parse fails
      }
    }
    return [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      path: '/admin',
      active: true
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: 'article',
      expanded: false,
      children: [
        { 
          id: 'posts', 
          label: 'Posts', 
          icon: 'description',
          path: '/admin/posts',
          children: [
            { id: 'create-post', label: 'Create New Post', icon: 'add_circle', path: '/admin/posts/create' },
            { id: 'all-posts', label: 'All Posts', icon: 'list', path: '/admin/posts' },
            { id: 'draft-posts', label: 'Draft Posts', icon: 'edit_note', path: '/admin/posts/drafts' },
            { id: 'published-posts', label: 'Published Posts', icon: 'publish', path: '/admin/posts/published' }
          ]
        },
        { 
          id: 'pages', 
          label: 'Pages', 
          icon: 'web',
          path: '/admin/pages',
          children: [
            { id: 'create-page', label: 'Create New Page', icon: 'add_circle', path: '/admin/pages/create' },
            { id: 'existing-pages', label: 'Existing Pages', icon: 'list', path: '/admin/pages' },
            { id: 'page-templates', label: 'Page Templates', icon: 'view_quilt', path: '/admin/pages/templates' }
          ]
        },
        { 
          id: 'categories', 
          label: 'Categories', 
          icon: 'category',
          path: '/admin/categories',
          children: [
            { id: 'create-category', label: 'Create New Category', icon: 'add_circle', path: '/admin/categories/create' },
            { id: 'manage-categories', label: 'Manage Categories', icon: 'category', path: '/admin/categories' }
          ]
        }
      ]
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'people',
      expanded: false,
      children: [
        { id: 'all-users', label: 'All Users', icon: 'person', path: '/admin/users' },
        { id: 'roles', label: 'Roles & Permissions', icon: 'security', path: '/admin/users/roles' },
        { id: 'user-groups', label: 'User Groups', icon: 'group', path: '/admin/users/groups' }
      ]
    },
    {
      id: 'media',
      label: 'Media Library',
      icon: 'perm_media',
      expanded: false,
      children: [
        { id: 'images', label: 'Images', icon: 'image', path: '/admin/media/images' },
        { id: 'videos', label: 'Videos', icon: 'videocam', path: '/admin/media/videos' },
        { id: 'documents', label: 'Documents', icon: 'description', path: '/admin/media/documents' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      expanded: false,
      children: [
        { id: 'user-settings', label: 'User Settings', icon: 'person', path: '/admin/settings/user' },
        { id: 'security', label: 'Security', icon: 'shield', path: '/admin/settings/security' }
      ]
    }
    ];
  };
  const [menuItems, setMenuItems] = useState(getInitialMenuItems);

  const toggleMenuItem = (item) => {
    if (item.children && item.children.length > 0) {
      setMenuItems(prevItems => {
        const updated = prevItems.map(menuItem => ({
          ...menuItem,
          expanded: menuItem.id === item.id ? !menuItem.expanded : menuItem.expanded
        }));
        localStorage.setItem('sidebarMenuItems', JSON.stringify(updated));
        return updated;
      });
    } else {
      setActiveItem(item.id);
      if (item.path) {
        navigate(item.path);
      }
    }
  };

  const toggleSubMenuItem = (parentItem, subItem) => {
    if (subItem.children && subItem.children.length > 0) {
      setMenuItems(prevItems => {
        const updated = prevItems.map(menuItem => {
          if (menuItem.id === parentItem.id) {
            return {
              ...menuItem,
              children: menuItem.children.map(child => ({
                ...child,
                expanded: child.id === subItem.id ? !child.expanded : child.expanded
              }))
            };
          }
          return menuItem;
        });
        localStorage.setItem('sidebarMenuItems', JSON.stringify(updated));
        return updated;
      });
    } else {
      setActiveSubItem(parentItem, subItem);
      if (subItem.path) {
        navigate(subItem.path);
      }
    }
  };

  const setActiveItem = (itemId) => {
    setMenuItems(prevItems => {
      const updated = prevItems.map(item => ({
        ...item,
        active: item.id === itemId,
        children: item.children ? item.children.map(child => ({
          ...child,
          active: false,
          children: child.children ? child.children.map(grandChild => ({
            ...grandChild,
            active: false
          })) : undefined
        })) : undefined
      }));
      localStorage.setItem('sidebarMenuItems', JSON.stringify(updated));
      return updated;
    });
  };

  const setActiveSubItem = (parentItem, subItem) => {
    setMenuItems(prevItems => {
      const updated = prevItems.map(item => ({
        ...item,
        active: false,
        expanded: item.id === parentItem.id ? true : item.expanded,
        children: item.children ? item.children.map(child => ({
          ...child,
          active: child.id === subItem.id,
          children: child.children ? child.children.map(grandChild => ({
            ...grandChild,
            active: false
          })) : undefined
        })) : undefined
      }));
      localStorage.setItem('sidebarMenuItems', JSON.stringify(updated));
      return updated;
    });
  };

  const setActiveSubSubItem = (parentItem, subItem, subSubItem) => {
    setMenuItems(prevItems => {
      const updated = prevItems.map(item => ({
        ...item,
        active: false,
        expanded: item.id === parentItem.id ? true : item.expanded,
        children: item.children ? item.children.map(child => ({
          ...child,
          active: false,
          expanded: child.id === subItem.id ? true : child.expanded,
          children: child.children ? child.children.map(grandChild => ({
            ...grandChild,
            active: grandChild.id === subSubItem.id
          })) : undefined
        })) : undefined
      }));
      localStorage.setItem('sidebarMenuItems', JSON.stringify(updated));
      return updated;
    });
    if (subSubItem.path) {
      navigate(subSubItem.path);
    }
  };

  const isItemActive = (item) => {
    return item.active || (item.children && item.children.some(child => 
      child.active || (child.children && child.children.some(grandChild => grandChild.active))
    ));
  };

  // Burger menu state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change or resize
  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 500) setSidebarOpen(false);
    };
    window.addEventListener('resize', closeOnResize);
    return () => {
      window.removeEventListener('resize', closeOnResize);
    };
  }, []);

  return (
    <>
      {/* Burger menu button for mobile */}
      <button
        className="sidebar-toggle"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen((open) => !open)}
        style={{
          display: window.innerWidth > 500 ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1100,
          background: '#5b21b6',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          padding: 0,
          boxShadow: '0 2px 8px rgba(76,29,149,0.15)',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        <span className="material-icons" style={{ fontSize: 32, color: '#fff' }}>{sidebarOpen ? 'close' : 'menu'}</span>
      </button>
      <aside className={`cms-sidebar${sidebarOpen ? ' open' : ''}`}
        style={window.innerWidth <= 500 ? {
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1000,
          background: '#5b21b6',
          boxShadow: '4px 0 20px rgba(76, 29, 149, 0.4)',
        } : {}}
      >
      {/* User Profile Section */}
      <div className="user-profile">
        <div 
          className="user-profile-current"
          onClick={() => setShowUserDropdown(!showUserDropdown)}
        >
          <div className="avatar">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" />
            ) : (
              <span>{currentUser?.initials || 'AA'}</span>
            )}
          </div>
          <div className="user-info">
            <h3>{currentUser?.name || 'Admin User'}</h3>
            <div className="detail-item">
              <span className="material-icons">business</span>
              <span className="role">{currentUser?.role || 'Administrator'}</span>
            </div>
            <div className="detail-item">
              <span className="material-icons">location_on</span>
              <span className="location">{currentUser?.location || 'System'}</span>
            </div>
          </div>
          <div className="user-dropdown-arrow">
            <span className="material-icons">
              {showUserDropdown ? 'expand_less' : 'expand_more'}
            </span>
          </div>
        </div>
        
        {showUserDropdown && (
          <div className="user-dropdown-panel">
            <div className="dropdown-header">Switch User</div>
            {allUsers.map(user => (
              <div 
                key={user.id}
                className={`dropdown-user ${currentUser?.id === user.id ? 'active' : ''}`}
                onClick={() => handleUserSwitch(user.id)}
              >
                <div className="dropdown-user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                  ) : (
                    <span className="user-initials">{user.initials}</span>
                  )}
                </div>
                <div className="dropdown-user-info">
                  <div className="dropdown-user-name">{user.name}</div>
                  <div className="dropdown-user-role">{user.role}</div>
                </div>
                {currentUser?.id === user.id && (
                  <div className="current-indicator">
                    <span className="material-icons">check_circle</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Actions */}
      <div className="sidebar-actions">
        <div className="action-btn primary">
          <span className="material-icons">add</span>
          <span>Create New</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="cms-nav">
        <ul>
          {menuItems.map((item) => (
            <li 
              key={item.id}
              className={`
                ${isItemActive(item) ? 'active' : ''}
                ${item.children && item.children.length > 0 ? 'has-children' : ''}
                ${item.expanded ? 'expanded' : ''}
              `}
            >
              {/* Main menu item */}
              <div className="nav-item" onClick={() => toggleMenuItem(item)}>
                <span className="nav-icon material-icons">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.children && item.children.length > 0 && (
                  <span className={`expand-icon material-icons ${item.expanded ? 'rotated' : ''}`}>
                    chevron_right
                  </span>
                )}
              </div>

              {/* Sub-menu items */}
              {item.expanded && item.children && (
                <ul className="sub-menu">
                  {item.children.map((subItem) => (
                    <li 
                      key={subItem.id}
                      className={`
                        ${subItem.active ? 'active' : ''}
                        ${subItem.children && subItem.children.length > 0 ? 'has-children' : ''}
                        ${subItem.expanded ? 'expanded' : ''}
                      `}
                    >
                      <div className="sub-nav-item" onClick={() => toggleSubMenuItem(item, subItem)}>
                        <span className="sub-nav-icon material-icons">{subItem.icon}</span>
                        <span className="sub-nav-label">{subItem.label}</span>
                        {/* Only show favourite star for sub menu items without children (leaf nodes) */}
                        {!subItem.children && (
                          <span className="material-icons favourite-star" style={{marginLeft: 8, fontSize: '1rem', color: favourites.some(f => f.path === subItem.path) ? '#ffd700' : '#b0b7c3', opacity: 0.7, cursor: 'pointer', verticalAlign: 'middle'}} onClick={e => {e.stopPropagation(); toggleFavourite({label: subItem.label, path: subItem.path, icon: subItem.icon});}}>
                            {favourites.some(f => f.path === subItem.path) ? 'star' : 'star_border'}
                          </span>
                        )}
                          {subItem.children && subItem.children.length > 0 && (
                            <span className={`expand-icon material-icons ${subItem.expanded ? 'rotated' : ''}`}>
                              chevron_right
                            </span>
                          )}
                        </div>

                        {/* Third-level menu items */}
                        {subItem.expanded && subItem.children && (
                          <ul className="sub-sub-menu">
                            {subItem.children.map((subSubItem) => (
                              <li key={subSubItem.id} className={subSubItem.active ? 'active' : ''}>
                                <div className="sub-sub-nav-item" onClick={() => setActiveSubSubItem(item, subItem, subSubItem)}>
                                  <span className="sub-sub-nav-icon material-icons">{subSubItem.icon}</span>
                                  <span className="sub-sub-nav-label">{subSubItem.label}</span>
                                  <span className="material-icons favourite-star" style={{marginLeft: 8, fontSize: '1rem', color: favourites.some(f => f.path === subSubItem.path) ? '#ffd700' : '#b0b7c3', opacity: 0.7, cursor: 'pointer', verticalAlign: 'middle'}} onClick={e => {e.stopPropagation(); toggleFavourite({label: subSubItem.label, path: subSubItem.path, icon: subSubItem.icon});}}>
                                    {favourites.some(f => f.path === subSubItem.path) ? 'star' : 'star_border'}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          {/* Favourites menu item */}
          <li className="favourites-menu">
            <div className="nav-item" onClick={() => navigate('/admin/favourites')} style={{cursor: 'pointer'}}>
              <span className="nav-icon material-icons">star</span>
              <span className="nav-label">Favourites</span>
            </div>
          </li>
        </ul>
      </nav>

      {/* Version info */}
      <div className="version-info">
        <span className="version-text">Grey Cat v.1.0</span>
      </div>

      {/* Theme Switch */}
      <div className="theme-switch-container">
        <div className="switch-row">
          <div className="theme-switch" onClick={toggleDarkMode}>
            <span className="theme-icon material-icons">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="theme-label">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
            <div className="switch-toggle">
              <input type="checkbox" checked={!isDarkMode} readOnly />
              <span className="slider"></span>
            </div>
          </div>
        </div>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;