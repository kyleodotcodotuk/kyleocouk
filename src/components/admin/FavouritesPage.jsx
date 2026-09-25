import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { adminRoutes, isRouteAvailable } from "../../config/adminRoutes";

const STORAGE_KEY = "cmsFavourites";

// Favourites are stored in this browser
const loadFavourites = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return stored.filter((fav) => fav?.path && isRouteAvailable(fav.path));
  } catch {
    return [];
  }
};

const saveFavourites = (favourites) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  } catch {
    // Storage unavailable - the order still holds for this visit
  }
};

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState(loadFavourites);
  const [dragIndex, setDragIndex] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  // Where focus should go after the list re-renders. Reordering can move the
  // focused button's DOM node (which blurs it), and removing an item deletes it.
  const [focusTarget, setFocusTarget] = useState(null);
  const focusRefs = useRef({});

  useEffect(() => {
    if (!focusTarget) return;
    focusRefs.current[focusTarget]?.focus();
    setFocusTarget(null);
  }, [focusTarget]);

  const update = (next, message) => {
    setFavourites(next);
    saveFavourites(next);
    setAnnouncement(message);
  };

  const move = (from, to, focusId) => {
    if (from === null || to < 0 || to >= favourites.length || from === to) return;
    const next = [...favourites];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update(next, `${item.label} moved to position ${to + 1} of ${next.length}.`);
    if (focusId) setFocusTarget(focusId);
  };

  const addFavourite = (route) => {
    const fav = { label: route.label, path: route.path, icon: route.icon };
    update([...favourites, fav], `${route.label} added to favourites.`);
    setFocusTarget("heading");
  };

  const removeFavourite = (fav) => {
    update(
      favourites.filter((f) => f.path !== fav.path),
      `${fav.label} removed from favourites.`
    );
    setFocusTarget("heading");
  };

  const available = adminRoutes.filter(
    (route) => !favourites.some((fav) => fav.path === route.path)
  );

  return (
    <AdminLayout>
      <div className="dashboard">
        <section className="widget">
          <h1
            className="widget-heading"
            tabIndex={-1}
            ref={(el) => (focusRefs.current.heading = el)}
          >
            Favourites <span className="material-icons" aria-hidden="true">favorite</span>
          </h1>
          <hr />
          <p>
            Keep your most-used pages to hand. Drag to reorder, or use the
            arrow buttons if you're on a keyboard.
          </p>

          {favourites.length === 0 ? (
            <div className="alert alert-warning" role="status">
              <span className="material-icons" aria-hidden="true">assignment_late</span>
              You have not favourited any pages yet. Add one below.
            </div>
          ) : (
            <ol className="cms-favourites-list">
              {favourites.map((fav, index) => (
                <li
                  key={fav.path}
                  draggable
                  className={dragIndex === index ? "is-dragging" : undefined}
                  onDragStart={(e) => {
                    // Firefox won't start a drag without some data
                    e.dataTransfer.setData("text/plain", fav.label);
                    e.dataTransfer.effectAllowed = "move";
                    setDragIndex(index);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    move(dragIndex, index);
                  }}
                  onDragEnd={() => setDragIndex(null)}
                >
                  <span className="material-icons cms-favourite-handle" aria-hidden="true">
                    drag_indicator
                  </span>
                  <Link to={fav.path}>
                    <span className="material-icons cms-favourite-icon" aria-hidden="true">
                      {fav.icon || "star"}
                    </span>
                    <span className="cms-favourite-label">{fav.label}</span>
                  </Link>
                  <div className="cms-favourite-actions">
                    {/* aria-disabled rather than disabled, so focus isn't lost
                        when an item reaches the top or bottom */}
                    <button
                      type="button"
                      className="btn btn-secondary sc-icon-btn"
                      aria-label={`Move ${fav.label} up`}
                      aria-disabled={index === 0}
                      ref={(el) => (focusRefs.current[`${fav.path}-up`] = el)}
                      onClick={() => move(index, index - 1, `${fav.path}-up`)}
                    >
                      <span className="material-icons" aria-hidden="true">arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary sc-icon-btn"
                      aria-label={`Move ${fav.label} down`}
                      aria-disabled={index === favourites.length - 1}
                      ref={(el) => (focusRefs.current[`${fav.path}-down`] = el)}
                      onClick={() => move(index, index + 1, `${fav.path}-down`)}
                    >
                      <span className="material-icons" aria-hidden="true">arrow_downward</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger sc-icon-btn"
                      aria-label={`Remove ${fav.label} from favourites`}
                      onClick={() => removeFavourite(fav)}
                    >
                      <span className="material-icons" aria-hidden="true">delete</span>
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}

          <p className="visually-hidden" aria-live="polite">
            {announcement}
          </p>
        </section>

        {available.length > 0 && (
          <section className="widget">
            <h2 className="widget-heading">Add a page</h2>
            <ul className="sc-row cms-favourites-add">
              {available.map((route) => (
                <li key={route.path}>
                  <button type="button" className="btn btn-primary" onClick={() => addFavourite(route)}>
                    <span className="material-icons" aria-hidden="true">add</span>
                    {route.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </AdminLayout>
  );
}
