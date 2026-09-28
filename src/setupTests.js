import "@testing-library/jest-dom";

// jsdom doesn't implement these browser APIs, which the admin relies on

// <dialog> (command palette, media preview)
if (!HTMLElement.prototype.showModal) {
  HTMLElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLElement.prototype.close = function close() {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
}

// Reduced-motion check in useViewTransitionNavigate
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
}

Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || function scrollIntoView() {};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
