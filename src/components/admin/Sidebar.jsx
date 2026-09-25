import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getAvailableRoutes } from "../../config/adminRoutes";
import useViewTransitionNavigate from "../../hooks/useViewTransitionNavigate";
import {
  getDarkMode,
  getGreyscale,
  getSidebarCollapsed,
  setDarkMode,
  setGreyscale,
  setSidebarCollapsed,
} from "../../utils/displayPrefs";

// Lets clickable non-button elements respond to Enter/Space like a button
const pressable = (onActivate) => ({
  role: "button",
  tabIndex: 0,
  onClick: onActivate,
  onKeyDown: (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate(e);
    }
  },
});

const Sidebar = ({ isOpen = false, onNavigate = () => {} }) => {
  const navigate = useViewTransitionNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(getDarkMode);
  const [isGreyscale, setIsGreyscale] = useState(getGreyscale);
  const [isCollapsed, setIsCollapsed] = useState(getSidebarCollapsed);
  const { user: currentUser } = useAuth();

  // Get dynamic menu items based on available routes
  const getInitialMenuItems = () => {
    const saved = localStorage.getItem("sidebarMenuItems");
    if (saved) {
      try {
        const savedItems = JSON.parse(saved);
        // Merge saved state with current available routes
        const availableRoutes = getAvailableRoutes();
        return mergeMenuState(availableRoutes, savedItems);
      } catch {
        // fallback to available routes if parse fails
      }
    }
    return getAvailableRoutes();
  };

  // Helper function to merge saved menu state with available routes
  const mergeMenuState = (availableRoutes, savedState) => {
    return availableRoutes.map((route) => {
      const saved = savedState.find((item) => item.id === route.id);
      if (saved) {
        return {
          ...route,
          expanded: saved.expanded || false,
          active: saved.active || false,
          children: route.children
            ? route.children.map((child) => {
                const savedChild = saved.children?.find(
                  (c) => c.id === child.id
                );
                return {
                  ...child,
                  active: savedChild?.active || false,
                  expanded: savedChild?.expanded || false,
                };
              })
            : undefined,
        };
      }
      return route;
    });
  };

  // Auto-detect active menu item based on current route
  const updateActiveItemFromRoute = (items) => {
    const currentPath = location.pathname;

    return items.map((item) => {
      if (item.path === currentPath) {
        return { ...item, active: true };
      }

      if (item.children) {
        const updatedChildren = item.children.map((child) => {
          if (child.path === currentPath) {
            return { ...child, active: true };
          }
          return { ...child, active: false };
        });

        const hasActiveChild = updatedChildren.some((child) => child.active);
        return {
          ...item,
          active: false,
          expanded: hasActiveChild || item.expanded,
          children: updatedChildren,
        };
      }

      return { ...item, active: false };
    });
  };

  // Update active menu item when route changes
  useEffect(() => {
    setMenuItems((prevItems) => {
      const updatedItems = updateActiveItemFromRoute(prevItems);
      localStorage.setItem("sidebarMenuItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  const toggleGreyscale = () => {
    setGreyscale(!isGreyscale);
    setIsGreyscale(!isGreyscale);
  };

  // Collapse to an icon rail, like the WordPress "Collapse menu" control
  const toggleCollapsed = () => {
    setSidebarCollapsed(!isCollapsed);
    setIsCollapsed(!isCollapsed);
  };

  const [menuItems, setMenuItems] = useState(() => {
    const initialItems = getInitialMenuItems();
    return updateActiveItemFromRoute(initialItems);
  });

  const toggleMenuItem = (item) => {
    if (item.children && item.children.length > 0) {
      setMenuItems((prevItems) => {
        const updated = prevItems.map((menuItem) => ({
          ...menuItem,
          expanded:
            menuItem.id === item.id ? !menuItem.expanded : menuItem.expanded,
        }));
        localStorage.setItem("sidebarMenuItems", JSON.stringify(updated));
        return updated;
      });
    } else {
      setActiveItem(item.id);
      if (item.path) {
        navigate(item.path);
        onNavigate();
      }
    }
  };

  const toggleSubMenuItem = (parentItem, subItem) => {
    if (subItem.children && subItem.children.length > 0) {
      setMenuItems((prevItems) => {
        const updated = prevItems.map((menuItem) => {
          if (menuItem.id === parentItem.id) {
            return {
              ...menuItem,
              children: menuItem.children.map((child) => ({
                ...child,
                expanded:
                  child.id === subItem.id ? !child.expanded : child.expanded,
              })),
            };
          }
          return menuItem;
        });
        localStorage.setItem("sidebarMenuItems", JSON.stringify(updated));
        return updated;
      });
    } else {
      setActiveSubItem(parentItem, subItem);
      if (subItem.path) {
        navigate(subItem.path);
        onNavigate();
      }
    }
  };

  const setActiveItem = (itemId) => {
    setMenuItems((prevItems) => {
      const updated = prevItems.map((item) => ({
        ...item,
        active: item.id === itemId,
        children: item.children
          ? item.children.map((child) => ({
              ...child,
              active: false,
              children: child.children
                ? child.children.map((grandChild) => ({
                    ...grandChild,
                    active: false,
                  }))
                : undefined,
            }))
          : undefined,
      }));
      localStorage.setItem("sidebarMenuItems", JSON.stringify(updated));
      return updated;
    });
  };

  const setActiveSubItem = (parentItem, subItem) => {
    setMenuItems((prevItems) => {
      const updated = prevItems.map((item) => ({
        ...item,
        active: false,
        expanded: item.id === parentItem.id ? true : item.expanded,
        children: item.children
          ? item.children.map((child) => ({
              ...child,
              active: child.id === subItem.id,
              children: child.children
                ? child.children.map((grandChild) => ({
                    ...grandChild,
                    active: false,
                  }))
                : undefined,
            }))
          : undefined,
      }));
      localStorage.setItem("sidebarMenuItems", JSON.stringify(updated));
      return updated;
    });
  };

  const setActiveSubSubItem = (parentItem, subItem, subSubItem) => {
    setMenuItems((prevItems) => {
      const updated = prevItems.map((item) => ({
        ...item,
        active: false,
        expanded: item.id === parentItem.id ? true : item.expanded,
        children: item.children
          ? item.children.map((child) => ({
              ...child,
              active: false,
              expanded: child.id === subItem.id ? true : child.expanded,
              children: child.children
                ? child.children.map((grandChild) => ({
                    ...grandChild,
                    active: grandChild.id === subSubItem.id,
                  }))
                : undefined,
            }))
          : undefined,
      }));
      localStorage.setItem("sidebarMenuItems", JSON.stringify(updated));
      return updated;
    });
    if (subSubItem.path) {
      navigate(subSubItem.path);
      onNavigate();
    }
  };

  const isItemActive = (item) => {
    return (
      item.active ||
      (item.children &&
        item.children.some(
          (child) =>
            child.active ||
            (child.children &&
              child.children.some((grandChild) => grandChild.active))
        ))
    );
  };

  return (
    <aside
      className={`cms-sidebar ${isOpen ? "open" : ""} ${isCollapsed ? "is-collapsed" : ""}`}
    >
      {/* User Profile Section */}
      <div className="user-profile">
        <div className="avatar">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="user-avatar"
            />
          ) : (
            <span>{currentUser?.initials || "A"}</span>
          )}
        </div>
        <div className="user-info">
          <h3>{currentUser?.displayRole || "Administrator"}</h3>
          <div className="detail-item">
            <span className="material-icons">location_on</span>
            <span className="location">
              {currentUser?.location || "Manchester, UK"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="cms-nav">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`
                ${isItemActive(item) ? "active" : ""}
                ${
                  item.children && item.children.length > 0
                    ? "has-children"
                    : ""
                }
                ${item.expanded ? "expanded" : ""}
              `}
            >
              {/* Main menu item */}
              <div
                className="nav-item"
                title={isCollapsed ? item.label : undefined}
                aria-current={item.active ? "page" : undefined}
                aria-expanded={item.children?.length ? !!item.expanded : undefined}
                {...pressable(() => toggleMenuItem(item))}
              >
                <span className="nav-icon material-icons" aria-hidden="true">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.children && item.children.length > 0 && (
                  <span
                    className={`expand-icon material-icons ${
                      item.expanded ? "rotated" : ""
                    }`}
                  >
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
                        ${subItem.active ? "active" : ""}
                        ${
                          subItem.children && subItem.children.length > 0
                            ? "has-children"
                            : ""
                        }
                        ${subItem.expanded ? "expanded" : ""}
                      `}
                    >
                      <div
                        className="sub-nav-item"
                        aria-current={subItem.active ? "page" : undefined}
                        {...pressable(() => toggleSubMenuItem(item, subItem))}
                      >
                        <span className="sub-nav-icon material-icons">
                          {subItem.icon}
                        </span>
                        <span className="sub-nav-label">{subItem.label}</span>
                        {subItem.children && subItem.children.length > 0 && (
                          <span
                            className={`expand-icon material-icons ${
                              subItem.expanded ? "rotated" : ""
                            }`}
                          >
                            chevron_right
                          </span>
                        )}
                      </div>

                      {/* Third-level menu items */}
                      {subItem.expanded && subItem.children && (
                        <ul className="sub-sub-menu">
                          {subItem.children.map((subSubItem) => (
                            <li
                              key={subSubItem.id}
                              className={subSubItem.active ? "active" : ""}
                            >
                              <div
                                className="sub-sub-nav-item"
                                aria-current={subSubItem.active ? "page" : undefined}
                                {...pressable(() =>
                                  setActiveSubSubItem(item, subItem, subSubItem)
                                )}
                              >
                                <span className="sub-sub-nav-icon material-icons">
                                  {subSubItem.icon}
                                </span>
                                <span className="sub-sub-nav-label">
                                  {subSubItem.label}
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
        </ul>
      </nav>

      {/* Version info */}
      <div className="version-info">
        <span className="version-text">Grey Cat CMS © <em>{localStorage.getItem('cmsVersion') || ' v 1.3.1'}</em></span>
      </div>

      {/* Display switches */}
      <div className="theme-switch-container">
        <button
          type="button"
          className="theme-switch"
          onClick={toggleCollapsed}
          title={isCollapsed ? "Expand menu" : undefined}
        >
          <span className="theme-icon material-icons" aria-hidden="true">
            {isCollapsed ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left"}
          </span>
          <span className="theme-label">{isCollapsed ? "Expand menu" : "Collapse menu"}</span>
        </button>
        <button
          type="button"
          role="switch"
          className="theme-switch"
          aria-checked={!isDarkMode}
          onClick={toggleDarkMode}
          title={isCollapsed ? "Light mode" : undefined}
        >
          <span className="theme-icon material-icons" aria-hidden="true">light_mode</span>
          <span className="theme-label">Light mode</span>
          <span className="switch-toggle" aria-hidden="true">
            <span className="slider"></span>
          </span>
        </button>
        <button
          type="button"
          role="switch"
          className="theme-switch"
          aria-checked={isGreyscale}
          onClick={toggleGreyscale}
          title={isCollapsed ? "Greyscale" : undefined}
        >
          <span className="theme-icon material-icons" aria-hidden="true">contrast</span>
          <span className="theme-label">Greyscale</span>
          <span className="switch-toggle" aria-hidden="true">
            <span className="slider"></span>
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
