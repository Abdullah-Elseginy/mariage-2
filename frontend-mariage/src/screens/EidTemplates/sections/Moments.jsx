import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiStar } from 'react-icons/fi';

const Moments = ({ moments, momentsTitle, isArabic, onPhotoClick }) => {
  if (!moments || moments.length === 0) return null;

  return (
    <motion.section
      id="moments-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className="eid-section-stack"
    >
      <div className="text-center">
        <p className="eid-mini-kicker inline-flex justify-center text-sm tracking-widest font-extrabold text-gold">
          <FiStar className="mr-2 ml-2 text-lg animate-spin-slow" /> {momentsTitle || (isArabic ? 'ذكريات العيد' : 'Eid memories')}
        </p>
        <div className="eid-header-divider" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {moments.map((moment, index) => (
          <article key={moment.id} className="eid-polaroid-frame flex flex-col">
            <button 
              type="button" 
              className="eid-polaroid-img-wrapper w-full cursor-zoom-in relative focus:outline-none"
              onClick={() => onPhotoClick(moment.imageUrl)}
            >
              <img src={moment.imageUrl} alt={moment.title} />
              
              {moment.category ? (
                <span className="absolute top-3 right-3 bg-[#0B0A10]/90 border border-gold/40 text-gold text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                  {moment.category}
                </span>
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0B13]/40 to-transparent pointer-events-none" />
            </button>
            
            <div className="flex flex-col flex-1 px-1">
              <div className="flex items-center justify-between text-gold text-xs font-bold mb-2">
                {moment.date ? (
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="text-gold" /> {moment.date}
                  </span>
                ) : <span />}
                <span className="opacity-80 font-mono">#{String(index + 1).padStart(2, '0')}</span>
              </div>
              
              <h4 className="text-[#F7EBD2] text-lg font-serif font-bold mb-1 text-start">{moment.title}</h4>
              <p className="text-[#F7EBD2]/70 text-xs md:text-sm leading-relaxed text-start">{moment.description}</p>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
};

export default Moments;
