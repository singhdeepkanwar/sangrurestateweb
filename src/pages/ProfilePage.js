import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Home, Bookmark, MessageSquare,
  PlusSquare, Edit3, Check, X, LogOut, Trash2, Loader2, ChevronRight } from 'lucide-react';
import { updateProfile, deleteAccount } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { validateField } from '../utils/validation';
import Navbar from '../components/Navbar';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    city: user?.city || '',
    address: user?.address || '',
  });

  const handleEdit = () => {
    setForm({
      full_name: user?.full_name || '',
      email: user?.email || '',
      city: user?.city || '',
      address: user?.address || '',
    });
    setError('');
    setSuccess('');
    setEditing(true);
  };

  const handleCancel = () => { setEditing(false); setError(''); };

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    if (!form.full_name.trim()) { setError('Full name is required.'); return; }
    for (const [k, v] of Object.entries(form)) {
      const err = validateField(v, k);
      if (err) { setError(err); return; }
    }
    setSaving(true); setError('');
    try {
      await updateProfile(form);
      await refreshUser();
      setEditing(false);
      setSuccess('Profile updated successfully.');
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      await logout();
      navigate('/');
    } catch {
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const initial = user?.full_name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-wrap container">
        {/* ── Left: profile card ── */}
        <div className="profile-left">
          <div className="profile-card">
            {/* Avatar */}
            <div className="profile-avatar">{initial}</div>
            <h2 className="profile-name">{user?.full_name || '—'}</h2>
            <p className="profile-phone">
              <Phone size={13} /> +91 {user?.phone}
            </p>

            {/* Quick nav */}
            <div className="profile-nav">
              <Link to="/saved" className="profile-nav-item">
                <Bookmark size={16} /> Saved Properties <ChevronRight size={14} className="pni-arrow" />
              </Link>
              <Link to="/inquiries" className="profile-nav-item">
                <MessageSquare size={16} /> My Inquiries <ChevronRight size={14} className="pni-arrow" />
              </Link>
              <Link to="/my-properties" className="profile-nav-item">
                <Home size={16} /> My Listings <ChevronRight size={14} className="pni-arrow" />
              </Link>
              <Link to="/list-property" className="profile-nav-item profile-nav-cta">
                <PlusSquare size={16} /> List a Property <ChevronRight size={14} className="pni-arrow" />
              </Link>
            </div>

            {/* Logout */}
            <button className="profile-logout-btn" onClick={handleLogout}>
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>

        {/* ── Right: edit form ── */}
        <div className="profile-right">
          <div className="profile-form-card">
            <div className="profile-form-header">
              <h3 className="profile-form-title">Personal Details</h3>
              {!editing && (
                <button className="profile-edit-btn" onClick={handleEdit}>
                  <Edit3 size={14} /> Edit
                </button>
              )}
            </div>

            {success && <div className="profile-success">{success}</div>}
            {error   && <div className="profile-error">{error}</div>}

            <div className="profile-fields">
              <ProfileField
                icon={<User size={15} />}
                label="Full Name"
                value={editing ? form.full_name : user?.full_name}
                editing={editing}
                onChange={(v) => handleChange('full_name', v)}
                placeholder="Your full name"
                required
              />
              <ProfileField
                icon={<Phone size={15} />}
                label="Phone"
                value={`+91 ${user?.phone || ''}`}
                editing={false}
                readOnly
              />
              <ProfileField
                icon={<Mail size={15} />}
                label="Email"
                value={editing ? form.email : user?.email}
                editing={editing}
                onChange={(v) => handleChange('email', v)}
                placeholder="you@example.com"
                type="email"
              />
              <ProfileField
                icon={<MapPin size={15} />}
                label="City / Town"
                value={editing ? form.city : user?.city}
                editing={editing}
                onChange={(v) => handleChange('city', v)}
                placeholder="Sangrur"
              />
              <ProfileField
                icon={<MapPin size={15} />}
                label="Address"
                value={editing ? form.address : user?.address}
                editing={editing}
                onChange={(v) => handleChange('address', v)}
                placeholder="Street / Area"
              />
            </div>

            {editing && (
              <div className="profile-form-actions">
                <button className="profile-cancel-btn" onClick={handleCancel} disabled={saving}>
                  <X size={14} /> Cancel
                </button>
                <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="spin" size={15} /> : <Check size={14} />}
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          {/* Danger zone */}
          <div className="profile-danger-card">
            <h4 className="profile-danger-title">Danger Zone</h4>
            <p className="profile-danger-text">
              Deleting your account is permanent and cannot be undone. All your listings and data will be removed.
            </p>
            {!showDeleteConfirm ? (
              <button className="profile-delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 size={14} /> Delete Account
              </button>
            ) : (
              <div className="profile-delete-confirm">
                <p>Are you sure? This cannot be undone.</p>
                <div className="profile-delete-actions">
                  <button className="profile-cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                  <button className="profile-delete-confirm-btn" onClick={handleDeleteAccount} disabled={deleting}>
                    {deleting ? <Loader2 className="spin" size={14} /> : <Trash2 size={14} />}
                    {deleting ? 'Deleting…' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value, editing, onChange, placeholder, type = 'text', readOnly }) {
  return (
    <div className="pf-field">
      <div className="pf-label">
        <span className="pf-icon">{icon}</span>
        {label}
      </div>
      {editing && !readOnly ? (
        <input
          className="pf-input"
          type={type}
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className={`pf-value ${readOnly ? 'pf-readonly' : ''}`}>
          {value || <span className="pf-empty">Not set</span>}
        </div>
      )}
    </div>
  );
}
