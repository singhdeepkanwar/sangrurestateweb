import React from 'react';
import { Instagram, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="lp-root">

      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo-text">
            <span className="lp-logo-script">Sangrur</span>
            <span className="lp-logo-sub">ESTATE</span>
          </div>
          <div className="lp-nav-right">
            <a
              href="https://instagram.com/sangrurestate"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-nav-ig"
            >
              <Instagram size={15} /> Follow us
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">

          {/* Left: Copy */}
          <div className="lp-hero-left">
            <div className="lp-launch-pill">
              <span className="lp-pulse" />
              Launching Soon in Sangrur
            </div>

            <h1 className="lp-hero-h1">
              Sangrur's properties,<br />
              <span className="lp-hero-em">finally online.</span>
            </h1>

            <p className="lp-hero-p">
              Buy, sell, and rent homes, plots, and commercial spaces across
              Sangrur — verified listings, direct inquiries, no middlemen.
            </p>

            <a
              href="https://instagram.com/sangrurestate"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-ig-cta"
            >
              <Instagram size={18} />
              <span>
                <strong>Follow @sangrurestate</strong>
                <small>Be first to know when we go live</small>
              </span>
              <ArrowRight size={16} className="lp-ig-arrow" />
            </a>

            <div className="lp-hero-stats">
              <div className="lp-hstat">
                <span className="lp-hstat-n">Sangrur</span>
                <span className="lp-hstat-l">First Platform</span>
              </div>
              <div className="lp-hstat-sep" />
              <div className="lp-hstat">
                <span className="lp-hstat-n">Free</span>
                <span className="lp-hstat-l">To List</span>
              </div>
              <div className="lp-hstat-sep" />
              <div className="lp-hstat">
                <span className="lp-hstat-n">Verified</span>
                <span className="lp-hstat-l">Properties Only</span>
              </div>
            </div>
          </div>

          {/* Right: Property cards preview */}
          <div className="lp-hero-right">
            <div className="lp-cards-stack">

              <div className="lp-pcard lp-pcard-back">
                <div className="lp-pcard-img-ph lp-ph-2">
                  <img
                    src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=560&q=80&auto=format&fit=crop"
                    alt="Property"
                    className="lp-pcard-photo lp-pcard-photo-dim"
                  />
                </div>
                <div className="lp-pcard-body">
                  <span className="lp-ptype">Plot · Sangrur</span>
                  <span className="lp-pprice">₹28 Lakh</span>
                </div>
              </div>

              <div className="lp-pcard lp-pcard-front">
                <div className="lp-pcard-img-ph lp-ph-1">
                  <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=560&q=80&auto=format&fit=crop"
                    alt="Property"
                    className="lp-pcard-photo"
                  />
                  <span className="lp-pcard-badge">For Sale</span>
                  <span className="lp-pcard-badge lp-badge-verified">✓ Verified</span>
                </div>
                <div className="lp-pcard-body">
                  <div className="lp-pcard-row">
                    <span className="lp-ptype">3BHK House · Sangrur</span>
                  </div>
                  <span className="lp-pprice">₹65 Lakh</span>
                  <div className="lp-pcard-meta">
                    <span><MapPin size={11} /> Sunam Road</span>
                    <span>1200 Sq.Ft</span>
                    <span>3 Bed · 2 Bath</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Scroll curve */}
        <div className="lp-hero-curve" />
      </section>

      {/* ── Journey: 3 steps ── */}
      <section className="lp-journey">
        <div className="lp-section-inner">
          <p className="lp-journey-label">How it works</p>
          <div className="lp-steps">
            <div className="lp-step">
              <span className="lp-step-num">01</span>
              <div>
                <h3>Browse listings</h3>
                <p>Filter by type, price, and location across Sangrur district.</p>
              </div>
            </div>
            <div className="lp-step-connector" />
            <div className="lp-step">
              <span className="lp-step-num">02</span>
              <div>
                <h3>Send an inquiry</h3>
                <p>One tap. Our team connects you with the seller within 24 hrs.</p>
              </div>
            </div>
            <div className="lp-step-connector" />
            <div className="lp-step">
              <span className="lp-step-num">03</span>
              <div>
                <h3>Move in</h3>
                <p>Visit the property, close the deal, and get the keys.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's coming: teased cards ── */}
      <section className="lp-teaser">
        <div className="lp-section-inner">
          <div className="lp-teaser-header">
            <h2>Properties going live soon</h2>
            <p>These listings will be available the day we launch. Follow us on Instagram to be notified first.</p>
          </div>
          <div className="lp-teaser-grid">
            {[
              { type: 'House', tag: 'For Sale', price: '₹55 Lakh', area: '1450 Sq.Ft', loc: 'Sangrur City', color: 'lp-tph-1' },
              { type: 'Plot', tag: 'For Sale', price: '₹18 Lakh', area: '200 Sq.Yd', loc: 'Moonak', color: 'lp-tph-2' },
              { type: 'Apartment', tag: 'For Rent', price: '₹8,000 /mo', area: '850 Sq.Ft', loc: 'Lehragaga', color: 'lp-tph-3' },
            ].map((p) => (
              <div key={p.type + p.loc} className="lp-tcard">
                <div className={`lp-tcard-img ${p.color}`}>
                  <div className="lp-tcard-lock">
                    <span className="lp-lock-icon">🔒</span>
                    <span>Available at launch</span>
                  </div>
                  <span className="lp-tcard-tag">{p.tag}</span>
                </div>
                <div className="lp-tcard-body">
                  <span className="lp-tcard-type">{p.type}</span>
                  <span className="lp-tcard-price">{p.price}</span>
                  <div className="lp-tcard-meta">
                    <span><MapPin size={11} /> {p.loc}</span>
                    <span>{p.area}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lp-teaser-cta">
            <a
              href="https://instagram.com/sangrurestate"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-ig-pill"
            >
              <Instagram size={15} /> Follow @sangrurestate to get notified
            </a>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-features">
        <div className="lp-section-inner">
          <div className="lp-features-split">
            <div className="lp-features-left">
              <p className="lp-feat-label">Built for Sangrur</p>
              <h2>Everything a local<br />buyer or seller needs</h2>
              <p className="lp-feat-sub">
                No national portal fluff. Just the properties that matter in Sangrur, Sunam, Moonak, Dirba, and Lehragaga.
              </p>
            </div>
            <div className="lp-features-right">
              {[
                { title: 'Verified listings only', desc: 'Every property is reviewed before going live. No fake or duplicate posts.' },
                { title: 'List for free', desc: 'Sellers and brokers can post unlimited properties at no cost.' },
                { title: 'Direct inquiry system', desc: 'No spam calls. Send an inquiry and our team handles the introduction.' },
                { title: 'Save & track properties', desc: 'Bookmark the ones you like and revisit them anytime.' },
                { title: 'Mobile app coming soon', desc: 'iOS and Android apps launching alongside the website.' },
              ].map((f) => (
                <div key={f.title} className="lp-feat-item">
                  <CheckCircle size={18} className="lp-feat-check" />
                  <div>
                    <strong>{f.title}</strong>
                    <span>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Instagram ── */}
      <section className="lp-instagram">
        <div className="lp-ig-centered">
          <h3>Follow us for listings &amp; updates</h3>
          <p>We'll post new properties, price drops, and local real estate news as soon as we launch.</p>
          <a
            href="https://instagram.com/sangrurestate"
            target="_blank"
            rel="noopener noreferrer"
            className="lp-ig-follow-btn"
          >
            <Instagram size={16} /> Follow on Instagram
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-hr" />
          <div className="lp-footer-bottom">
            <p>&copy; {new Date().getFullYear()} Sangrur Estate. All rights reserved.</p>
            <p>
              🇮🇳 Proudly made in India &nbsp;·&nbsp; by{' '}
              <a href="https://makebetter.tech" target="_blank" rel="noopener noreferrer">
                makeBetter Technologies
              </a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
