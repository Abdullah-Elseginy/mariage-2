import React from 'react';

const Footer = ({ footerText }) => {
  if (!footerText) return null;

  return (
    <footer className="eid-quote-card-redesigned">
      {/* Corner Ornaments */}
      <div className="eid-ornament-corner eid-ornament-top-left" style={{ width: 8, height: 8 }} />
      <div className="eid-ornament-corner eid-ornament-top-right" style={{ width: 8, height: 8 }} />
      <div className="eid-ornament-corner eid-ornament-bottom-left" style={{ width: 8, height: 8 }} />
      <div className="eid-ornament-corner eid-ornament-bottom-right" style={{ width: 8, height: 8 }} />

      <p className="text-gold font-serif italic text-sm md:text-base leading-relaxed px-4">
        "{footerText}"
      </p>
    </footer>
  );
};

export default Footer;
