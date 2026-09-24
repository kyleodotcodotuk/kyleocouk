import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { isRouteAvailable } from "../../config/adminRoutes";

// Favourites are toggled from the sidebar and stored in this browser
const loadFavourites = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("cmsFavourites")) || [];
    return stored.filter((fav) => fav?.path && isRouteAvailable(fav.path));
  } catch {
    return [];
  }
};

export default function FavouritesPage() {
  const [favourites] = useState(loadFavourites);

  return (
    <AdminLayout>
      <div className="dashboard">
        <section className="widget">
          <h1 className="widget-heading">
            Favourites <span className="material-icons" aria-hidden="true">favorite</span>
          </h1>
          <hr />
          <p>
            Quickly access your most-used CMS pages here. Favourite any page
            from the menu for easy access.
          </p>
          {favourites.length === 0 ? (
            <div className="alert alert-warning" role="status">
              <span className="material-icons" aria-hidden="true">assignment_late</span>
              You have not favourited any pages yet.
            </div>
          ) : (
            <ul className="cms-favourites-list">
              {favourites.map((fav) => (
                <li key={fav.path}>
                  <Link to={fav.path}>
                    <span className="material-icons cms-favourite-icon" aria-hidden="true">
                      {fav.icon || "star"}
                    </span>
                    <span className="cms-favourite-label">{fav.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
