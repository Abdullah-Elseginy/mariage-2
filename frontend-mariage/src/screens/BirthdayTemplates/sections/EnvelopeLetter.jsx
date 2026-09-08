import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const EnvelopeLetter = ({
  isArabic,
  loveLetterBg,
  isEnvelopeOpen,
  setIsEnvelopeOpen,
  playChimeCascade,
  letterTitle,
  letterDesc,
  letterSubject,
  letterContent,
  letterLovePhrase
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl p-4 sm:p-8 md:p-12 text-start shadow-2xl border border-white/50 bg-[#12080a] min-h-[420px] flex items-center justify-center"
      style={{
        backgroundImage: `url(${loveLetterBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] z-0" />

      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-80">
        <span className="absolute text-rose-500/20 text-4xl top-8 left-12 select-none animate-pulse">💖</span>
        <span className="absolute text-rose-400/25 text-3xl bottom-12 right-20 select-none animate-bounce" style={{ animationDelay: '1s' }}>💗</span>
        <span className="absolute text-yellow-300/30 text-2xl top-1/3 right-1/4 select-none animate-ping">✦</span>
      </div>

      <div className="relative z-20 w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isEnvelopeOpen ? (
            <motion.div
              key="envelope-closed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md bg-gradient-to-b from-[#4a0b12]/95 to-[#1a0205]/98 border-2 border-[#ffe088]/60 p-5 sm:p-8 md:p-10 rounded-3xl text-center shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col items-center gap-6 group"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-[#ffe088]/80 to-transparent" />
              
              <div className="w-20 h-20 rounded-full bg-[#120406]/85 border-2 border-[#ffe088]/40 flex items-center justify-center shadow-inner relative mb-2">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  onClick={() => {
                    setIsEnvelopeOpen(true);
                    playChimeCascade();
                  }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 flex items-center justify-center shadow-lg shadow-rose-600/40 border border-rose-400 cursor-pointer focus:outline-none"
                  title={isArabic ? 'اضغطي لفتح الرسالة' : 'Click to open the message'}
                >
                  <Heart size={24} className="text-white fill-white" />
                </motion.button>
              </div>

              <div className="space-y-2 select-none">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#ffe088] font-amiri tracking-wide leading-normal">
                  {letterTitle}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed px-4">
                  {letterDesc}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="envelope-opened"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="w-full max-w-xl bg-gradient-to-b from-[#1c070b]/96 to-[#0e0305]/98 border-2 border-[#ffe088]/80 p-5 sm:p-10 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative text-start space-y-6 overflow-hidden"
            >
              {/* Gold corners decoration */}
              <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 w-3.5 h-3.5 sm:w-5 sm:h-5 border-t-2 border-l-2 border-[#ffe088]/80 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-3.5 h-3.5 sm:w-5 sm:h-5 border-t-2 border-r-2 border-[#ffe088]/80 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 w-3.5 h-3.5 sm:w-5 sm:h-5 border-b-2 border-l-2 border-[#ffe088]/80 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 w-3.5 h-3.5 sm:w-5 sm:h-5 border-b-2 border-r-2 border-[#ffe088]/80 rounded-br-sm pointer-events-none" />

              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-0 justify-between items-center border-b border-[#ffe088]/20 pb-4 mb-2 select-none">
                <button
                  onClick={() => setIsEnvelopeOpen(false)}
                  className="text-[10px] sm:text-xs text-rose-300/80 hover:text-rose-300 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-rose-300/20 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span>{isArabic ? 'إعادة غلق الرسالة ✉️' : 'Re-close envelope ✉️'}</span>
                </button>
                <span className="font-montserrat text-[9px] sm:text-[10px] text-[#ffe088] font-bold tracking-widest uppercase text-center">
                  {isArabic ? 'PRIVATE LETTER • رسالة خاصة' : 'PRIVATE LETTER • SECRET'}
                </span>
              </div>

              <div className="space-y-4 font-display leading-relaxed text-[#fecbcb] text-start font-amiri text-sm sm:text-base md:text-lg">
                <p className="text-xl sm:text-2.5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ffe088] via-white to-[#ffe088] font-bold text-center leading-normal mb-6" style={{ textShadow: '0 2px 10px rgba(255,224,136,0.3)' }}>
                  {letterSubject}
                </p>
                
                <div className="text-neutral-200 indent-4 whitespace-pre-line leading-relaxed text-start" dir={isArabic ? 'rtl' : 'ltr'}>
                  {letterContent}
                </div>
                
                <div className="pt-6 border-t border-[#ffe088]/20 text-center select-none">
                  <motion.p 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-xl sm:text-3xl text-rose-400 font-extrabold leading-none tracking-widest pt-2 font-display"
                  >
                    {letterLovePhrase}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default EnvelopeLetter;
