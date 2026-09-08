import React from 'react';
import { FaHeart } from 'react-icons/fa';
import CoupleName from '../../components/CoupleName';

const Footer = ({ invitation }) => {
  const copy = invitation?.footer || {};
  const coupleName = invitation?.couple_display_name;

  if (copy.is_enabled === false) return null;
  if (!coupleName || !copy.date) return null;

  return (
    <footer className="relative isolate overflow-hidden border-t border-gold/20 bg-[linear-gradient(145deg,#0B0A10_0%,#17101A_48%,#25192A_100%)] py-14 text-center text-[#F7EBD2]">
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#9A77B8]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-[8%] top-5 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-gold/80">
          {copy.date}
        </p>
        <h2 className="mb-6 break-words font-serif text-4xl text-[#F7EBD2] md:text-5xl">
          <CoupleName value={coupleName} ampersandClassName="text-gold" />
        </h2>

        <div className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="flex items-center justify-center gap-2 text-sm text-[#F7EBD2]/72">
          <span>{copy.made_with}</span>
          <FaHeart className="mx-1 animate-pulse text-gold" />
          <span>{copy.for_day}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
