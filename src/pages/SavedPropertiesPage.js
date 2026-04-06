import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Loader2 } from 'lucide-react';
import { getFavorites } from '../services/api';
import PropertyCard, { PropertyCardSkeleton } from '../components/PropertyCard';
import Navbar from '../components/Navbar';
import './SavedPropertiesPage.css';

export default function SavedPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getFavorites()
      .then((res) => setProperties(res.data.results || res.data || []))
      .catch(() => setError('Could not load saved properties.'))
      .finally(() => setLoading(false));
  }, []);

  // When user unsaves from this page, remove the card immediately
  const handleFavoriteToggle = (id, isFav) => {
    if (!isFav) setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="saved-page">
      <Navbar />

      <div className="saved-header">
        <div className="container">
          <div className="saved-header-inner">
            <Bookmark size={22} />
            <div>
              <h1 className="saved-title">Saved Properties</h1>
              <p className="saved-sub">
                {!loading && `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'} saved`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container saved-body">
        {error ? (
          <div className="saved-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        ) : loading ? (
          <div className="saved-grid">
            {Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-icon">❤️</div>
            <h3>No saved properties yet</h3>
            <p>Browse homes and tap the heart icon to save your favourites here.</p>
            <Link to="/home" className="saved-cta">Explore Properties</Link>
          </div>
        ) : (
          <div className="saved-grid">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                property={{ ...p, is_favorite: true }}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
