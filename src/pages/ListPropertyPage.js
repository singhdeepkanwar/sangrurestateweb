import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ListPropertyPage({ onAdd, onUpdate, properties }) {
  const navigate = useNavigate();
  const { id } = useParams(); // If ID exists, we are editing
  const existingProp = id ? properties.find(p => p.id === id) : null;

  const [type, setType] = useState(existingProp?.tag || 'sell');
  const [propName, setPropName] = useState(existingProp?.title || '');
  const [cat, setCat] = useState(existingProp?.type || 'House');
  const [price, setPrice] = useState(existingProp?.price || '');
  const [area, setArea] = useState(existingProp?.area || '');
  const [images, setImages] = useState(existingProp ? [existingProp.image] : []);

  const handleSubmit = () => {
    const newProp = {
      id: existingProp ? existingProp.id : Math.random().toString(),
      title: propName,
      price: price,
      type: cat,
      tag: type,
      area: area,
      address: 'Simulated Location',
      image: images.length > 0 ? images[0] : 'https://via.placeholder.com/400',
      beds: 3, baths: 2, // Dummy data for simulation
      description: 'Newly listed property.'
    };

    if (existingProp) onUpdate(newProp);
    else onAdd(newProp);

    alert('Success!');
    navigate('/');
  };

  return (
    <div className="form-container">
      <div className="header row space-between">
        <div style={{fontSize:24, cursor:'pointer'}} onClick={() => navigate(-1)}>←</div>
        <h3>{existingProp ? 'Edit Property' : 'List Property'}</h3>
        <div style={{width:20}}></div>
      </div>

      <div className="toggle-container" style={{background:'#F7F8FA', width:'100%', marginBottom:20}}>
        <button className={`toggle-btn ${type === 'sell' ? 'active' : ''}`} style={{flex:1}} onClick={() => setType('sell')}>Sell</button>
        <button className={`toggle-btn ${type === 'rent' ? 'active' : ''}`} style={{flex:1}} onClick={() => setType('rent')}>Rent</button>
      </div>

      <label className="input-label">Property Name</label>
      <input className="input-field" value={propName} onChange={e => setPropName(e.target.value)} />

      <label className="input-label">Type</label>
      <div className="chip-row">
        {['House', 'Plot', 'Commercial'].map(c => (
          <div key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</div>
        ))}
      </div>

      <label className="input-label">Price</label>
      <input className="input-field" value={price} onChange={e => setPrice(e.target.value)} />

      <label className="input-label">Area</label>
      <input className="input-field" value={area} onChange={e => setArea(e.target.value)} />

      <label className="input-label">Images (Min 3)</label>
      <div className="scroll-x" style={{paddingBottom:10}}>
        <div className="add-img-btn" onClick={() => setImages([...images, "https://via.placeholder.com/150"])}>+</div>
        {images.map((img, i) => <img key={i} src={img} className="img-thumb" alt="thumb"/>)}
      </div>

      <button className="inquire-btn" style={{position:'relative', bottom:0, transform:'none', marginTop:20}} onClick={handleSubmit}>
        {existingProp ? 'Save Changes' : 'Post Property'}
      </button>
    </div>
  );
}