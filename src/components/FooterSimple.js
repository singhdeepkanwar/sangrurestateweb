import React from 'react';
import { Link } from 'react-router-dom';

const FooterSimple = () => (
  <footer className="footer-simple">
    <div className="container">
      <p>&copy; 2026 SangrurEstate. All rights reserved.</p>
      <div className="legal">
        <Link to="/" style={{ cursor: 'pointer', color: 'inherit' }}>Home</Link>
      </div>
    </div>
  </footer>
);

export default FooterSimple;
