import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MapPin, Maximize2, Bed, Bath,
  ShieldCheck, MessageSquare, ChevronLeft, ChevronRight, X, Loader2, Flag } from 'lucide-react';
import { getProperty, toggleFavorite, inquireProperty, getInquiries } from '../services/api';
import { formatPrice, getImageUrl, PROPERTY_TYPE_LABELS, UNIT_LABELS, LISTING_TYPE_LABELS } from '../utils/format';
import Navbar from '../components/Navbar';
import './PropertyDetailsPage.css';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isSaved, setIsSaved] = useState(false);
  const [savingFav, setSavingFav] = useState(false);

  const [inquired, setInquired] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Gallery
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [propRes, inquiriesRes] = await Promise.all([
          getProperty(id),
          getInquiries(),
        ]);
        const data = propRes.data;
        setProperty(data);
        setIsSaved(!!data.is_favorite);

        const alreadyInquired = (inquiriesRes.data?.results || inquiriesRes.data || [])
          .some((inq) => (inq.property?.id || inq.property) === id || (inq.property?.id || inq.property) == id);
        setInquired(alreadyInquired);
      } catch {
        setError('Could not load property. It may have been removed.');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const handleFavorite = async () => {
    if (savingFav) return;
    setSavingFav(true);
    try {
      const res = await toggleFavorite(id);
      setIsSaved(res.data.status === 'favorited');
    } catch { /* ignore */ }
    finally { setSavingFav(false); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: property?.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link copied!'));
    }
  };

  const handleInquire = async () => {
    if (inquired || inquiryLoading) return;
    setInquiryLoading(true);
    try {
      await inquireProperty(id);
      setInquired(true);
      setInquirySuccess(true);
      setTimeout(() => setInquirySuccess(false), 4000);
    } catch { /* ignore */ }
    finally { setInquiryLoading(false); }
  };

  // Gallery navigation
  const images = property?.images || [];
  const prevImg = (e) => { e?.stopPropagation(); setActiveIdx((i) => (i - 1 + images.length) % images.length); };
  const nextImg = (e) => { e?.stopPropagation(); setActiveIdx((i) => (i + 1) % images.length); };

  const openLightbox = (idx) => { setLightboxIdx(idx); setLightboxOpen(true); };
  const prevLight = () => setLightboxIdx((i) => (i - 1 + images.length) % images.length);
  const nextLight = () => setLightboxIdx((i) => (i + 1) % images.length);

  // Keyboard nav in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prevLight();
      if (e.key === 'ArrowRight') nextLight();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, images.length]);

  if (loading) return (
    <div className="pdp-page">
      <Navbar />
      <div className="pdp-loading"><Loader2 className="spin" size={28} /></div>
    </div>
  );

  if (error || !property) return (
    <div className="pdp-page">
      <Navbar />
      <div className="pdp-error">
        <p>{error || 'Property not found.'}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );

  const typeLabel = PROPERTY_TYPE_LABELS[property.property_type] || property.property_type;
  const unitLabel = UNIT_LABELS[property.unit] || property.unit;
  const listingLabel = LISTING_TYPE_LABELS[property.listing_type] || property.listing_type;
  const isRent = property.listing_type === 'RENT';
  const hasRooms = property.property_type === 'HOUSE' || property.property_type === 'APARTMENT';

  return (
    <div className="pdp-page">
      <Navbar />

      <div className="pdp-wrap">
        {/* ── Back + actions bar ── */}
        <div className="pdp-topbar">
          <button className="pdp-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="pdp-topbar-actions">
            <button className="pdp-action-btn" onClick={handleShare} title="Share">
              <Share2 size={16} />
            </button>
            <button
              className={`pdp-action-btn ${isSaved ? 'saved' : ''} ${savingFav ? 'saving' : ''}`}
              onClick={handleFavorite}
              title={isSaved ? 'Remove from saved' : 'Save property'}
            >
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <div className="pdp-content">
          {/* ── Left: gallery + details ── */}
          <div className="pdp-main">
            {/* Gallery */}
            <div className="pdp-gallery">
              {images.length > 0 ? (
                <>
                  <div className="pdp-gallery-main" onClick={() => openLightbox(activeIdx)}>
                    <img
                      src={getImageUrl(images[activeIdx]?.image)}
                      alt={property.title}
                      className="pdp-main-img"
                    />
                    <div className="pdp-gallery-overlay">
                      <span className="pdp-img-count">{activeIdx + 1} / {images.length}</span>
                    </div>
                    {images.length > 1 && (
                      <>
                        <button className="pdp-gallery-nav prev" onClick={prevImg}><ChevronLeft size={20} /></button>
                        <button className="pdp-gallery-nav next" onClick={nextImg}><ChevronRight size={20} /></button>
                      </>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="pdp-thumbnails">
                      {images.map((img, i) => (
                        <button
                          key={img.id}
                          className={`pdp-thumb ${i === activeIdx ? 'active' : ''}`}
                          onClick={() => setActiveIdx(i)}
                        >
                          <img src={getImageUrl(img.image)} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="pdp-no-image"><Maximize2 size={40} /><span>No images available</span></div>
              )}
            </div>

            {/* Title + badges */}
            <div className="pdp-header">
              <div className="pdp-badges">
                <span className="pdp-badge pdp-badge-type">{typeLabel}</span>
                <span className={`pdp-badge pdp-badge-listing ${isRent ? 'rent' : 'sale'}`}>{listingLabel}</span>
                <span className="pdp-badge pdp-badge-verified"><ShieldCheck size={11} /> Verified</span>
              </div>
              <h1 className="pdp-title">{property.title}</h1>
              <div className="pdp-location">
                <MapPin size={14} />
                <span>{property.city}{property.address ? `, ${property.address}` : ''}</span>
              </div>
            </div>

            {/* Spec blocks */}
            <div className="pdp-specs">
              <div className="pdp-spec">
                <span className="pdp-spec-icon">💰</span>
                <span className="pdp-spec-value">{formatPrice(property.price)}</span>
                <span className="pdp-spec-label">{isRent ? 'Per Month' : 'Guide Price'}</span>
              </div>
              <div className="pdp-spec">
                <span className="pdp-spec-icon">📐</span>
                <span className="pdp-spec-value">{property.area}</span>
                <span className="pdp-spec-label">{unitLabel}</span>
              </div>
              {hasRooms && property.bedrooms != null && (
                <div className="pdp-spec">
                  <span className="pdp-spec-icon">🛏</span>
                  <span className="pdp-spec-value">{property.bedrooms}</span>
                  <span className="pdp-spec-label">Bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
                </div>
              )}
              {hasRooms && property.bathrooms != null && (
                <div className="pdp-spec">
                  <span className="pdp-spec-icon">🚿</span>
                  <span className="pdp-spec-value">{property.bathrooms}</span>
                  <span className="pdp-spec-label">Bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="pdp-section">
                <h2 className="pdp-section-title">About this property</h2>
                <p className="pdp-description">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="pdp-section">
                <h2 className="pdp-section-title">Amenities</h2>
                <div className="pdp-amenities">
                  {property.amenities.map((a) => (
                    <span key={a.id} className="pdp-amenity">{a.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="pdp-section">
              <h2 className="pdp-section-title">Location</h2>
              <div className="pdp-location-block">
                <MapPin size={15} />
                <span>{property.address && `${property.address}, `}{property.city}</span>
              </div>
            </div>
          </div>

          {/* ── Right: sticky inquiry card ── */}
          <aside className="pdp-sidebar">
            <div className="pdp-inquiry-card">
              <div className="pdp-inquiry-price">{formatPrice(property.price)}</div>
              {isRent && <div className="pdp-inquiry-per">per month</div>}

              <div className="pdp-inquiry-meta">
                <span><MapPin size={12} /> {property.city}</span>
                <span><Maximize2 size={12} /> {property.area} {unitLabel}</span>
              </div>

              {inquirySuccess && (
                <div className="pdp-inquiry-success">
                  ✅ Inquiry sent! Our team will contact you shortly.
                </div>
              )}

              <button
                className={`pdp-inquire-btn ${inquired ? 'done' : ''}`}
                onClick={handleInquire}
                disabled={inquired || inquiryLoading}
              >
                {inquiryLoading ? (
                  <><Loader2 className="spin" size={16} /> Sending…</>
                ) : inquired ? (
                  <>✅ Inquiry Sent</>
                ) : (
                  <><MessageSquare size={16} /> Send Inquiry</>
                )}
              </button>

              <p className="pdp-inquiry-note">
                Our team reviews inquiries and contacts you within 24 hours.
              </p>

              <div className="pdp-inquiry-divider" />

              <button className="pdp-share-btn" onClick={handleShare}>
                <Share2 size={14} /> Share this property
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && images.length > 0 && (
        <div className="pdp-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="pdp-lb-close" onClick={() => setLightboxOpen(false)}><X size={22} /></button>
          <button className="pdp-lb-nav prev" onClick={(e) => { e.stopPropagation(); prevLight(); }}>
            <ChevronLeft size={28} />
          </button>
          <img
            src={getImageUrl(images[lightboxIdx]?.image)}
            alt=""
            className="pdp-lb-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="pdp-lb-nav next" onClick={(e) => { e.stopPropagation(); nextLight(); }}>
            <ChevronRight size={28} />
          </button>
          <div className="pdp-lb-counter">{lightboxIdx + 1} / {images.length}</div>
        </div>
      )}

      {/* Mobile sticky CTA */}
      <div className="pdp-mobile-cta">
        <div className="pdp-mobile-price">{formatPrice(property.price)}{isRent ? '/mo' : ''}</div>
        <button
          className={`pdp-inquire-btn pdp-mobile-btn ${inquired ? 'done' : ''}`}
          onClick={handleInquire}
          disabled={inquired || inquiryLoading}
        >
          {inquiryLoading ? <Loader2 className="spin" size={16} /> : inquired ? '✅ Sent' : <><MessageSquare size={15} /> Inquire</>}
        </button>
      </div>
    </div>
  );
}
