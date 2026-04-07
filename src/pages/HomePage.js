import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, SlidersHorizontal, X, Home, Key, RotateCcw } from 'lucide-react';
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

const SALE_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'House', value: 'HOUSE', icon: '🏠' },
  { label: 'Plot', value: 'PLOT', icon: '📐' },
  { label: 'Commercial', value: 'COMMERCIAL', icon: '🏪' },
];

const RENT_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'House', value: 'HOUSE', icon: '🏠' },
  { label: 'PG', value: 'PG', icon: '🛏' },
  { label: 'Commercial', value: 'COMMERCIAL', icon: '🏪' },
];

// ── Fuzzy similarity scorer ───────────────────────────────────────────────────
// Scores a property against a search query by counting how many query tokens
// appear (case-insensitive substring) in any searchable field.
function fuzzyScore(property, query) {
  if (!query.trim()) return 1;
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    property.title, property.description, property.address, property.city,
  ].join(' ').toLowerCase();
  const matched = tokens.filter((t) => haystack.includes(t)).length;
  return matched / tokens.length; // 0–1
}

export default function HomePage() {
  const { user } = useAuth();

  // Filter state
  const [listingType, setListingType] = useState('SALE');
  const [search, setSearch] = useState('');
  const [propType, setPropType] = useState('');
  const [priceRange, setPriceRange] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const propTypes = listingType === 'RENT' ? RENT_TYPES : SALE_TYPES;

  const switchListingType = (type) => {
    setListingType(type);
    setPropType('');
  };

  // Data state
  const [rawProperties, setRawProperties] = useState([]);
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
      if (id !== requestRef.current) return;
      setRawProperties(res.data.results || res.data);
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

  // Client-side fuzzy filter + sort on top of backend results
  const properties = search.trim()
    ? rawProperties
        .map((p) => ({ ...p, _score: fuzzyScore(p, search) }))
        .filter((p) => p._score > 0)
        .sort((a, b) => b._score - a._score)
    : rawProperties;

  const handleFavoriteToggle = (id, isFav) => {
    setRawProperties((prev) => prev.map((p) => p.id === id ? { ...p, is_favorite: isFav } : p));
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

      {/* ── Buy / Rent tabs ── */}
      <div className="home-listing-tabs">
        <div className="container">
          <div className="hlt-row">
            <button
              className={`hlt-tab ${listingType === 'SALE' ? 'active' : ''}`}
              onClick={() => switchListingType('SALE')}
            >
              <Home size={16} /> Buy
            </button>
            <button
              className={`hlt-tab ${listingType === 'RENT' ? 'active' : ''}`}
              onClick={() => switchListingType('RENT')}
            >
              <Key size={16} /> Rent
            </button>
          </div>
        </div>
      </div>

      {/* ── Search & filter bar ── */}
      <div className="home-search-bar-wrap">
        <div className="container">
          <div className="home-search-row">
            {/* Search input */}
            <div className="home-search-input-wrap">
              <Search size={16} className="home-search-icon" />
              <input
                className="home-search-input"
                type="text"
                placeholder="Search by location, title, or keyword…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="home-search-clear" onClick={() => setSearch('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Price filter button */}
            <button
              className={`home-filter-btn ${filterOpen ? 'open' : ''} ${priceRange ? 'has-filters' : ''}`}
              onClick={() => setFilterOpen((o) => !o)}
            >
              <SlidersHorizontal size={15} />
              Price
              {priceRange && <span className="hfb-badge">1</span>}
            </button>
          </div>

          {/* Property type chips */}
          <div className="home-chip-row">
            {propTypes.map((t) => (
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

      {/* ── Price filter panel ── */}
      {filterOpen && (
        <div className="home-filter-panel">
          <div className="container">
            <div className="hfp-inner hfp-price-only">
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
                  <RotateCcw size={13} /> Clear
                </button>
                <button className="hfp-apply" onClick={() => setFilterOpen(false)}>
                  Apply
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
              {propType ? ` · ${propTypes.find(t => t.value === propType)?.label}` : ''}
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
