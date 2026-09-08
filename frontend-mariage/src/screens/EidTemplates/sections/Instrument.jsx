import React from 'react';
import { motion } from 'framer-motion';
import { FiMusic } from 'react-icons/fi';

const NOTES = [
  { name: 'Saba', freq: 261.63, tag: 'C4' },
  { name: 'Nahawand', freq: 293.66, tag: 'D4' },
  { name: 'Hijaz', freq: 329.63, tag: 'E4' },
  { name: 'Kurd', freq: 349.23, tag: 'F4' },
  { name: 'Rast', freq: 392, tag: 'G4' },
  { name: 'Bayat', freq: 440, tag: 'A4' },
  { name: 'Sikah', freq: 493.88, tag: 'B4' },
  { name: 'C5', freq: 523.25, tag: 'C5' },
];

const Instrument = ({ instrument, isArabic, onPlayNote }) => {
  if (!instrument || (!instrument.title && !instrument.description)) return null;

  return (
    <motion.section
      id="instrument-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className="eid-section-stack"
    >
      <div className="eid-luxury-border p-6 md:p-8">
        {/* Corner Ornaments */}
        <div className="eid-ornament-corner eid-ornament-top-left" />
        <div className="eid-ornament-corner eid-ornament-top-right" />
        <div className="eid-ornament-corner eid-ornament-bottom-left" />
        <div className="eid-ornament-corner eid-ornament-bottom-right" />

        <div className="text-center">
          <p className="eid-mini-kicker inline-flex justify-center text-sm tracking-widest font-extrabold text-gold">
            <FiMusic className="mr-2 ml-2 text-lg text-gold" /> {instrument.title || (isArabic ? 'آلة موسيقية تفاعلية' : 'Interactive instrument')}
          </p>
          <div className="eid-header-divider" />
          {instrument.description ? (
            <p className="text-[#F7EBD2]/85 text-xs md:text-sm mb-6 max-w-md mx-auto">
              {instrument.description}
            </p>
          ) : null}
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {NOTES.map((note) => (
            <button 
              type="button" 
              key={note.tag} 
              className="eid-key-note focus:outline-none" 
              onClick={() => onPlayNote(note.freq, 'sine', 1.2)}
            >
              <strong className="text-[#F7EBD2] text-xs md:text-sm font-serif font-bold">{note.name}</strong>
              <span className="text-[9px] md:text-[10px] text-gold/60 font-mono tracking-wider">{note.tag}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Instrument;
