import React from "react";
import useViewTransitionNavigate from "../../hooks/useViewTransitionNavigate";

// A real link for admin pages that navigates through the view transition
// (and the unsaved-changes check). Modified clicks fall through to the
// browser, so middle-click and "open in new tab" still work.
export default function AdminLink({ to, children, ...rest }) {
  const navigate = useViewTransitionNavigate();

  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
