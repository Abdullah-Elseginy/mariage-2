import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { CustomBottom } from '../../../components';

const Hero = ({
  isArabic,
  bannerImg,
  isMusicPlaying,
  recipientName,
  heroBirthdate,
  heroQuote,
  handleSendLovePulse,
  heroKicker,
  avatarImg,
  avatarTitle,
  avatarSubtitle,
  onPolaroidClick
}) => {
  return (
    <motion.div
      id="hero-section"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="space-y-8"
    >
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative min-h-[600px] md:h-[620px] w-full rounded-3xl overflow-hidden shadow-2xl group flex flex-col justify-center items-center p-4 md:p-8"
      >
        <div className="absolute inset-0 z-0 bg-[#1a0204]">
          {bannerImg ? (
            <img
              alt="Birthday Celebration Background"
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              src={bannerImg}
            />
          ) : null}
          <div className="absolute inset-0 hero-vignette bg-gradient-to-t from-background via-black/10 to-black/35" />
        </div>

        {/* Equalizer bars */}
        {isMusicPlaying && (
          <div className="absolute top-5 left-5 z-20 flex items-end gap-1 px-3 py-2 rounded-xl bg-black/30 backdrop-blur-sm pointer-events-none">
            <div className="w-1 bg-[#e9c349] h-4 animate-[bounce_0.6s_infinite_alternate]" />
            <div className="w-1 bg-[#ffe088] h-6 animate-[bounce_0.75s_infinite_60ms_alternate]" />
            <div className="w-1 bg-[#e9c349] h-3 animate-[bounce_0.5s_infinite_120ms_alternate]" />
            <div className="w-1 bg-white h-5 animate-[bounce_0.8s_infinite_180ms_alternate]" />
          </div>
        )}

        {/* Central Glass Card */}
        <div className="z-10 w-full flex items-center justify-center py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -8, 0] 
            }}
            transition={{
              initial: { duration: 0.8 },
              y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
            }}
            className="glass-card hero-main-card w-full max-w-sm p-6 md:p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-4 md:gap-5 relative overflow-hidden text-center border border-white/60 romantic-glow text-slate-800"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ffe088]/60 to-transparent" />
            
            <Sparkles className="text-amber-500 text-4xl animate-pulse" />

            <div className="space-y-1 select-none flex flex-col items-center w-full">
              <motion.h1
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6a0109] via-[#8b1d1d] to-[#6a0109] text-4xl xs:text-5xl md:text-6xl tracking-tight leading-normal drop-shadow-sm text-center truncate max-w-full default-recipient-name"
              >
                {recipientName}
              </motion.h1>
              <div className="w-16 h-[2.5px] bg-gradient-to-r from-transparent via-[#6a0109]/40 to-transparent mx-auto rounded-full mb-1" />
              
              {/* Luxury Badge */}
              <div className="relative inline-flex flex-col items-center mt-1.5">
                <div className="absolute -top-3.5 flex gap-5 pointer-events-none">
                  <span className="text-[9px] animate-ping text-yellow-500">✦</span>
                  <span className="text-[9px] animate-ping text-yellow-500" style={{ animationDelay: '0.5s' }}>✦</span>
                </div>
                
                <div className="px-4 py-2 bg-[#ffe088]/20 border border-[#e9c349]/50 rounded-2xl shadow-sm flex items-center gap-2 transition-transform duration-300 hover:scale-105">
                  <span className="text-sm">👑</span>
                  <span className="font-sans text-xs text-[#6a0109] font-extrabold tracking-widest leading-none">
                    {heroBirthdate}
                  </span>
                  <span className="text-xs animate-bounce">🎂</span>
                </div>
              </div>
            </div>

            <motion.p 
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="font-display text-lg md:text-xl text-on-surface-variant italic leading-relaxed px-2 font-amiri"
            >
              {heroQuote}
            </motion.p>

            <div className="flex flex-col gap-3 w-full max-w-[220px]">
              <CustomBottom
                text={isArabic ? 'أرسل حبي' : 'Send Love'}
                onClick={handleSendLovePulse}
                rightIcon={<Heart size={14} className="fill-white" />}
                buttonStyles="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-full font-bold text-xs tracking-widest hover:shadow-lg active:scale-95 shadow-md flex items-center justify-center gap-2"
              />
            </div>
          </motion.div>
        </div>

        {/* Date badge */}
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 text-white/95">
          <div className="flex items-center gap-2 bg-black/75 md:bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-sans">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{heroKicker}</span>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Polaroid Sticker */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        whileHover={{ scale: 1.03, rotate: 1, transition: { duration: 0.3 } }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className={`polaroid-sticker-card bg-white p-5 pb-9 rounded-3xl shadow-xl border border-outline-variant/25 max-w-sm mx-auto transform -rotate-2 relative group hover:shadow-2xl transition-all duration-350 overflow-hidden sticker-glow select-none romantic-glow text-slate-800 ${avatarImg ? 'cursor-zoom-in' : 'cursor-default'}`}
        onClick={onPolaroidClick}
      >
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-28 h-7 bg-amber-200/40 backdrop-blur-xs border-x border-amber-300/30 transform -rotate-1 shadow-sm opacity-80 pointer-events-none" />

        <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-[#6a0109] rounded-full flex items-center justify-center shadow-md animate-heart-pulse">
          <Heart size={14} className="fill-white text-white" />
        </div>

        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#fef8f4] mb-5 border border-[#efd2c3] relative shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          {avatarImg ? (
            <img
              className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
              src={avatarImg}
              alt={recipientName}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,_#fef8f4_0%,_#fcdcd7_100%)]">
              <span
                className="text-6xl font-bold italic text-[#6a0109]"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif", opacity: 0.85 }}
              >
                {recipientName ? recipientName.charAt(0).toUpperCase() : 'B'}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#6a0109]/10 to-transparent pointer-events-none" />
        </div>

        <div className="text-center space-y-1">
          <p className="font-display text-2xl text-[#6a0109] font-bold font-amiri tracking-wide">
            {avatarTitle}
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-secondary font-semibold">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>{avatarSubtitle}</span>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Hero;
