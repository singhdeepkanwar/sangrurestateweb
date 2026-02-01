import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function InquiredPropertiesPage({ properties, inquiredIds }) {
  const navigate = useNavigate();
  const inquiredProps = properties.filter(p => inquiredIds.includes(p.id));

  return (
    <div className="page">
      <div className="header row space-between">
        <div style={{fontSize:24, cursor:'pointer'}} onClick={() => navigate(-1)}>←</div>
        <h3>Inquired Properties</h3>
        <div style={{width:20}}></div>
      </div>

      {inquiredProps.length === 0 ? <div style={{padding:20, textAlign:'center', color:'#888'}}>No inquiries yet.</div> : (
        <div className="list">
          {inquiredProps.map(item => (
            <div key={item.id} className="card" onClick={() => navigate(`/details/${item.id}`)}>
              <div className="card-bg" style={{ backgroundImage: `url(${item.image})` }}>
                <div className="card-overlay">
                  <div style={{display:'flex', justifyContent:'flex-end'}}>
                     <div className="tag" style={{background:'#E3F9E5', color:'#2B8344'}}>Inquired ✓</div>
                  </div>
                  <div className="card-footer">
                    <div className="card-title">{item.title}</div>
                    <div className="card-price">{item.price}</div>
                    <span className="card-address">📍 {item.address}</span>
                    <div style={{fontSize:11, color:'#E3F9E5', marginTop:4}}>Agent Contacted</div>
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