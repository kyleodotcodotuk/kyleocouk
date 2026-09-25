// Theme, greyscale and sidebar preferences, applied as attributes on <html> so the
// tokens in _tokens.scss can respond. public/index.html runs the same logic
// before first paint, so the page never flashes the wrong theme.
const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable (private mode etc.): the choice lasts this visit only
  }
};

// The main-colour (dark) theme is the default; light mode is opt-in
export const getDarkMode = () => read('darkMode') !== 'false';

export const setDarkMode = (isDark) => {
  write('darkMode', String(isDark));
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
};

export const getGreyscale = () => read('greyscale') === 'true';

export const setGreyscale = (isGreyscale) => {
  write('greyscale', String(isGreyscale));
  document.documentElement.toggleAttribute('data-greyscale', isGreyscale);
};

export const getSidebarCollapsed = () => read('sidebarCollapsed') === 'true';

export const setSidebarCollapsed = (isCollapsed) => {
  write('sidebarCollapsed', String(isCollapsed));
};
