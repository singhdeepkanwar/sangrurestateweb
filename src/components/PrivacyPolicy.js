import React from 'react';
import { Link } from 'react-router-dom';
import LOGO_IMG from '../assets/logo-white.png';
import FooterSimple from './FooterSimple';

const PrivacyPolicy = () => (
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
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last updated: February 3, 2026</p>

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
        <FooterSimple />
    </div>
);

export default PrivacyPolicy;
