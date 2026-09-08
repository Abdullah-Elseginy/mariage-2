import React from 'react';
import { FaFacebookF, FaGlobe, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import './index.css';

const links = [
  {
    id: 'whatsapp',
    href: 'https://wa.me/201557517718',
    label: 'WhatsApp',
    icon: FaWhatsapp,
  },
  {
    id: 'portfolio',
    href: 'https://marriage-five-pi.vercel.app/',
    label: 'WIL Portfolio',
    icon: FaGlobe,
  },
  {
    id: 'facebook',
    href: 'https://www.facebook.com/share/1DnWMLjYXP/',
    label: 'Facebook',
    icon: FaFacebookF,
  },
  {
    id: 'instagram',
    href: 'https://www.instagram.com/wil.link.official?igsh=cTI1d2t2dnVrNmpy',
    label: 'Instagram',
    icon: FaInstagram,
  },
  {
    id: 'tiktok',
    href: 'https://www.tiktok.com/@wedding.invitation.links?_r=1&_t=ZS-97LmUjb2WQf',
    label: 'TikTok',
    icon: FaTiktok,
  },
];

const PlatformFooter = ({ locale = 'en', theme = 'classic' }) => {
  const isArabic = locale === 'ar';

  return (
    <footer className="wil-platform-footer" data-theme={theme} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="wil-platform-footer__inner">
        <a
          className="wil-platform-footer__brand"
          href="https://marriage-five-pi.vercel.app/"
          target="_blank"
          rel="noreferrer"
        >
          <strong>WIL</strong>
          <span>{isArabic ? 'نصنع لحظات تستحق أن تُشارك' : 'Moments made to be shared'}</span>
        </a>

        <nav className="wil-platform-footer__links" aria-label={isArabic ? 'روابط منصة WIL' : 'WIL platform links'}>
          {links.map(({ id, href, label, icon: Icon }) => (
            <a key={id} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
              <Icon aria-hidden="true" />
            </a>
          ))}
        </nav>

        <p className="wil-platform-footer__copyright">
          {isArabic ? 'جميع الحقوق محفوظة' : 'All rights reserved'} © {new Date().getFullYear()} WIL
        </p>
      </div>
    </footer>
  );
};

export default PlatformFooter;
