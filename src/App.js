import React, { useState, useEffect } from 'react';
import './App.css';

// --- ASSETS ---
const HERO_VIDEO_URL = "https://videos.pexels.com/video-files/7578546/7578546-uhd_2560_1440_30fps.mp4"; 
const PLAY_STORE_IMG = "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg";
const APP_STORE_IMG = "https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg";
const MOCK_PHONE_IMG = "https://b.zmtcdn.com/data/o2_assets/f773629053b24263e69f601925790f301680693809.png"; 

// --- 1. PRIVACY POLICY PAGE ---
const PrivacyPage = ({ onBack }) => (
  <div className="page-container fade-in">
    <nav className="doc-nav">
      <div className="brand" onClick={onBack} style={{cursor:'pointer'}}>Sangrur<span className="brand-accent">Estate</span></div>
      <button className="btn-text" onClick={onBack}>← Back to Home</button>
    </nav>
    <div className="doc-content">
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last updated: October 24, 2026</p>
      
      <section>
        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>
      </section>

      <section>
        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect to provide, maintain, and improve our services, such as to:</p>
        <ul>
          <li>Facilitate payments, send receipts, and provide customer support.</li>
          <li>Send you updates, security alerts, and administrative messages.</li>
          <li>Personalize and improve the services, including to provide or recommend features, content, social connections, referrals, and advertisements.</li>
        </ul>
      </section>

      <section>
        <h3>3. Sharing of Information</h3>
        <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:</p>
        <ul>
          <li>With verified real estate agents and sellers when you initiate an inquiry.</li>
          <li>With third-party service providers to provide necessary services (e.g., cloud hosting).</li>
        </ul>
      </section>
    </div>
    <FooterSimple onBack={onBack} />
  </div>
);

// --- 2. TERMS OF SERVICE PAGE ---
const TermsPage = ({ onBack }) => (
  <div className="page-container fade-in">
    <nav className="doc-nav">
      <div className="brand" onClick={onBack} style={{cursor:'pointer'}}>Sangrur<span className="brand-accent">Estate</span></div>
      <button className="btn-text" onClick={onBack}>← Back to Home</button>
    </nav>
    <div className="doc-content">
      <h1>Terms of Service</h1>
      <p className="last-updated">Last updated: October 24, 2026</p>

      <section>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using the SangrurEstate platform, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
      </section>

      <section>
        <h3>2. Use of Service</h3>
        <p>You represent and warrant that you are at least 18 years of age and that you have the right, authority, and capacity to enter into this Agreement and to abide by all of the terms and conditions of this Agreement.</p>
      </section>

      <section>
        <h3>3. Property Listings</h3>
        <p>Users are responsible for the accuracy of the property details they post. SangrurEstate verifies listings physically but does not guarantee 100% accuracy of user-generated content (descriptions, prices, etc.) which may change without notice.</p>
      </section>

      <section>
        <h3>4. Limitation of Liability</h3>
        <p>In no event shall SangrurEstate, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
      </section>
    </div>
    <FooterSimple onBack={onBack} />
  </div>
);

