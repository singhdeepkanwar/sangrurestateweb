import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PropertyDetailsPage({ properties, savedIds, onToggleSave, onInquire }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === id);
  const isSaved = savedIds.includes(id);

  if (!property) return <div>Loading...</div>;

  return (
    <div className="page">
      <div className="details-hero">
        <img src={property.image} className="hero-img" alt="Hero" />
        <div className="top-nav">
          <button className="circle-btn" onClick={() => navigate(-1)}>←</button>
          <div className="row">
            <button className="circle-btn">↗</button>
            <button className="circle-btn" style={{marginLeft:10}} onClick={() => onToggleSave(id)}>
              <span style={{color: isSaved ? '#ff4d4d' : 'white'}}>{isSaved ? '♥' : '♡'}</span>
            </button>
          </div>
        </div>
        <div className="floating-stats">
          <div className="stat-pill">♡ 1.3K</div>
          <div className="stat-pill">👁 2K</div>
        </div>
      </div>

      <div className="details-content">
        <div className="row space-between" style={{alignItems:'flex-start'}}>
          <div>
            <h1 style={{fontSize:26, marginBottom:5}}>{property.title}</h1>
            <span style={{color:'#888'}}>📍 {property.address}</span>
          </div>
          <h2 style={{color:'var(--primary)'}}>{property.price}</h2>
        </div>

        <h3 style={{marginTop:20, marginBottom:10}}>Description</h3>
        <p style={{color:'#666', lineHeight:1.5}}>{property.description}</p>

        <h3 style={{marginTop:20, marginBottom:10}}>Details</h3>
        <div className="spec-grid">
          {property.type === 'House' && (
             <>
               <div className="spec-box"><div style={{fontSize:24}}>🛏</div><div>{property.beds} Beds</div></div>
               <div className="spec-box"><div style={{fontSize:24}}>🛁</div><div>{property.baths} Baths</div></div>
             </>
          )}
          <div className="spec-box"><div style={{fontSize:24}}>📐</div><div>{property.area}</div></div>
        </div>

        <div style={{height: 100}}></div>
      </div>
      
      <button className="inquire-btn" onClick={() => {
        onInquire(id);
        alert('Inquiry Sent! Agent will contact you.');
      }}>Inquire Now</button>
    </div>
  );
}