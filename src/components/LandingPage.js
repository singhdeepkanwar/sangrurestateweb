import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '../App.css'; // Assuming styles are global or import specific css
import MOCK_PHONE_IMG from '../assets/app-mockup.png';
import HERO_VIDEO from '../assets/hero-video.mp4';
import LOGO_IMG from '../assets/logo-white.png';

// --- ASSETS ---
// Video is now imported locally



const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="landing-wrapper fade-in">
            {/* Hero */}
            <header className="hero" id="home">
                <video className="hero-video" autoPlay loop muted playsInline>
                    <source src={HERO_VIDEO} type="video/mp4" />
                </video>
                <div className="hero-overlay"></div>

                <nav className="nav">
                    <div className="container nav-content">
                        <div className="brand">
                            <img src={LOGO_IMG} alt="Sangrur Estate" className="brand-logo" />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                            {isMenuOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
                        </button>

                        <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
                            <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
                            <a href="#app" onClick={() => setIsMenuOpen(false)}>Get App</a>
                            <Link to="/faq" className="nav-link-btn" onClick={() => setIsMenuOpen(false)}>FAQ</Link>

                            <button className="nav-cta" style={{ cursor: 'default' }}>Coming Soon</button>
                        </div>
                    </div>
                </nav>

                <div className="hero-body container">
                    <div className="hero-text">
                        <span className="hero-badge">#1 Property App in Sangrur</span>
                        <h1>Find your next<br /><span className="text-highlight">Dream Home</span></h1>
                        <p className="hero-sub">Buy, Rent, and Sell properties with zero hassle. Verified listings, direct owner contact, and premium insights.</p>
                        <div className="hero-buttons">
                            <div className="coming-soon-tile">
                                <div className="tile-icon">🍎</div>
                                <div className="tile-text">
                                    <span className="tile-label">Coming Soon</span>
                                    <span className="tile-platform">App Store</span>
                                </div>
                            </div>
                            <div className="coming-soon-tile">
                                <div className="tile-icon">🤖</div>
                                <div className="tile-text">
                                    <span className="tile-label">Coming Soon</span>
                                    <span className="tile-platform">Google Play</span>
                                </div>
                            </div>
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
                        <span className="pill-badge">Coming Soon</span>
                        <h2>Real Estate in<br />Your Pocket</h2>
                        <p>We are building the best mobile experience for you. Stay tuned!</p>
                        <ul className="feature-list">
                            <li><span className="check">✓</span><div><strong>Immersive Visuals</strong><span>High-res photos & videos.</span></div></li>
                            <li><span className="check">✓</span><div><strong>Direct Chat</strong><span>Connect with sellers directly.</span></div></li>
                            <li><span className="check">✓</span><div><strong>Smart Alerts</strong><span>Get notified on price drops.</span></div></li>
                        </ul>
                        <div className="download-area">
                            <p>Launching soon on iOS and Android</p>
                            <div className="coming-soon-container">
                                <div className="coming-soon-tile">
                                    <div className="tile-icon">🍎</div>
                                    <div className="tile-text">
                                        <span className="tile-label">Coming Soon</span>
                                        <span className="tile-platform">App Store</span>
                                    </div>
                                </div>
                                <div className="coming-soon-tile">
                                    <div className="tile-icon">🤖</div>
                                    <div className="tile-text">
                                        <span className="tile-label">Coming Soon</span>
                                        <span className="tile-platform">Google Play</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="section stats" id="stats">
                <div className="container stats-grid">
                    <div className="stat-item"><h3 className="grad-num">Property Listings</h3><p>Coming Soon</p></div>
                    <div className="divider-vertical"></div>
                    <div className="stat-item"><h3 className="grad-num">For Families</h3><p>Across Sangrur</p></div>
                    <div className="divider-vertical"></div>
                    <div className="stat-item"><h3 className="grad-num">With</h3><p>Property Experts</p></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <img src={LOGO_IMG} alt="Sangrur Estate" className="brand-logo" style={{ marginBottom: '15px' }} />
                            <p>Simple, transparent, accessible.</p>
                        </div>
                        <div className="footer-nav-links">
                            <Link to="/privacy"><button>Privacy Policy</button></Link>
                            <Link to="/terms"><button>Terms of Service</button></Link>
                            <Link to="/faq"><button>FAQ</button></Link>
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

export default LandingPage;
