import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { CustomBottom } from '../../../components';

const Hero = ({ displayNames, cover, hero, wishesLength, momentsLength, isArabic }) => {
  return (
    <motion.section
      id="hero-section"
      initial={{ opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="eid-section-stack"
      style={{ borderTop: 0, paddingTop: 0 }}
    >
      <div className="eid-hero">
        <img src={cover} alt={hero.title || 'Eid'} />
        <div className="eid-vignette" />
        <div className="eid-hero-card">
          <div className="eid-luxury-border eid-hero-card-inner">
            {/* Elegant Arabesque Corners */}
            <div className="eid-ornament-corner eid-ornament-top-left" />
            <div className="eid-ornament-corner eid-ornament-top-right" />
            <div className="eid-ornament-corner eid-ornament-bottom-left" />
            <div className="eid-ornament-corner eid-ornament-bottom-right" />

            <FiStar className="eid-spark-icon text-xl md:text-2xl" />
            
            <div className="w-full">
              <h1 className="eid-title text-2xl md:text-4xl text-[#F7EBD2] tracking-wide font-bold">{displayNames}</h1>
              <div className="eid-header-divider" />
            </div>

            {hero.kicker ? (
              <p className="eid-kicker text-xs md:text-sm tracking-widest font-extrabold text-gold" style={{ justifyContent: 'center' }}>
                {hero.kicker}
              </p>
            ) : null}
            
            {hero.title ? (
              <h2 className="text-xl md:text-2xl font-bold font-serif text-[#F7EBD2] my-1 text-center">
                {hero.title}
              </h2>
            ) : null}

            {hero.subtitle ? (
              <p className="eid-hero-quote text-sm md:text-base italic text-[#F7EBD2]/80 text-center max-w-sm">
                "{hero.subtitle}"
              </p>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4 justify-center">
              {wishesLength ? (
                <CustomBottom
                  text={hero.primary_button || (isArabic ? 'قراءة الأمنيات' : 'Read wishes')}
                  onClick={() => document.getElementById('wishes-section')?.scrollIntoView({ behavior: 'smooth' })}
                  buttonStyles="bg-gradient-to-r from-gold via-[#f0cf83] to-gold text-[#0B0A10] border-none font-bold hover:opacity-95 transition-all duration-300 shadow-[0_0_20px_rgba(214,177,92,0.3)] hover:scale-[1.02]"
                  styles="w-full sm:w-auto"
                />
              ) : null}
              {momentsLength ? (
                <CustomBottom
                  text={hero.secondary_button || (isArabic ? 'استعراض الذكريات' : 'Explore memories')}
                  onClick={() => document.getElementById('moments-section')?.scrollIntoView({ behavior: 'smooth' })}
                  buttonStyles="bg-[#181320]/80 text-gold border border-gold/30 hover:border-gold hover:bg-[#181320] font-semibold transition-all duration-300 hover:scale-[1.02]"
                  styles="w-full sm:w-auto"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
