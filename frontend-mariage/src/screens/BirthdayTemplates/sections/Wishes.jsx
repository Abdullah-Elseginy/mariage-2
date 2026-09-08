import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Heart } from 'lucide-react';

const Wishes = ({
  isArabic,
  wishesTitle,
  typewriterText,
  wishes,
  currentWishIndex
}) => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-primary text-on-primary rounded-3xl p-5 sm:p-8 md:p-12 shadow-xl relative overflow-hidden group romantic-glow"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none">
        <Heart className="text-[180px] rotate-12 fill-current" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-tertiary-fixed animate-bounce" />
            <h2 className="font-montserrat text-xs text-tertiary-fixed uppercase tracking-wider font-semibold">
              {wishesTitle}
            </h2>
          </div>
          
          <span className="text-[11px] bg-white/12 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-default select-none animate-pulse">
            ✨ {isArabic ? 'أمنية خاصة مهدية لكِ' : 'A wish dedicated to you'}
          </span>
        </div>

        <div className="min-h-[105px] md:min-h-[75px] flex items-center text-start justify-start">
          <p 
            className="font-display text-xl md:text-2.5xl leading-relaxed font-amiri text-white typewriter-text px-1 transition-all duration-300 w-full"
            style={{ textShadow: '0 0 12px rgba(255, 224, 136, 0.65)' }}
          >
            {typewriterText}
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2.5 select-none">
          {Array.isArray(wishes[currentWishIndex]?.tags) && wishes[currentWishIndex].tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 text-xs bg-white/8 hover:bg-white/15 px-3 py-1.5 rounded-full text-white transition-colors cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Wishes;
