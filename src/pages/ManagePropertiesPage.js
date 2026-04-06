import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Edit3, Trash2, CheckCircle, XCircle, Loader2,
  Home, AlertCircle, Eye, RotateCcw,
} from 'lucide-react';
import { getMyProperties, deleteProperty, updatePropertyStatus } from '../services/api';
import { formatPrice, getImageUrl, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS, PROPERTY_STATUS } from '../utils/format';
import Navbar from '../components/Navbar';
import './ManagePropertiesPage.css';


export default function ManagePropertiesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProperties = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await getMyProperties();
      setProperties(res.data.results ?? res.data);
    } catch {
      setError('Failed to load your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleDelete = (id) => {
    setProperties((prev) => prev.map((p) =>
      p.id === id ? { ...p, _deleting: true, _confirmDelete: false } : p
    ));
  };

  const confirmDelete = async (id) => {
    setProperties((prev) => prev.map((p) => p.id === id ? { ...p, _deleting: true } : p));
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setProperties((prev) => prev.map((p) =>
        p.id === id ? { ...p, _deleting: false, _confirmDelete: false } : p
      ));
    }
  };

  const askDelete = (id) => {
    setProperties((prev) => prev.map((p) =>
      p.id === id ? { ...p, _confirmDelete: true } : { ...p, _confirmDelete: false }
    ));
  };

  const cancelDelete = (id) => {
    setProperties((prev) => prev.map((p) =>
      p.id === id ? { ...p, _confirmDelete: false } : p
    ));
  };

  const handleStatusChange = async (id, newStatus) => {
    setProperties((prev) => prev.map((p) =>
      p.id === id ? { ...p, _statusLoading: true } : p
    ));
    try {
      await updatePropertyStatus(id, newStatus);
      setProperties((prev) => prev.map((p) =>
        p.id === id ? { ...p, status: newStatus, _statusLoading: false } : p
      ));
    } catch {
      setProperties((prev) => prev.map((p) =>
        p.id === id ? { ...p, _statusLoading: false } : p
      ));
    }
  };

  return (
    <div className="mp-page">
      <Navbar />
      <div className="mp-wrap container">
        {/* Header */}
        <div className="mp-header">
          <div>
            <h1 className="mp-title">My Listings</h1>
            <p className="mp-sub">Manage and track all your property listings.</p>
          </div>
          <Link to="/list-property" className="mp-add-btn">
            <Plus size={16} /> Add New Listing
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="mp-grid">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="mp-error">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={fetchProperties} className="mp-retry-btn">Retry</button>
          </div>
        ) : properties.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mp-grid">
            {properties.map((p) => (
              <PropertyManageCard
                key={p.id}
                property={p}
                onEdit={() => navigate(`/list-property/${p.id}`)}
                onAskDelete={() => askDelete(p.id)}
                onCancelDelete={() => cancelDelete(p.id)}
                onConfirmDelete={() => confirmDelete(p.id)}
                onStatusChange={(s) => handleStatusChange(p.id, s)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Property card ─────────────────────────────────────────────────────────────

function PropertyManageCard({ property: p, onEdit, onAskDelete, onCancelDelete, onConfirmDelete, onStatusChange }) {
  const statusInfo = PROPERTY_STATUS[p.status] || { label: p.status, color: 'var(--color-muted)' };
  const isEditable = p.status !== 'PENDING';
  const isSold = p.status === 'SOLD';
  const imgSrc = getImageUrl(p.main_photo || p.images?.[0]?.image);

  return (
    <div className={`mp-card ${p._confirmDelete ? 'mp-card-danger' : ''}`}>
      {/* Image */}
      <div className="mp-card-img">
        {imgSrc
          ? <img src={imgSrc} alt={p.title} />
          : <div className="mp-card-img-placeholder"><Home size={28} /></div>
        }
        <span className="mp-status-badge" style={{ background: statusInfo.color }}>
          {statusInfo.label}
        </span>
        <span className="mp-type-badge">
          {LISTING_TYPE_LABELS[p.listing_type] || p.listing_type}
        </span>
      </div>

      {/* Body */}
      <div className="mp-card-body">
        <p className="mp-card-type">{PROPERTY_TYPE_LABELS[p.property_type] || p.property_type}</p>
        <h3 className="mp-card-title">{p.title}</h3>
        <p className="mp-card-price">{formatPrice(p.price)}</p>
        {p.city && <p className="mp-card-city">{p.city}</p>}
      </div>

      {/* Actions */}
      {!p._confirmDelete ? (
        <div className="mp-card-actions">
          <Link to={`/property/${p.id}`} className="mp-action-btn mp-action-view" title="View listing">
            <Eye size={14} /> View
          </Link>

          {isEditable ? (
            <button className="mp-action-btn mp-action-edit" onClick={onEdit} title="Edit listing">
              <Edit3 size={14} /> Edit
            </button>
          ) : (
            <span className="mp-action-btn mp-action-disabled" title="Pending review — cannot edit yet">
              <Edit3 size={14} /> Edit
            </span>
          )}

          {p._statusLoading ? (
            <span className="mp-action-btn mp-action-disabled">
              <Loader2 className="spin" size={14} />
            </span>
          ) : isSold ? (
            <button className="mp-action-btn mp-action-relist"
              onClick={() => onStatusChange('VERIFIED')} title="Mark as active">
              <RotateCcw size={14} /> Relist
            </button>
          ) : p.status === 'VERIFIED' ? (
            <button className="mp-action-btn mp-action-sold"
              onClick={() => onStatusChange('SOLD')} title="Mark as sold / rented">
              <CheckCircle size={14} /> Mark Sold
            </button>
          ) : null}

          <button className="mp-action-btn mp-action-delete" onClick={onAskDelete} title="Delete listing">
            {p._deleting ? <Loader2 className="spin" size={14} /> : <Trash2 size={14} />}
          </button>
        </div>
      ) : (
        <div className="mp-card-confirm">
          <p>Delete this listing permanently?</p>
          <div className="mp-confirm-btns">
            <button className="mp-action-btn mp-action-cancel-del" onClick={onCancelDelete}>
              <XCircle size={14} /> Cancel
            </button>
            <button className="mp-action-btn mp-action-confirm-del" onClick={onConfirmDelete}>
              {p._deleting
                ? <Loader2 className="spin" size={14} />
                : <><Trash2 size={14} /> Yes, Delete</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="mp-card mp-skeleton">
      <div className="mp-card-img sk-block" />
      <div className="mp-card-body">
        <div className="sk-line sk-short" />
        <div className="sk-line sk-medium" />
        <div className="sk-line sk-short" />
      </div>
      <div className="mp-card-actions sk-actions">
        <div className="sk-line sk-btn" />
        <div className="sk-line sk-btn" />
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="mp-empty">
      <div className="mp-empty-icon"><Home size={36} /></div>
      <h3 className="mp-empty-title">No listings yet</h3>
      <p className="mp-empty-sub">Post your first property to get buyers and tenants reaching out.</p>
      <Link to="/list-property" className="mp-add-btn">
        <Plus size={16} /> Post a Property
      </Link>
    </div>
  );
}
