import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, SlidersHorizontal, X, Home, Key, Building2, MapPin, Layers, ChevronDown, RotateCcw } from 'lucide-react';
import { getProperties } from '../services/api';
import PropertyCard, { PropertyCardSkeleton } from '../components/PropertyCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

const PRICE_RANGES = [
  { label: 'Any', value: null },
  { label: 'Under ₹50L', value: { lte: 5_000_000 } },
  { label: '₹50L – ₹1Cr', value: { gte: 5_000_000, lte: 10_000_000 } },
  { label: '₹1Cr – ₹3Cr', value: { gte: 10_000_000, lte: 30_000_000 } },
  { label: 'Above ₹3Cr', value: { gte: 30_000_000 } },
];

const PROP_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'House', value: 'HOUSE', icon: '🏠' },
  { label: 'Apartment', value: 'APARTMENT', icon: '🏢' },
  { label: 'Plot', value: 'PLOT', icon: '📐' },
  { label: 'Land', value: 'LAND', icon: '🌾' },
  { label: 'Commercial', value: 'COMMERCIAL', icon: '🏪' },
  { label: 'PG', value: 'PG', icon: '🛏' },
];

export default function HomePage() {
  const { user } = useAuth();

  // Filter state
  const [listingType, setListingType] = useState('SALE');
  const [search, setSearch] = useState('');
  const [propType, setPropType] = useState('');
  const [priceRange, setPriceRange] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Data state
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const debounceRef = useRef(null);
  const requestRef = useRef(0);

  const fetchProperties = useCallback(async (params) => {
    const id = ++requestRef.current;
    setLoading(true);
    setError('');
    try {
      const res = await getProperties(params);
      if (id !== requestRef.current) return; // stale response — discard
      setProperties(res.data.results || res.data);
    } catch {
      if (id === requestRef.current) setError('Could not load properties. Please try again.');
    } finally {
      if (id === requestRef.current) setLoading(false);
    }
  }, []);

  // Re-fetch whenever filters change (debounced for search text)
  useEffect(() => {
    const params = {
      listing_type: listingType,
      property_type: propType || undefined,
      ordering: '-id',
    };
    if (search.trim()) params.search = search.trim();
    if (priceRange?.gte) params.price__gte = priceRange.gte;
    if (priceRange?.lte) params.price__lte = priceRange.lte;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchProperties(params), search ? 400 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [listingType, propType, priceRange, search, fetchProperties]);

  const handleFavoriteToggle = (id, isFav) => {
    setProperties((prev) => prev.map((p) => p.id === id ? { ...p, is_favorite: isFav } : p));
  };

  const clearFilters = () => {
    setPropType('');
    setPriceRange(null);
    setSearch('');
    setFilterOpen(false);
  };

  const hasActiveFilters = propType || priceRange || search;
  const activeFilterCount = [propType, priceRange, search.trim()].filter(Boolean).length;

  return (
    <div className="home-page">
      <Navbar />

      {/* ── Greeting bar ── */}
      <div className="home-greeting-bar">
        <div className="container">
          <div className="home-greeting-inner">
            <div>
              <h1 className="home-greeting-title">
                Good day, {user?.full_name?.split(' ')[0] || 'there'} 👋
              </h1>
              <p className="home-greeting-sub">Find your perfect property in Sangrur</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & filter bar ── */}
      <div className="home-search-bar-wrap">
        <div className="container">
          <div className="home-search-row">
            {/* Buy / Rent toggle */}
            <div className="home-type-toggle">
              <button
                className={`htt-btn ${listingType === 'SALE' ? 'active' : ''}`}
                onClick={() => setListingType('SALE')}
              >
                <Home size={14} /> Buy
              </button>
              <button
                className={`htt-btn ${listingType === 'RENT' ? 'active' : ''}`}
                onClick={() => setListingType('RENT')}
              >
                <Key size={14} /> Rent
              </button>
            </div>

            {/* Search input */}
            <div className="home-search-input-wrap">
              <Search size={16} className="home-search-icon" />
              <input
                className="home-search-input"
                type="text"
                placeholder="Search location, city, or keyword…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="home-search-clear" onClick={() => setSearch('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter button */}
            <button
              className={`home-filter-btn ${filterOpen ? 'open' : ''} ${activeFilterCount > 0 ? 'has-filters' : ''}`}
              onClick={() => setFilterOpen((o) => !o)}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && <span className="hfb-badge">{activeFilterCount}</span>}
            </button>
          </div>

          {/* Quick-filter chips */}
          <div className="home-chip-row">
            {PROP_TYPES.map((t) => (
              <button
                key={t.value}
                className={`home-chip ${propType === t.value ? 'active' : ''}`}
                onClick={() => setPropType(t.value)}
              >
                {t.icon && <span>{t.icon}</span>} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter panel ── */}
      {filterOpen && (
        <div className="home-filter-panel">
          <div className="container">
            <div className="hfp-inner">
              <div className="hfp-section">
                <label className="hfp-label"><MapPin size={13} /> City</label>
                <input
                  className="hfp-input"
                  placeholder="e.g. Sangrur, Sunam, Dhuri…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="hfp-section">
                <label className="hfp-label"><Layers size={13} /> Property Type</label>
                <div className="hfp-chips">
                  {PROP_TYPES.map((t) => (
                    <button
                      key={t.value}
                      className={`hfp-chip ${propType === t.value ? 'active' : ''}`}
                      onClick={() => setPropType(t.value)}
                    >
                      {t.icon && <span>{t.icon}</span>} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hfp-section">
                <label className="hfp-label">💰 Price Range</label>
                <div className="hfp-chips">
                  {PRICE_RANGES.map((r) => (
                    <button
                      key={r.label}
                      className={`hfp-chip ${JSON.stringify(priceRange) === JSON.stringify(r.value) ? 'active' : ''}`}
                      onClick={() => setPriceRange(r.value)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hfp-actions">
                <button className="hfp-clear" onClick={clearFilters}>
                  <RotateCcw size={13} /> Clear All
                </button>
                <button className="hfp-apply" onClick={() => setFilterOpen(false)}>
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Results area ── */}
      <div className="container home-results">
        {/* Result count / active filter summary */}
        <div className="home-results-header">
          {!loading && !error && (
            <p className="home-results-count">
              {properties.length === 0
                ? 'No properties found'
                : `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'} found`}
              {listingType === 'SALE' ? ' for sale' : ' for rent'}
              {propType ? ` · ${PROP_TYPES.find(t => t.value === propType)?.label}` : ''}
            </p>
          )}
          {hasActiveFilters && !loading && (
            <button className="home-clear-btn" onClick={clearFilters}>
              <RotateCcw size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {error ? (
          <div className="home-error">
            <p>{error}</p>
            <button onClick={() => fetchProperties({ listing_type: listingType, ordering: '-id' })}>
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="home-grid">
            {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="home-empty">
            <div className="home-empty-icon">🏠</div>
            <h3>No properties found</h3>
            <p>Try adjusting your filters or search term.</p>
            {hasActiveFilters && (
              <button className="home-empty-clear" onClick={clearFilters}>Clear filters</button>
            )}
          </div>
        ) : (
          <div className="home-grid">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} onFavoriteToggle={handleFavoriteToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
