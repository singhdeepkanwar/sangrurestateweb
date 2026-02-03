import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LOGO_IMG from '../assets/logo-white.png';
import FooterSimple from './FooterSimple';

const FAQ = () => {
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
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div className="brand" style={{ cursor: 'pointer' }}>
                        <img src={LOGO_IMG} alt="Sangrur Estate" className="brand-logo" style={{ filter: 'invert(1)' }} />
                    </div>
                </Link>
                <Link to="/" className="btn-text">← Back to Home</Link>
            </nav>
            <div className="doc-content">
                <h1>Frequently Asked Questions</h1>
                <p className="hero-sub" style={{ marginBottom: 40, color: '#555' }}>Have questions? We're here to help.</p>

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
            <FooterSimple />
        </div>
    );
};

export default FAQ;
