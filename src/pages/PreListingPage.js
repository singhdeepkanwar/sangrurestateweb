import React, { useState } from 'react';
import { Check, Loader2, ChevronRight, Home, Tag, User, Phone, MapPin, FileText } from 'lucide-react';
import { submitPreListing } from '../services/api';
import './PreListingPage.css';

const PROPERTY_TYPES = [
  { label: 'House', value: 'HOUSE', icon: '🏠' },
  { label: 'Plot', value: 'PLOT', icon: '📐' },
  { label: 'Apartment', value: 'APARTMENT', icon: '🏢' },
  { label: 'Commercial', value: 'COMMERCIAL', icon: '🏪' },
  { label: 'Land', value: 'LAND', icon: '🌾' },
  { label: 'PG / Hostel', value: 'PG', icon: '🛏' },
];

const AREA_UNITS = ['Gaj', 'Sq. Feet', 'Sq. Yard', 'Marla', 'Kanal', 'Acre', 'Sq. Meter'];

const UNIT_MAP = {
  'Gaj': 'SQYD', 'Sq. Yard': 'SQYD', 'Sq. Feet': 'SQFT',
  'Marla': 'MARLA', 'Kanal': 'KANAL', 'Acre': 'ACRE', 'Sq. Meter': 'SQMTR',
};

const SELL_PRICE_UNITS = ['Lakh', 'Crore'];
const RENT_PRICE_UNITS = ['Thousand', 'Lakh'];

const rawPrice = (value, unit) => {
  const n = parseFloat(value);
  if (isNaN(n)) return null;
  if (unit === 'Thousand') return n * 1_000;
  if (unit === 'Lakh')     return n * 1_00_000;
  if (unit === 'Crore')    return n * 1_00_00_000;
  return n;
};

