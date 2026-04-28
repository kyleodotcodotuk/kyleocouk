import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';
import { isRouteAvailable } from '../../config/adminRoutes';

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      let stored = JSON.parse(localStorage.getItem('cmsFavourites')) || [];
      // Validate that all favorites are still valid routes
      const validFavourites = stored.filter(fav => {
        if (!fav || !fav.path) return false;
        // Explicitly exclude removed pages by label or path
        if (fav.label === 'general' || fav.path.includes('/general') || fav.path === 'general') return false;
        return isRouteAvailable(fav.path);
      });
      
      // If any were removed, update localStorage
      if (validFavourites.length !== stored.length) {
        localStorage.setItem('cmsFavourites', JSON.stringify(validFavourites));
        console.log(`Cleaned up ${stored.length - validFavourites.length} invalid favorite(s)`);
      }
      
      setFavourites(validFavourites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      // If there's an error parsing, clear the corrupted data
      localStorage.setItem('cmsFavourites', JSON.stringify([]));
      setFavourites([]);
    }
  }, []);

  return (
    <AdminLayout>
      <section className="widget cms-dashboard">
        <h1>Favourites</h1>
        <p>Quickly access your most-used CMS pages here. Favourite any page from the menu for easy access.</p>
        {favourites.length === 0 ? (
          <p className="alert cms-favourites-empty">You have not favourited any pages yet.</p>
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
