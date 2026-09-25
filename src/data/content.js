// Single source of truth for site copy. The admin "Settings" page can
// override these values, but overrides only live in the visitor's browser.
const defaultContent = {
  personal: {
    name: "Kyle O'Connor",
    title: "UI Developer",
    tagline: "I build accessible, fast interfaces that are a pleasure to use.",
    location: "Working remotely from Greater Manchester, UK",
    email: "info@kyleo.co.uk",
    // Comma-separated so it can be edited as one field in Settings
    skills: "Accessibility, Design systems, React, Sass",
  },
  social: {
    github: "https://github.com/kyleodotcodotuk",
    linkedin: "",
    cv: "",
  },
  // Empty values fall back to the defaults in src/sass/_tokens.scss
  theme: {
    mainColour: "",
    secondaryColour: "",
    radius: "",
  },
};

export default defaultContent;
