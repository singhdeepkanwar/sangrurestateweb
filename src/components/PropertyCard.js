import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Maximize2, Bed, Bath, ShieldCheck } from 'lucide-react';
import { formatPrice, getImageUrl, PROPERTY_TYPE_LABELS, UNIT_LABELS } from '../utils/format';
import { toggleFavorite } from '../services/api';
import './PropertyCard.css';

export default function PropertyCard({ property, onFavoriteToggle }) {
  const [saving, setSaving] = useState(false);
  const img = property.images?.[0]?.image;

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    try {
      const res = await toggleFavorite(property.id);
      onFavoriteToggle?.(property.id, res.data.status === 'favorited');
    } catch { /* silently ignore */ }
    finally { setSaving(false); }
  };

  const typeLabel = PROPERTY_TYPE_LABELS[property.property_type] || property.property_type;
  const unitLabel = UNIT_LABELS[property.unit] || property.unit;
  const isRent = property.listing_type === 'RENT';

  return (
    <Link to={`/property/${property.id}`} className="prop-card">
      {/* Image */}
      <div className="prop-card-img-wrap">
        {img
          ? <img src={getImageUrl(img)} alt={property.title} className="prop-card-img" loading="lazy" />
          : <div className="prop-card-img-placeholder"><Maximize2 size={28} color="var(--color-border)" /></div>
        }

        {/* Top badges */}
        <div className="prop-card-top">
          <div className="prop-card-badges">
            <span className="prop-badge prop-badge-type">{typeLabel}</span>
            <span className="prop-badge prop-badge-verified"><ShieldCheck size={10} /> Verified</span>
          </div>
          <button
            className={`prop-heart ${property.is_favorite ? 'saved' : ''} ${saving ? 'saving' : ''}`}
            onClick={handleFavorite}
            aria-label="Save property"
          >
            <Heart size={16} fill={property.is_favorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Listing type ribbon */}
        <div className={`prop-listing-ribbon ${isRent ? 'rent' : 'sale'}`}>
          {isRent ? 'For Rent' : 'For Sale'}
        </div>
      </div>

      {/* Content */}
      <div className="prop-card-body">
        <div className="prop-card-price-row">
          <span className="prop-card-price">{formatPrice(property.price)}</span>
          {isRent && <span className="prop-card-per-month">/mo</span>}
        </div>

        <h3 className="prop-card-title">{property.title}</h3>

        <div className="prop-card-location">
          <MapPin size={12} />
          <span>{property.city}{property.address ? `, ${property.address}` : ''}</span>
        </div>

        <div className="prop-card-divider" />

        <div className="prop-card-stats">
          {property.property_type === 'HOUSE' || property.property_type === 'APARTMENT' ? (
            <>
              {property.bedrooms != null && (
                <span className="prop-stat"><Bed size={13} /> {property.bedrooms} Bed</span>
              )}
              {property.bathrooms != null && (
                <span className="prop-stat"><Bath size={13} /> {property.bathrooms} Bath</span>
              )}
            </>
          ) : null}
          <span className="prop-stat"><Maximize2 size={13} /> {property.area} {unitLabel}</span>
        </div>
      </div>
    </Link>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="prop-card prop-card-skeleton">
      <div className="prop-card-img-wrap skel-img" />
      <div className="prop-card-body">
        <div className="skel-line skel-price" />
        <div className="skel-line skel-title" />
        <div className="skel-line skel-sub" />
        <div className="prop-card-divider" />
        <div className="skel-stats">
          <div className="skel-line skel-stat" />
          <div className="skel-line skel-stat" />
        </div>
      </div>
    </div>
  );
}
