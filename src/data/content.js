// Single source of truth for site copy. The admin "Settings" page can
// override these values, but overrides only live in the visitor's browser.
const defaultContent = {
  personal: {
    name: "Kyle O'Connor",
    title: "UI Developer",
    location: "Manchester · United Kingdom",
    email: "info@kyleo.co.uk",
    bio: "Hello, I am Kyle O'Connor! Currently a UI developer, AKA a front end developer, web designer or other similar terminology. I live in Tameside, more well known as a part of Greater Manchester. With a remote based job for a company in Surrey. Interested in any services, I'll see what I can do for you, email me.",
  },
  social: {
    github: "https://github.com/kyleodotcodotuk",
    bitcoin: "https://strike.me/kyleocouk/",
  },
};

export default defaultContent;
