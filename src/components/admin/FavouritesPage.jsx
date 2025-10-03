import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      setFavourites(JSON.parse(localStorage.getItem('cmsFavourites')) || []);
    } catch {
      setFavourites([]);
    }
  }, []);

  return (
    <AdminLayout>
      <section className="cms-section">
        <h1>Favourites</h1>
        <p>Quickly access your most-used CMS pages here. Favourite any page from the menu for easy access.</p>
        {favourites.length === 0 ? (
          <p className="cms-favourites-empty">You have not favourited any pages yet.</p>
        ) : (
          <div className="cms-favourites-list">
            {favourites.map(fav => (
              <div key={fav.path} className="cms-favourite-item" onClick={() => navigate(fav.path)}>
                <span className="material-icons cms-favourite-icon">{fav.icon || 'star'}</span>
                <span className="cms-favourite-label">{fav.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
