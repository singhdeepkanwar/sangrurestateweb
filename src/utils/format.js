import { MEDIA_BASE_URL } from '../services/api';

/**
 * Format a price in Indian units.
 * ₹1,00,000+ → "₹1 Lakh"
 * ₹1,00,00,000+ → "₹1 Crore"
 */
export function formatPrice(price) {
  if (price == null) return '—';
  const n = Number(price);
  if (n >= 1_00_00_000) {
    const crore = n / 1_00_00_000;
    return `₹${crore % 1 === 0 ? crore : crore.toFixed(2)} Crore`;
  }
  if (n >= 1_00_000) {
    const lakh = n / 1_00_000;
    return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
  }
  return `₹${n.toLocaleString('en-IN')}`;
}

/**
 * Prepend the media base URL to a relative image path from the API.
 * Handles already-absolute URLs gracefully.
 */
export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${MEDIA_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Human-readable area unit labels.
 */
export const UNIT_LABELS = {
  SQFT:  'Sq.Ft',
  SQYD:  'Sq.Yd',
  SQMTR: 'Sq.Mtr',
  ACRE:  'Acre',
  MARLA: 'Marla',
  KANAL: 'Kanal',
};

/**
 * Human-readable property type labels.
 */
export const PROPERTY_TYPE_LABELS = {
  LAND:       'Land',
  PLOT:       'Plot',
  PG:         'PG / Hostel',
  APARTMENT:  'Apartment',
  HOUSE:      'House',
  COMMERCIAL: 'Commercial',
};

/**
 * Human-readable listing type labels.
 */
export const LISTING_TYPE_LABELS = {
  SALE: 'For Sale',
  RENT: 'For Rent',
};

/**
 * Human-readable inquiry status labels + colour token.
 */
export const INQUIRY_STATUS = {
  NEW:         { label: 'New',        color: 'var(--color-accent)' },
  CONTACTED:   { label: 'Contacted',  color: 'var(--color-warning)' },
  VIEWING:     { label: 'Viewing',    color: '#9333EA' },
  CLOSED_WON:  { label: 'Won',        color: 'var(--color-success)' },
  CLOSED_LOST: { label: 'Closed',     color: 'var(--color-muted)' },
};

/**
 * Human-readable property status labels + colour token.
 */
export const PROPERTY_STATUS = {
  PENDING:  { label: 'Pending Review', color: 'var(--color-warning)' },
  VERIFIED: { label: 'Live',           color: 'var(--color-success)' },
  UNDERINQ: { label: 'Under Inquiry',  color: 'var(--color-accent)' },
  SOLD:     { label: 'Sold',           color: 'var(--color-muted)' },
  REJECTED: { label: 'Rejected',       color: 'var(--color-error)' },
};
