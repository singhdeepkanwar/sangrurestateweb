import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');

  const bgImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="login-bg" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="overlay"></div>
      <div className="login-content">
        <h1 className="hero-title">Find the place<br />you'll love</h1>
        
        {step === 1 && (
          <>
            <p style={{marginBottom: 30, opacity: 0.9}}>Browse, save, and explore homes made for you.</p>
            <button className="inquire-btn" style={{position:'relative', bottom:0, transform:'none'}} onClick={() => setStep(2)}>Get Started</button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="input-label" style={{color:'white'}}>Enter Phone Number</p>
            <input className="glass-input" placeholder="+1 987 654 3210" value={phone} onChange={(e)=>setPhone(e.target.value)} />
            <button className="inquire-btn" style={{position:'relative', bottom:0, transform:'none'}} onClick={() => navigate('/')}>Login</button>
          </>
        )}
      </div>
    </div>
  );
}