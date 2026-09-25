// Route configuration for the admin sidebar menu.
// Items can have `children` (and grandchildren) - the Sidebar renders up to three levels.

export const adminRoutes = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/admin',
    active: true
  },
  {
    id: 'components',
    label: 'Components',
    icon: 'widgets',
    path: '/admin/components'
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
    path: '/admin/settings'
  }
];

export const getAvailableRoutes = () => adminRoutes;
