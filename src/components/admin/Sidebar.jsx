import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../data/users";
import { getAvailableRoutes } from "../../config/adminRoutes";

const Sidebar = ({ isOpen = false, onNavigate = () => {} }) => {
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cmsFavourites")) || [];
    } catch {
      return [];
    }
  });

  // Add/remove a page from favourites
  const toggleFavourite = (fav) => {
    setFavourites((prev) => {
      let updated;
      if (prev.some((f) => f.path === fav.path)) {
        updated = prev.filter((f) => f.path !== fav.path);
      } else {
        updated = [...prev, fav];
      }
      localStorage.setItem("cmsFavourites", JSON.stringify(updated));
      return updated;
    });
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [currentUser, setCurrentUserState] = useState(null);

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

  useEffect(() => {
    // Load current user
    const user = getCurrentUser();
    setCurrentUserState(user);

    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setIsDarkMode(savedMode === "true");
      document.body.classList.toggle("dark-mode", savedMode === "true");
    } else {
      // If no saved preference, default to dark mode
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    }
  }, []);

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
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.body.classList.toggle("dark-mode", newMode);
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
    <aside className={`cms-sidebar ${isOpen ? "open" : ""}`}>
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
            <span>{currentUser?.initials || "AD"}</span>
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
              <div className="nav-item" onClick={() => toggleMenuItem(item)}>
                <span className="nav-icon material-icons">{item.icon}</span>
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
                        onClick={() => toggleSubMenuItem(item, subItem)}
                      >
                        <span className="sub-nav-icon material-icons">
                          {subItem.icon}
                        </span>
                        <span className="sub-nav-label">{subItem.label}</span>
                        {/* Only show favourite star for sub menu items without children (leaf nodes) */}
                        {!subItem.children && (
                          <span
                            className="material-icons favourite-star"
                            style={{
                              marginLeft: 8,
                              fontSize: "1rem",
                              color: favourites.some(
                                (f) => f.path === subItem.path
                              )
                                ? "#ffd700"
                                : "#b0b7c3",
                              opacity: 0.7,
                              cursor: "pointer",
                              verticalAlign: "middle",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavourite({
                                label: subItem.label,
                                path: subItem.path,
                                icon: subItem.icon,
                              });
                            }}
                          >
                            {favourites.some((f) => f.path === subItem.path)
                              ? "star"
                              : "star_border"}
                          </span>
                        )}
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
                                onClick={() =>
                                  setActiveSubSubItem(item, subItem, subSubItem)
                                }
                              >
                                <span className="sub-sub-nav-icon material-icons">
                                  {subSubItem.icon}
                                </span>
                                <span className="sub-sub-nav-label">
                                  {subSubItem.label}
                                </span>
                                <span
                                  className="material-icons favourite-star"
                                  style={{
                                    marginLeft: 8,
                                    fontSize: "1rem",
                                    color: favourites.some(
                                      (f) => f.path === subSubItem.path
                                    )
                                      ? "#ffd700"
                                      : "#b0b7c3",
                                    opacity: 0.7,
                                    cursor: "pointer",
                                    verticalAlign: "middle",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavourite({
                                      label: subSubItem.label,
                                      path: subSubItem.path,
                                      icon: subSubItem.icon,
                                    });
                                  }}
                                >
                                  {favourites.some(
                                    (f) => f.path === subSubItem.path
                                  )
                                    ? "star"
                                    : "star_border"}
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
            <div
              className="nav-item"
              onClick={() => {
                navigate("/admin/favourites");
                onNavigate();
              }}
              style={{ cursor: "pointer" }}
            >
              <span className="nav-icon material-icons">star</span>
              <span className="nav-label">Favourites</span>
            </div>
          </li>
        </ul>
      </nav>

      {/* Version info */}
      <div className="version-info">
        <span className="version-text">{localStorage.getItem('cmsVersion') || 'Grey Cat v.1.0'}</span>
      </div>

      {/* Theme Switch */}
      <div className="theme-switch-container">
        <div className="switch-row">
          <div className="theme-switch" onClick={toggleDarkMode}>
            <span className="theme-icon material-icons">
              {isDarkMode ? "light_mode" : "dark_mode"}
            </span>
            <span className="theme-label">
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </span>
            <div className="switch-toggle">
              <input type="checkbox" checked={!isDarkMode} readOnly />
              <span className="slider"></span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