export default function PreListingPage() {
  // Owner fields
  const [fullName, setFullName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [city, setCity]           = useState('');

  // Property fields
  const [listingType, setListingType] = useState('SALE');
  const [propType, setPropType]       = useState('');
  const [priceVal, setPriceVal]       = useState('');
  const [priceUnit, setPriceUnit]     = useState('Lakh');
  const [area, setArea]               = useState('');
  const [areaUnit, setAreaUnit]       = useState('Gaj');
  const [address, setAddress]         = useState('');
  const [notes, setNotes]             = useState('');

  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const priceUnits = listingType === 'RENT' ? RENT_PRICE_UNITS : SELL_PRICE_UNITS;

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = 'Name is required.';
    if (!phone.trim() || !/^\d{10}$/.test(phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid 10-digit phone number.';
    if (!city.trim()) e.city = 'City is required.';
    if (!propType) e.propType = 'Select a property type.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitPreListing({
        full_name:     fullName.trim(),
        phone:         phone.replace(/\s/g, ''),
        city:          city.trim(),
        listing_type:  listingType,
        property_type: propType,
        price:         rawPrice(priceVal, priceUnit),
        area:          area ? parseFloat(area) : null,
        unit:          UNIT_MAP[areaUnit] || 'SQYD',
        address:       address.trim(),
        notes:         notes.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pl-page">
        <div className="pl-success-wrap">
          <div className="pl-success-icon"><Check size={36} /></div>
          <h2 className="pl-success-title">You're on the list!</h2>
          <p className="pl-success-sub">
            Thank you, <strong>{fullName.split(' ')[0]}</strong>. We've saved your property details
            and will reach out on <strong>{phone}</strong> as soon as Sangrur Estate goes live.
          </p>
          <a href="/" className="pl-success-back">Back to home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-page">
      {/* ── Header ── */}
      <div className="pl-hero">
        <div className="pl-hero-inner container">
          <div className="pl-hero-badge">Pre-Launch</div>
          <h1 className="pl-hero-title">List Your Property on Sangrur Estate</h1>
          <p className="pl-hero-sub">
            Register now — be among the first to go live when we launch. Free listing, zero brokerage.
          </p>
          <div className="pl-hero-perks">
            <span>✓ Free for early listings</span>
            <span>✓ Priority placement at launch</span>
            <span>✓ We'll contact you directly</span>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="container pl-body">
        <form className="pl-form" onSubmit={handleSubmit} noValidate>

          {/* ── Section: Your Details ── */}
          <div className="pl-section">
            <div className="pl-section-header">
              <User size={16} /> Your Details
            </div>

            <div className="pl-row">
              <div className="pl-field">
                <label className="pl-label">Full Name <span className="pl-req">*</span></label>
                <input
                  className={`pl-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="e.g. Gurpreet Singh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && <span className="pl-field-error">{errors.fullName}</span>}
              </div>

              <div className="pl-field">
                <label className="pl-label"><Phone size={12} /> Phone <span className="pl-req">*</span></label>
                <input
                  className={`pl-input ${errors.phone ? 'error' : ''}`}
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <span className="pl-field-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="pl-field">
              <label className="pl-label"><MapPin size={12} /> Your City <span className="pl-req">*</span></label>
              <input
                className={`pl-input ${errors.city ? 'error' : ''}`}
                placeholder="e.g. Sangrur, Sunam, Dhuri…"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {errors.city && <span className="pl-field-error">{errors.city}</span>}
            </div>
          </div>

          {/* ── Section: Property Details ── */}
          <div className="pl-section">
            <div className="pl-section-header">
              <Home size={16} /> Property Details
            </div>

            {/* Listing type */}
            <div className="pl-field">
              <label className="pl-label"><Tag size={12} /> Listing Type</label>
              <div className="pl-toggle-group">
                {['SALE', 'RENT'].map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`pl-toggle-btn ${listingType === t ? 'active' : ''}`}
                    onClick={() => {
                      setListingType(t);
                      setPriceUnit(t === 'RENT' ? 'Thousand' : 'Lakh');
                    }}
                  >
                    {t === 'SALE' ? '🏷️ For Sale' : '🔑 For Rent'}
                  </button>
                ))}
              </div>
            </div>

            {/* Property type chips */}
            <div className="pl-field">
              <label className="pl-label">Property Type <span className="pl-req">*</span></label>
              <div className="pl-chip-group">
                {PROPERTY_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    className={`pl-chip ${propType === t.value ? 'active' : ''}`}
                    onClick={() => setPropType(t.value)}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
              {errors.propType && <span className="pl-field-error">{errors.propType}</span>}
            </div>

            {/* Price + Area */}
            <div className="pl-row">
              <div className="pl-field">
                <label className="pl-label">
                  Approximate Price {listingType === 'RENT' ? '(per month)' : ''}
                </label>
                <div className="pl-input-unit">
                  <input
                    className="pl-input"
                    type="number"
                    min="0"
                    placeholder="e.g. 45"
                    value={priceVal}
                    onChange={(e) => setPriceVal(e.target.value)}
                  />
                  <select
                    className="pl-unit-select"
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                  >
                    {priceUnits.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
                {priceVal && !isNaN(parseFloat(priceVal)) && (
                  <span className="pl-hint">
                    ₹{(rawPrice(priceVal, priceUnit) || 0).toLocaleString('en-IN')}
                    {listingType === 'RENT' ? ' / month' : ''}
                  </span>
                )}
              </div>

              <div className="pl-field">
                <label className="pl-label">Area</label>
                <div className="pl-input-unit">
                  <input
                    className="pl-input"
                    type="number"
                    min="0"
                    placeholder="e.g. 200"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                  <select
                    className="pl-unit-select"
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value)}
                  >
                    {AREA_UNITS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pl-field">
              <label className="pl-label">Property Location / Address</label>
              <input
                className="pl-input"
                placeholder="e.g. Bhuvnesh Nagar, Sangrur"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="pl-field">
              <label className="pl-label"><FileText size={12} /> Additional Notes</label>
              <textarea
                className="pl-textarea"
                rows={3}
                placeholder="Anything else you'd like us to know about the property…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {errors.submit && <div className="pl-error-banner">{errors.submit}</div>}

          <button type="submit" className="pl-submit-btn" disabled={submitting}>
            {submitting
              ? <><Loader2 className="spin" size={18} /> Submitting…</>
              : <>Register My Property <ChevronRight size={18} /></>
            }
          </button>

          <p className="pl-privacy-note">
            We only use your details to contact you about your listing. No spam, ever.
          </p>
        </form>
      </div>
    </div>
  );
}
