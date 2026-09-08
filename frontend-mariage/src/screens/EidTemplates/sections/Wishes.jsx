import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';

const Wishes = ({ wishes, wishesTitle, isArabic }) => {
  if (!wishes || wishes.length === 0) return null;

  return (
    <motion.section
      id="wishes-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className="eid-luxury-border p-6 md:p-8"
    >
      {/* Corner Ornaments */}
      <div className="eid-ornament-corner eid-ornament-top-left" />
      <div className="eid-ornament-corner eid-ornament-top-right" />
      <div className="eid-ornament-corner eid-ornament-bottom-left" />
      <div className="eid-ornament-corner eid-ornament-bottom-right" />

      <div className="text-center">
        <p className="eid-kicker inline-flex justify-center text-sm tracking-widest font-extrabold text-gold">
          <FiHeart className="mr-2 ml-2 text-lg" /> {wishesTitle || (isArabic ? 'أمنيات العيد' : 'Eid wishes')}
        </p>
        <div className="eid-header-divider" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {wishes.map((wish) => (
          <article className="eid-wish-card flex flex-col justify-between gap-3 text-start" key={wish.id}>
            <div className="eid-ornament-corner eid-ornament-top-left" style={{ width: 8, height: 8 }} />
            <div className="eid-ornament-corner eid-ornament-top-right" style={{ width: 8, height: 8 }} />
            
            <p className="text-[#F7EBD2] text-sm md:text-base leading-relaxed">{wish.text}</p>
            
            {wish.tags && wish.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {wish.tags.map((tag) => (
                  <span key={tag} className="eid-tag text-[10px] md:text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </motion.section>
  );
};

export default Wishes;
