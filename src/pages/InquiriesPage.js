import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, MapPin, Calendar, Loader2, ChevronRight } from 'lucide-react';
import { getInquiries } from '../services/api';
import { formatPrice, getImageUrl, INQUIRY_STATUS } from '../utils/format';
import Navbar from '../components/Navbar';
import './InquiriesPage.css';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getInquiries()
      .then((res) => setInquiries(res.data.results || res.data || []))
      .catch(() => setError('Could not load inquiries.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="inq-page">
      <Navbar />

      <div className="inq-header">
        <div className="container">
          <div className="inq-header-inner">
            <MessageSquare size={22} />
            <div>
              <h1 className="inq-title">My Inquiries</h1>
              <p className="inq-sub">
                {!loading && `${inquiries.length} inquir${inquiries.length === 1 ? 'y' : 'ies'}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container inq-body">
        {error ? (
          <div className="inq-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        ) : loading ? (
          <div className="inq-list">
            {Array.from({ length: 3 }).map((_, i) => <InquirySkeleton key={i} />)}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="inq-empty">
            <div className="inq-empty-icon">💬</div>
            <h3>No inquiries yet</h3>
            <p>When you inquire about a property, it will show up here. Our team will contact you once they review it.</p>
            <Link to="/home" className="inq-cta">Browse Properties</Link>
          </div>
        ) : (
          <div className="inq-list">
            {inquiries.map((inq) => <InquiryCard key={inq.id} inquiry={inq} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function InquiryCard({ inquiry }) {
  // property_details comes from InquirySerializer (read-only nested)
  const details = inquiry.property_details || {};
  const propId = typeof inquiry.property === 'object' ? inquiry.property?.id : inquiry.property;
  const title   = details.title   || inquiry.property_details || 'Property';
  const price   = details.price   || 0;
  const city    = details.city    || details.address || '';
  const imgPath = details.images?.[0]?.image || null;

  const statusInfo = INQUIRY_STATUS[inquiry.status] || { label: inquiry.status, color: 'var(--color-muted)' };
  const date = new Date(inquiry.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Link to={`/property/${propId}`} className="inq-card">
      {/* Image */}
      <div className="inq-card-img-wrap">
        {imgPath
          ? <img src={getImageUrl(imgPath)} alt={title} className="inq-card-img" />
          : <div className="inq-card-img-placeholder"><MessageSquare size={24} /></div>
        }
      </div>

      {/* Content */}
      <div className="inq-card-body">
        <div className="inq-card-top">
          <h3 className="inq-card-title">{title}</h3>
          <span className="inq-status-badge" style={{ background: statusInfo.color }}>
            {statusInfo.label}
          </span>
        </div>

        {price > 0 && (
          <div className="inq-card-price">{formatPrice(price)}</div>
        )}

        {city ? (
          <div className="inq-card-meta">
            <MapPin size={12} /> {city}
          </div>
        ) : null}

        <div className="inq-card-meta">
          <Calendar size={12} /> Submitted {date}
        </div>

        {inquiry.admin_remarks && (
          <div className="inq-card-remarks">
            <span className="inq-remarks-label">Agent note:</span>
            <span className="inq-remarks-text">{inquiry.admin_remarks}</span>
          </div>
        )}
      </div>

      <ChevronRight size={16} className="inq-card-chevron" />
    </Link>
  );
}

function InquirySkeleton() {
  return (
    <div className="inq-card inq-card-skeleton">
      <div className="inq-card-img-wrap skel-img" />
      <div className="inq-card-body">
        <div className="skel-line" style={{ width: '60%', height: 16, marginBottom: 10 }} />
        <div className="skel-line" style={{ width: '40%', height: 13, marginBottom: 8 }} />
        <div className="skel-line" style={{ width: '30%', height: 12 }} />
      </div>
    </div>
  );
}
