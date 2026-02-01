import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagePropertiesPage({ properties }) {
  const navigate = useNavigate();

  // Simulating "My Properties" as just all properties for demo
  return (
    <div className="page">
      <div className="header row space-between">
        <div style={{fontSize:24, cursor:'pointer'}} onClick={() => navigate(-1)}>←</div>
        <h3>Manage Properties</h3>
        <div style={{width:20}}></div>
      </div>

      <div className="list">
        {properties.map(item => (
          <div key={item.id} className="card" style={{height: 260}} onClick={() => navigate(`/edit/${item.id}`)}>
             <div className="card-bg" style={{ backgroundImage: `url(${item.image})` }}>
                <div className="card-overlay">
                  <div className="row space-between">
                    <div className="tag">{item.type}</div>
                    <div className="tag" style={{background:'#E3F9E5', color:'#2B8344', border:'none'}}>Active</div>
                  </div>
                  <div className="card-footer">
                    <div className="row space-between">
                      <div className="card-title">{item.title}</div>
                      <div className="card-price">{item.price}</div>
                    </div>
                    <span className="card-address">📍 {item.address}</span>
                    <div style={{textAlign:'right', color:'#FFD700', fontSize:12, fontWeight:600, marginTop:5}}>Tap to Edit</div>
                  </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}