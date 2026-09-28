import React from "react";
import AdminLink from "./AdminLink";

// Breadcrumbs per the WAI-ARIA pattern: a labelled nav with an ordered list,
// and the current page marked with aria-current rather than linked
export default function Breadcrumbs({ parents = [], current }) {
  const trail = [{ label: "Dashboard", to: "/admin" }, ...parents];

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map(({ label, to }) => (
          <li key={to}>
            <AdminLink to={to}>{label}</AdminLink>
          </li>
        ))}
        <li>
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
