export const PAGE_STATUSES = ["Draft", "In review", "Published"];

// "Café & Bar: Opening Times!" -> "cafe-and-bar-opening-times"
export const slugify = (text) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Lower-case words separated by single hyphens, with / for sections
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

// Returns { field: message } for anything wrong; an empty object means valid.
// `pages` is every page, so the slug can be checked for clashes.
export const validatePage = (page, pages) => {
  const errors = {};
  const title = page.title.trim();
  const slug = page.slug.trim();

  if (!title) errors.title = "Enter a title";
  else if (title.length > 120) errors.title = `Title must be 120 characters or fewer (it's ${title.length})`;

  // Only the homepage lives at the root
  if (page.id !== "home") {
    if (!slug) errors.slug = "Enter a URL slug";
    else if (!SLUG_PATTERN.test(slug))
      errors.slug = "Use lower-case letters, numbers and hyphens only, like about-us";
    else if (pages.some((other) => other.id !== page.id && other.slug === slug))
      errors.slug = `Another page already uses /${slug}`;
  }

  if (page.summary.length > 160) errors.summary = `Summary must be 160 characters or fewer (it's ${page.summary.length})`;

  return errors;
};

export const formatPageDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const todayIso = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};
