// A single "is there unsaved work?" flag for the admin. Editors set it, and
// in-app navigation (sidebar, command palette, breadcrumbs) checks it first.
// The app uses <BrowserRouter>, which doesn't support React Router's
// useBlocker, so this covers in-app links and beforeunload covers leaving
// the site. The browser back button isn't intercepted.
let hasUnsavedChanges = false;

export const setUnsavedChanges = (value) => {
  hasUnsavedChanges = value;
};

export const confirmDiscardChanges = () => {
  if (!hasUnsavedChanges) return true;
  const discard = window.confirm("You have unsaved changes. Leave this page and lose them?");
  if (discard) hasUnsavedChanges = false;
  return discard;
};
