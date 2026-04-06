import React from 'react';
import { Link } from 'react-router-dom';
import LOGO_IMG from '../assets/logo-white.png';
import FooterSimple from './FooterSimple';

const TermsOfService = () => (
    <div className="page-container fade-in">
        <nav className="doc-nav">
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="brand" style={{ cursor: 'pointer' }}>
                    <img src={LOGO_IMG} alt="Sangrur Estate" className="brand-logo" style={{ filter: 'invert(1)' }} />
                </div>
            </Link>
            <Link to="/" className="btn-text">← Back to Home</Link>
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
        <FooterSimple />
    </div>
);

export default TermsOfService;
