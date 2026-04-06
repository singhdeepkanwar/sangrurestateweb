import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Upload, X, Check, Loader2,
  Home, FileText, Tag, MapPin, Image as ImageIcon } from 'lucide-react';
import { createProperty, updateProperty, getAmenities, getProperty } from '../services/api';
import { getImageUrl } from '../utils/format';
import Navbar from '../components/Navbar';
import './ListPropertyPage.css';

// ── Constants ─────────────────────────────────────────────────
const PROPERTY_TYPES = ['House', 'Apartment', 'Plot', 'Land', 'Commercial', 'PG'];
const SELL_PRICE_UNITS = ['Lakh', 'Crore'];
const RENT_PRICE_UNITS = ['Thousand', 'Lakh'];
const AREA_UNITS = ['Gaj', 'Sq. Feet', 'Sq. Yard', 'Marla', 'Kanal', 'Acre', 'Sq. Meter'];

const UNIT_MAP = {
  'Gaj': 'SQYD', 'Sq. Yard': 'SQYD', 'Sq. Feet': 'SQFT',
  'Marla': 'MARLA', 'Kanal': 'KANAL', 'Acre': 'ACRE', 'Sq. Meter': 'SQMTR',
};
const REV_UNIT_MAP = { SQYD: 'Gaj', SQFT: 'Sq. Feet', SQMTR: 'Sq. Meter', ACRE: 'Acre', MARLA: 'Marla', KANAL: 'Kanal' };

const rawPrice = (value, unit) => {
  const n = parseFloat(value);
  if (isNaN(n)) return 0;
  if (unit === 'Thousand') return n * 1_000;
  if (unit === 'Lakh')     return n * 1_00_000;
  if (unit === 'Crore')    return n * 1_00_00_000;
  return n;
};

const displayPrice = (raw, listingType) => {
  if (!raw || isNaN(raw)) return { value: '', unit: listingType === 'RENT' ? 'Thousand' : 'Lakh' };
  const n = parseFloat(raw);
  if (n >= 1_00_00_000) return { value: String(n / 1_00_00_000), unit: 'Crore' };
  if (n >= 1_00_000)    return { value: String(n / 1_00_000), unit: 'Lakh' };
  if (n >= 1_000)       return { value: String(n / 1_000), unit: 'Thousand' };
  return { value: String(n), unit: listingType === 'RENT' ? 'Thousand' : 'Lakh' };
};

const STEPS = [
  { label: 'Basics',    icon: FileText },
  { label: 'Details',   icon: Tag },
  { label: 'Amenities', icon: Home },
  { label: 'Photos',    icon: ImageIcon },
];

