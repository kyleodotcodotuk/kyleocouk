import { useEffect } from "react";

export const SITE_NAME = "Kyle O'Connor";
export const CMS_NAME = "Grey Cat CMS";

// Sets the browser tab title, which is also what screen readers read out
// first on a new page and what shows in history and bookmarks
export default function useDocumentTitle(title) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}
