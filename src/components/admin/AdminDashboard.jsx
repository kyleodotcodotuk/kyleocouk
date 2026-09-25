import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import showcase from "../../showcase";
import AdminLayout from "./AdminLayout";

const shortcuts = [
  {
    to: "/admin/components",
    icon: "widgets",
    title: "Components",
    text: `Browse ${showcase.length} live UI components and how they're built.`,
  },
  {
    to: "/admin/settings",
    icon: "settings",
    title: "Settings",
    text: "Edit the homepage profile and links, or retheme the site live.",
  },
  {
    to: "/admin/media",
    icon: "perm_media",
    title: "Media Library",
    text: "A browsable image grid with a preview dialog.",
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0];

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="fullWidth">
          <section className="widget">
            <h1 className="widget-heading">
              Welcome back, {firstName}{" "}
              <span className="material-icons" aria-hidden="true">waving_hand</span>
            </h1>
            <hr />
            <p>
              Grey Cat is a demo CMS I built to show my front-end work: layout,
              navigation, forms and accessible components. It runs entirely in
              your browser, so nothing you change here reaches a server.
            </p>
            <p>
              Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (<kbd>⌘</kbd> + <kbd>K</kbd> on a Mac) to jump to any
              page or component, or try the live theme editor in Settings.
            </p>
          </section>
        </div>

        <div className="column-wrapper">
          {shortcuts.map((shortcut) => (
            <div className="third-column" key={shortcut.to}>
              <section className="widget">
                <h2 className="widget-heading">
                  {shortcut.title}{" "}
                  <span className="material-icons" aria-hidden="true">{shortcut.icon}</span>
                </h2>
                <p>{shortcut.text}</p>
                <Link className="btn btn-primary" to={shortcut.to}>
                  Open {shortcut.title}
                </Link>
              </section>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