export default function ListPropertyPage() {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEdit = !!editId;

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEdit);
  const [errors, setErrors] = useState({});

  // Step 1 — Basics
  const [listingType, setListingType] = useState('SALE');
  const [propertyType, setPropertyType] = useState('House');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Step 2 — Details
  const [priceVal, setPriceVal] = useState('');
  const [priceUnit, setPriceUnit] = useState('Lakh');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('Gaj');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [city, setCity] = useState('Sangrur');
  const [address, setAddress] = useState('');

  // Step 3 — Amenities  (object map {[id]: true} for O(1) toggle/lookup)
  const [allAmenities, setAllAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState({});

  // Step 4 — Images
  const [images, setImages] = useState([]);      // { id?, url, file?, isNew }
  const [deletedIds, setDeletedIds] = useState([]);
  const fileInputRef = useRef();

  // ── Load amenities ──
  useEffect(() => {
    getAmenities().then((r) => setAllAmenities(r.data || [])).catch(() => {});
  }, []);

  // ── Edit mode: pre-fill ──
  useEffect(() => {
    if (!isEdit) return;
    getProperty(editId)
      .then(({ data }) => {
        const p = data;
        setListingType(p.listing_type || 'SALE');
        setPropertyType(
          p.property_type
            ? p.property_type.charAt(0) + p.property_type.slice(1).toLowerCase()
            : 'House'
        );
        setTitle(p.title || '');
        setDescription(p.description || '');

        const dp = displayPrice(p.price, p.listing_type);
        setPriceVal(dp.value);
        setPriceUnit(dp.unit);

        setArea(p.area ? String(p.area) : '');
        setAreaUnit(REV_UNIT_MAP[p.unit] || 'Gaj');
        setBedrooms(p.bedrooms ? String(p.bedrooms) : '');
        setBathrooms(p.bathrooms ? String(p.bathrooms) : '');
        setCity(p.city || 'Sangrur');
        setAddress(p.address || '');
        const amenityMap = {};
        (p.amenities || []).forEach((a) => { amenityMap[typeof a === 'object' ? a.id : a] = true; });
        setSelectedAmenities(amenityMap);

        const imgs = (p.images || []).map((img) => ({
          id: img.id,
          url: getImageUrl(img.image),
          isNew: false,
        }));
        setImages(imgs);
      })
      .catch(() => navigate('/my-properties'))
      .finally(() => setLoadingEdit(false));
  }, [editId]);

  // Keep price unit in sync with listing type changes (create mode only)
  useEffect(() => {
    if (!isEdit) setPriceUnit(listingType === 'RENT' ? 'Thousand' : 'Lakh');
  }, [listingType]);

  // ── Validation ──
  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!title.trim()) e.title = 'Title is required.';
      if (!description.trim()) e.description = 'Description is required.';
    }
    if (s === 1) {
      if (!priceVal || isNaN(parseFloat(priceVal))) e.price = 'Enter a valid price.';
      if (!area || isNaN(parseFloat(area))) e.area = 'Enter a valid area.';
      if (!city.trim()) e.city = 'City is required.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((s) => s + 1); };
  const back = () => { setErrors({}); setStep((s) => s - 1); };

  // ── Image handling ──
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 12) {
      alert('Maximum 12 images allowed.');
      return;
    }
    const newImgs = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      isNew: true,
    }));
    setImages((prev) => [...prev, ...newImgs]);
    e.target.value = '';
  };

  const removeImage = (idx) => {
    const img = images[idx];
    if (!img.isNew && img.id) setDeletedIds((d) => [...d, img.id]);
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!validate(step)) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('listing_type', listingType);
      fd.append('property_type', propertyType.toUpperCase());
      fd.append('price', rawPrice(priceVal, priceUnit));
      fd.append('area', area);
      fd.append('unit', UNIT_MAP[areaUnit] || 'SQFT');
      fd.append('city', city);
      fd.append('address', address);

      if (['House', 'Apartment'].includes(propertyType)) {
        if (bedrooms) fd.append('bedrooms', bedrooms);
        if (bathrooms) fd.append('bathrooms', bathrooms);
      }

      Object.keys(selectedAmenities).forEach((id) => fd.append('amenities', id));

      // Images
      for (const img of images.filter((i) => i.isNew)) {
        const blob = img.file instanceof File
          ? img.file
          : await fetch(img.url).then((r) => r.blob());
        fd.append('uploaded_images', blob, `photo_${Date.now()}.jpg`);
      }

      if (isEdit && deletedIds.length > 0) {
        fd.append('delete_images', deletedIds.join(','));
      }

      if (isEdit) {
        await updateProperty(editId, fd);
      } else {
        await createProperty(fd);
      }

      navigate('/my-properties');
    } catch (e) {
      setErrors({ submit: e.response?.data ? JSON.stringify(e.response.data) : 'Submission failed. Please try again.' });
      setSubmitting(false);
    }
  };

  if (loadingEdit) return (
    <div className="lp-page"><Navbar /><div className="lp-loading"><Loader2 className="spin" size={28} /></div></div>
  );

  const priceUnits = listingType === 'RENT' ? RENT_PRICE_UNITS : SELL_PRICE_UNITS;
  const needsRooms = ['House', 'Apartment'].includes(propertyType);

  return (
    <div className="lp-page">
      <Navbar />

      <div className="lp-wrap container">
        {/* ── Page header ── */}
        <div className="lp-page-header">
          <h1 className="lp-page-title">{isEdit ? 'Edit Listing' : 'List Your Property'}</h1>
          <p className="lp-page-sub">
            {isEdit ? 'Update your property details below.' : 'Fill in the details to post your property on Sangrur Estate.'}
          </p>
        </div>

        {/* ── Step indicator ── */}
        <div className="lp-stepper">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <React.Fragment key={i}>
                <div className={`lp-step ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
                  <div className="lp-step-circle">
                    {done ? <Check size={14} /> : <Icon size={14} />}
                  </div>
                  <span className="lp-step-label">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`lp-step-line ${done ? 'done' : ''}`} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Form card ── */}
        <div className="lp-card">
          {errors.submit && <div className="lp-error-banner">{errors.submit}</div>}

          {/* Step 0 — Basics */}
          {step === 0 && (
            <div className="lp-step-body">
              <h2 className="lp-step-title">Basic Information</h2>

              {/* Listing type */}
              <div className="lp-field">
                <label className="lp-label">Listing Type</label>
                <div className="lp-toggle-group">
                  {['SALE', 'RENT'].map((t) => (
                    <button key={t} className={`lp-toggle-btn ${listingType === t ? 'active' : ''}`}
                      onClick={() => setListingType(t)}>
                      {t === 'SALE' ? '🏷️ For Sale' : '🔑 For Rent'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property type */}
              <div className="lp-field">
                <label className="lp-label">Property Type</label>
                <div className="lp-chip-group">
                  {PROPERTY_TYPES.map((t) => (
                    <button key={t} className={`lp-chip ${propertyType === t ? 'active' : ''}`}
                      onClick={() => setPropertyType(t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="lp-field">
                <label className="lp-label">Property Title <span className="req">*</span></label>
                <input className={`lp-input ${errors.title ? 'error' : ''}`}
                  placeholder="e.g. 3BHK House in Sangrur City"
                  value={title} onChange={(e) => setTitle(e.target.value)} />
                {errors.title && <span className="lp-field-error">{errors.title}</span>}
              </div>

              {/* Description */}
              <div className="lp-field">
                <label className="lp-label">Description <span className="req">*</span></label>
                <textarea className={`lp-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Describe the property — location highlights, features, nearby landmarks…"
                  rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                {errors.description && <span className="lp-field-error">{errors.description}</span>}
              </div>
            </div>
          )}

          {/* Step 1 — Details */}
          {step === 1 && (
            <div className="lp-step-body">
              <h2 className="lp-step-title">Property Details</h2>

              {/* Price */}
              <div className="lp-field">
                <label className="lp-label">
                  Price {listingType === 'RENT' ? '(per month)' : ''} <span className="req">*</span>
                </label>
                <div className="lp-input-with-unit">
                  <input className={`lp-input ${errors.price ? 'error' : ''}`}
                    type="number" min="0" placeholder="e.g. 45"
                    value={priceVal} onChange={(e) => setPriceVal(e.target.value)} />
                  <select className="lp-unit-select" value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}>
                    {priceUnits.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
                {priceVal && !isNaN(parseFloat(priceVal)) && (
                  <span className="lp-price-hint">
                    ₹{rawPrice(priceVal, priceUnit).toLocaleString('en-IN')}
                    {listingType === 'RENT' ? ' / month' : ''}
                  </span>
                )}
                {errors.price && <span className="lp-field-error">{errors.price}</span>}
              </div>

              {/* Area */}
              <div className="lp-field">
                <label className="lp-label">Area <span className="req">*</span></label>
                <div className="lp-input-with-unit">
                  <input className={`lp-input ${errors.area ? 'error' : ''}`}
                    type="number" min="0" placeholder="e.g. 200"
                    value={area} onChange={(e) => setArea(e.target.value)} />
                  <select className="lp-unit-select" value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value)}>
                    {AREA_UNITS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
                {errors.area && <span className="lp-field-error">{errors.area}</span>}
              </div>

              {/* Bedrooms / Bathrooms */}
              {needsRooms && (
                <div className="lp-row">
                  <div className="lp-field">
                    <label className="lp-label">Bedrooms</label>
                    <input className="lp-input" type="number" min="0" placeholder="e.g. 3"
                      value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
                  </div>
                  <div className="lp-field">
                    <label className="lp-label">Bathrooms</label>
                    <input className="lp-input" type="number" min="0" placeholder="e.g. 2"
                      value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="lp-row">
                <div className="lp-field">
                  <label className="lp-label">City / Town <span className="req">*</span></label>
                  <input className={`lp-input ${errors.city ? 'error' : ''}`}
                    placeholder="Sangrur" value={city}
                    onChange={(e) => setCity(e.target.value)} />
                  {errors.city && <span className="lp-field-error">{errors.city}</span>}
                </div>
                <div className="lp-field">
                  <label className="lp-label">Street / Area</label>
                  <input className="lp-input" placeholder="e.g. Bhuvnesh Nagar"
                    value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Amenities */}
          {step === 2 && (
            <div className="lp-step-body">
              <h2 className="lp-step-title">Amenities</h2>
              <p className="lp-step-sub">Select all that apply to your property.</p>
              {allAmenities.length === 0 ? (
                <div className="lp-amenities-loading"><Loader2 className="spin" size={20} /> Loading…</div>
              ) : (
                <div className="lp-amenities-grid">
                  {allAmenities.map((a) => {
                    const sel = !!selectedAmenities[a.id];
                    return (
                      <button key={a.id}
                        className={`lp-amenity-btn ${sel ? 'active' : ''}`}
                        onClick={() => setSelectedAmenities((prev) => {
                          const next = { ...prev };
                          if (sel) delete next[a.id]; else next[a.id] = true;
                          return next;
                        })}>
                        {sel && <Check size={12} />} {a.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Photos */}
          {step === 3 && (
            <div className="lp-step-body">
              <h2 className="lp-step-title">Photos</h2>
              <p className="lp-step-sub">Add up to 12 photos. First image will be the main photo.</p>

              <div className="lp-images-grid">
                {images.map((img, i) => (
                  <div key={i} className="lp-img-thumb">
                    <img src={img.url} alt="" />
                    {i === 0 && <span className="lp-img-main-badge">Main</span>}
                    <button className="lp-img-remove" onClick={() => removeImage(i)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {images.length < 12 && (
                  <button className="lp-img-add" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={20} />
                    <span>Add Photo</span>
                  </button>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" multiple hidden
                onChange={handleFileChange} />

              {images.length === 0 && (
                <p className="lp-images-hint">
                  Properties with photos get significantly more views. Adding at least 3 photos is recommended.
                </p>
              )}
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="lp-nav-row">
            {step > 0 && (
              <button className="lp-btn-back" onClick={back} disabled={submitting}>
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < STEPS.length - 1 ? (
              <button className="lp-btn-next" onClick={next}>
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button className="lp-btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting
                  ? <><Loader2 className="spin" size={16} /> {isEdit ? 'Saving…' : 'Posting…'}</>
                  : <><Check size={16} /> {isEdit ? 'Save Changes' : 'Post Property'}</>
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
