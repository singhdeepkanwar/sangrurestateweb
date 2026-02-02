import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Assuming styles are global or import specific css

// --- ASSETS ---
const HERO_VIDEO_URL = "https://videos.pexels.com/video-files/7578546/7578546-uhd_2560_1440_30fps.mp4";
const PLAY_STORE_IMG = "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg";
const APP_STORE_IMG = "https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg";
const MOCK_PHONE_IMG = "https://b.zmtcdn.com/data/o2_assets/f773629053b24263e69f601925790f301680693809.png";

const LandingPage = () => {
    const navigate = useNavigate();

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
                            <Link to="/faq" className="nav-link-btn">FAQ</Link>
                            <button className="nav-cta" onClick={() => window.location.href = '#app'}>Download</button>
                        </div>
                    </div>
                </nav>

                <div className="hero-body container">
                    <div className="hero-text">
                        <span className="hero-badge">#1 Property App in Sangrur</span>
                        <h1>Find your next<br /><span className="text-highlight">Dream Home</span></h1>
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
                        <h2>Real Estate in<br />Your Pocket</h2>
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
