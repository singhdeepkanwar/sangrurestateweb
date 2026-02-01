import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SavedPropertiesPage({ properties, savedIds }) {
  const navigate = useNavigate();
  const savedProps = properties.filter(p => savedIds.includes(p.id));

  return (
    <div className="page">
      <div className="header row space-between">
        <div style={{fontSize:24, cursor:'pointer'}} onClick={() => navigate(-1)}>←</div>
        <h3>Saved Properties</h3>
        <div style={{width:20}}></div>
      </div>

      {savedProps.length === 0 ? <div style={{padding:20, textAlign:'center', color:'#888'}}>No saved properties.</div> : (
        <div className="list">
          {savedProps.map(item => (
            <div key={item.id} className="card" onClick={() => navigate(`/details/${item.id}`)}>
              <div className="card-bg" style={{ backgroundImage: `url(${item.image})` }}>
                <div className="card-overlay">
                  <div className="row space-between">
                    <div className="tag">{item.type}</div>
                    <div className="circle-btn" style={{background:'white', color:'#ff4d4d'}}>♥</div>
                  </div>
                  <div className="card-footer">
                    <div className="card-title">{item.title}</div>
                    <div className="card-price">{item.price}</div>
                    <span className="card-address">📍 {item.address}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}