import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Bookmark, User, PlusSquare, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/home" className="nav-logo" onClick={close}>
          <div className="nav-logo-icon"><Home size={18} color="#fff" /></div>
          <div className="nav-logo-text">
            <span className="nav-logo-name">Sangrur</span>
            <span className="nav-logo-sub">ESTATE</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="nav-links-desktop">
          <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Browse
          </NavLink>
          <NavLink to="/saved" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Bookmark size={15} /> Saved
          </NavLink>
          <NavLink to="/inquiries" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <MessageSquare size={15} /> Inquiries
          </NavLink>
          <NavLink to="/my-properties" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            My Listings
          </NavLink>
        </div>

        {/* Desktop right actions */}
        <div className="nav-actions-desktop">
          <Link to="/list-property" className="nav-btn-list">
            <PlusSquare size={15} /> List Property
          </Link>
          <NavLink to="/profile" className={({ isActive }) => `nav-avatar-btn ${isActive ? 'active' : ''}`} title={user?.full_name || 'Profile'}>
            <User size={16} />
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          <NavLink to="/home" className="nav-mobile-link" onClick={close}>Browse Properties</NavLink>
          <NavLink to="/saved" className="nav-mobile-link" onClick={close}>Saved Properties</NavLink>
          <NavLink to="/inquiries" className="nav-mobile-link" onClick={close}>My Inquiries</NavLink>
          <NavLink to="/my-properties" className="nav-mobile-link" onClick={close}>My Listings</NavLink>
          <NavLink to="/list-property" className="nav-mobile-link nav-mobile-highlight" onClick={close}>+ List a Property</NavLink>
          <NavLink to="/profile" className="nav-mobile-link" onClick={close}>Profile</NavLink>
          <button className="nav-mobile-link nav-mobile-logout" onClick={() => { handleLogout(); close(); }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