// --- 3. FAQ PAGE ---
const FAQPage = ({ onBack }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    { q: "Is listing a property free?", a: "Yes! You can list residential and commercial properties for free on SangrurEstate. We also offer premium plans for higher visibility." },
    { q: "How are listings verified?", a: "Our field agents visit the property location to verify ownership details, take photographs, and ensure the listing data is accurate before the 'Verified' badge is awarded." },
    { q: "Can I contact owners directly?", a: "Absolutely. Once you log in, you can chat directly with property owners or view their contact numbers without any brokerage fees." },
    { q: "How do I report a fake listing?", a: "On every property details page, there is a 'Report' button. Click it, select the reason (e.g., Wrong Price, Sold Out), and our team will investigate immediately." },
    { q: "Do you offer rental agreements?", a: "Yes, we provide assistance with rental agreements and police verification services through our partner network." }
  ];

  return (
    <div className="page-container fade-in">
      <nav className="doc-nav">
        <div className="brand" onClick={onBack} style={{cursor:'pointer'}}>Sangrur<span className="brand-accent">Estate</span></div>
        <button className="btn-text" onClick={onBack}>← Back to Home</button>
      </nav>
      <div className="doc-content">
        <h1>Frequently Asked Questions</h1>
        <p className="hero-sub" style={{marginBottom:40, color:'#555'}}>Have questions? We're here to help.</p>
        
        <div className="faq-list">
          {faqs.map((item, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`} onClick={() => setOpenIndex(i === openIndex ? -1 : i)}>
              <div className="faq-question">
                <span>{item.q}</span>
                <span className="faq-toggle">{openIndex === i ? '−' : '+'}</span>
              </div>
              {openIndex === i && <div className="faq-answer"><p>{item.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
      <FooterSimple onBack={onBack} />
    </div>
  );
};

// --- SIMPLE FOOTER FOR DOC PAGES ---
const FooterSimple = ({ onBack }) => (
  <footer className="footer-simple">
    <div className="container">
      <p>&copy; 2026 SangrurEstate. All rights reserved.</p>
      <div className="legal">
        <span onClick={onBack} style={{cursor:'pointer'}}>Home</span>
      </div>
    </div>
  </footer>
);

// --- 4. MAIN LANDING PAGE (With Navigation Logic) ---
const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-wrapper fade-in">
      {/* Hero */}
      <header className="hero" id="home">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>

        <nav className="nav">
          <div className="container nav-content">
            <div className="brand">Sangrur<span className="brand-accent">Estate</span></div>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#app">Get App</a>
              <button className="nav-link-btn" onClick={() => onNavigate('faq')}>FAQ</button>
              <button className="nav-cta" onClick={() => window.location.href='#app'}>Download</button>
            </div>
          </div>
        </nav>

        <div className="hero-body container">
          <div className="hero-text">
            <span className="hero-badge">#1 Property App in Sangrur</span>
            <h1>Find your next<br/><span className="text-highlight">Dream Home</span></h1>
            <p className="hero-sub">Buy, Rent, and Sell properties with zero hassle. Verified listings, direct owner contact, and premium insights.</p>
            <div className="hero-buttons">
              <a href="#" className="store-link scale-hover"><img src={PLAY_STORE_IMG} alt="Play Store" /></a>
              <a href="#" className="store-link scale-hover"><img src={APP_STORE_IMG} alt="App Store" /></a>
            </div>
          </div>
        </div>
      </header>

      {/* VIBRANT FEATURES */}
      <section className="section features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything you need</h2>
            <p>We’ve streamlined the real estate journey so you can focus on moving in.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card card-hover">
              <div className="icon-box blue">🏠</div>
              <h3>Buy & Sell</h3>
              <p>List for free or browse thousands of verified homes.</p>
            </div>
            <div className="feature-card card-hover">
              <div className="icon-box green">🔑</div>
              <h3>Rental Homes</h3>
              <p>Find the perfect rental apartment or house easily.</p>
            </div>
            <div className="feature-card card-hover">
              <div className="icon-box purple">🏢</div>
              <h3>Commercial</h3>
              <p>Premium office spaces, shops, and industrial plots.</p>
            </div>
            <div className="feature-card card-hover">
              <div className="icon-box orange">🛡️</div>
              <h3>Verified</h3>
              <p>We physically verify properties to ensure no fakes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* APP SHOWCASE */}
      <section className="section app-showcase" id="app">
        <div className="bg-glow"></div>
        <div className="container showcase-flex">
          <div className="phone-wrapper">
             <img src={MOCK_PHONE_IMG} alt="App Interface" className="phone-img floating" />
             <div className="float-card c1">📍 Map View</div>
             <div className="float-card c2">❤️ Favorites</div>
          </div>
          <div className="showcase-info">
            <span className="pill-badge">Mobile First</span>
            <h2>Real Estate in<br/>Your Pocket</h2>
            <p>Experience the power of SangrurEstate on the go.</p>
            <ul className="feature-list">
              <li><span className="check">✓</span><div><strong>Immersive Visuals</strong><span>High-res photos & videos.</span></div></li>
              <li><span className="check">✓</span><div><strong>Direct Chat</strong><span>Connect with sellers directly.</span></div></li>
              <li><span className="check">✓</span><div><strong>Smart Alerts</strong><span>Get notified on price drops.</span></div></li>
            </ul>
            <div className="download-area">
              <p>Available now on iOS and Android</p>
              <div className="hero-buttons">
                <a href="#" className="store-link"><img src={PLAY_STORE_IMG} alt="Play Store" /></a>
                <a href="#" className="store-link"><img src={APP_STORE_IMG} alt="App Store" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section stats" id="stats">
        <div className="container stats-grid">
          <div className="stat-item"><h3 className="grad-num">5k+</h3><p>Listings</p></div>
          <div className="divider-vertical"></div>
          <div className="stat-item"><h3 className="grad-num">1.2k</h3><p>Families</p></div>
          <div className="divider-vertical"></div>
          <div className="stat-item"><h3 className="grad-num">50+</h3><p>Agents</p></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <h2>SangrurEstate</h2>
              <p>Simple, transparent, accessible.</p>
            </div>
            <div className="footer-nav-links">
               <button onClick={() => onNavigate('privacy')}>Privacy Policy</button>
               <button onClick={() => onNavigate('terms')}>Terms of Service</button>
               <button onClick={() => onNavigate('faq')}>FAQ</button>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 SangrurEstate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- MAIN APP ROUTER ---
export default function App() {
  const [view, setView] = useState('landing'); // landing, privacy, terms, faq

  switch(view) {
    case 'privacy': return <PrivacyPage onBack={() => setView('landing')} />;
    case 'terms': return <TermsPage onBack={() => setView('landing')} />;
    case 'faq': return <FAQPage onBack={() => setView('landing')} />;
    default: return <LandingPage onNavigate={setView} />;
  }
}