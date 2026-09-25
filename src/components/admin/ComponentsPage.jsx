import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import showcase, { SOURCE_BASE_URL } from "../../showcase";

export default function ComponentsPage() {
  const { hash } = useLocation();

  // Client-side navigation doesn't jump to #anchors, so do it here. Focus
  // moves too, so keyboard and screen reader users land on the component.
  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    target?.scrollIntoView();
    target?.focus({ preventScroll: true });
  }, [hash]);

  return (
    <AdminLayout>
      <div className="dashboard">
        <section className="widget">
          <h1 className="widget-heading">
            Components <span className="material-icons" aria-hidden="true">widgets</span>
          </h1>
          <hr />
          <p>
            A small library of UI components built for this CMS. Each one is
            live, so try it with a mouse, a keyboard or a screen reader.
          </p>
          <nav aria-label="Components on this page">
            <ul className="sc-toc">
              {showcase.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {showcase.map(({ id, title, icon, summary, notes, source, Component }) => (
          <section
            className="widget sc-example"
            key={id}
            id={id}
            tabIndex={-1}
            aria-labelledby={`${id}-title`}
          >
            <h2 className="widget-heading" id={`${id}-title`}>
              {title} <span className="material-icons" aria-hidden="true">{icon}</span>
            </h2>
            <p>{summary}</p>

            <div className="sc-preview">
              <Component />
            </div>

            <details className="sc-notes">
              <summary>How it's built</summary>
              <ul>
                {notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
              <a href={`${SOURCE_BASE_URL}${source}`} target="_blank" rel="noreferrer">
                View source on GitHub
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </details>
          </section>
        ))}
      </div>
    </AdminLayout>
  );
}
