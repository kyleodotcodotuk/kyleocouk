// Starting content for the demo CMS's Pages section. Edits are kept in the
// visitor's browser (see PagesContext); "Reset" in the list restores these.
const defaultPages = [
  {
    id: "home",
    title: "Homepage",
    slug: "",
    status: "Published",
    author: "Kyle O'Connor",
    updated: "2026-09-24",
    summary: "Who I am, what I focus on and how to get in touch.",
    body: "I build accessible, fast interfaces that are a pleasure to use.",
  },
  {
    id: "about",
    title: "About me",
    slug: "about",
    status: "Draft",
    author: "Kyle O'Connor",
    updated: "2026-09-18",
    summary: "A longer introduction and my background in intranets.",
    body: "I've spent most of my career building intranet platforms and the widgets that live on them.",
  },
  {
    id: "accessibility",
    title: "Accessibility statement",
    slug: "accessibility",
    status: "Published",
    author: "Sam Taylor",
    updated: "2026-08-30",
    summary: "How this site meets WCAG 2.2 AA, and how to report a problem.",
    body: "This site aims to meet WCAG 2.2 at level AA.",
  },
  {
    id: "components",
    title: "Component guidelines",
    slug: "guides/components",
    status: "In review",
    author: "Alex Morgan",
    updated: "2026-09-21",
    summary: "When to use each component, and when not to.",
    body: "",
  },
  {
    id: "release-notes",
    title: "Release notes: September 2026 - new time off widget, currency converter and a much longer title to test wrapping",
    slug: "release-notes/2026-09",
    status: "Draft",
    author: "Alex Morgan",
    updated: "2026-09-25",
    summary: "",
    body: "",
  },
];

export default defaultPages;
