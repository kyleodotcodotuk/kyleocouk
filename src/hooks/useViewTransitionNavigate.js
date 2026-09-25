import { useCallback } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

// Drop-in replacement for useNavigate that cross-fades between pages using
// the View Transitions API. Browsers without it (or visitors who prefer
// reduced motion) just navigate as normal.
export default function useViewTransitionNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (to, options) => {
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || reduceMotion) {
        navigate(to, options);
        return;
      }
      // flushSync makes React render the new page inside the transition callback
      document.startViewTransition(() => {
        flushSync(() => navigate(to, options));
      });
    },
    [navigate]
  );
}
