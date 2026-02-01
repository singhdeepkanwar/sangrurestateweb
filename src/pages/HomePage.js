import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function HomePage({ properties }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('buy');
  const [filter, setFilter] = useState('Buy');

  // Filter Logic
  const displayProps = properties.filter(p => {
    const targetTag = filter === 'Buy' ? 'sell' : 'rent';
    return p.tag === targetTag;
  });

  return (
    <div className="page">
      <div className="header row space-between">
        <div className="logo-text">Sangrur<span className="logo-accent">Estate</span></div>
        <div className="row">
          <div className="toggle-container">
            <button className={`toggle-btn ${mode === 'buy' ? 'active' : ''}`} onClick={() => setMode('buy')}>Buy</button>
            <button className={`toggle-btn ${mode === 'sell' ? 'active' : ''}`} onClick={() => setMode('sell')}>Sell</button>
          </div>
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" className="avatar" alt="Profile" />
        </div>
      </div>

      {mode === 'buy' ? (
        <>
          <div className="filter-row scroll-x">
            <div className={`filter-chip ${filter === 'Buy' ? 'active' : ''}`} onClick={() => setFilter('Buy')}>Buy</div>
            <div className={`filter-chip ${filter === 'Rent' ? 'active' : ''}`} onClick={() => setFilter('Rent')}>Rent</div>
            <div className="filter-chip">All Filters ⚙️</div>
          </div>

          <div className="list">
            {displayProps.map(item => (
              <div key={item.id} className="card" onClick={() => navigate(`/details/${item.id}`)}>
                <div className="card-bg" style={{ backgroundImage: `url(${item.image})` }}>
                  <div className="card-overlay">
                    <div className="row space-between">
                      <div className="tag">{item.type}</div>
                      <div className="circle-btn">♥</div>
                    </div>
                    <div className="card-footer">
                      <div className="row space-between">
                        <div className="card-title">{item.title}</div>
                        <div className="card-price">{item.price}</div>
                      </div>
                      <span className="card-address">📍 {item.address}</span>
                      {item.type === 'House' && (
                        <div className="specs">
                          <span className="spec-item">🛏 {item.beds} Beds</span>
                          <span className="spec-item">🛁 {item.baths} Baths</span>
                          <span className="spec-item">📐 {item.area}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="sell-container">
          <h2 className="sell-header">Seller Dashboard</h2>
          <div className="sell-card" onClick={() => navigate('/list')}>
            <span className="sell-icon">➕</span>
            <div><div className="sell-title">List a property</div><div className="sell-sub">Post your property for free</div></div>
          </div>
          <div className="sell-card" onClick={() => navigate('/manage')}>
            <span className="sell-icon">📝</span>
            <div><div className="sell-title">Manage properties</div><div className="sell-sub">Edit or remove listings</div></div>
          </div>
          <div className="sell-card" onClick={() => navigate('/saved')}>
            <span className="sell-icon">❤️</span>
            <div><div className="sell-title">Saved properties</div><div className="sell-sub">Homes you liked</div></div>
          </div>
          <div className="sell-card" onClick={() => navigate('/inquired')}>
            <span className="sell-icon">💬</span>
            <div><div className="sell-title">Inquired properties</div><div className="sell-sub">Check client responses</div></div>
          </div>
        </div>
      )}
    </div>
  );
}