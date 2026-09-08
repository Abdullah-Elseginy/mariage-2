import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';

const Countdown = ({
  isArabic,
  countdownTitle,
  timeLeft,
  countdownCompletedTitle,
  countdownCompletedText,
  avatarTitle,
  countdownPending,
  heroBirthdate
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden rounded-3xl p-4 sm:p-8 md:p-10 text-center border border-white/60 bg-white/95 md:bg-gradient-to-br md:from-white/60 md:via-[#fef8f4]/50 md:to-white/40 backdrop-blur-sm shadow-2xl group romantic-glow select-none text-slate-800"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/10 rounded-full blur-xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-200/10 rounded-full blur-xl opacity-60 pointer-events-none" />
      
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" />
        <div className="absolute top-2/3 right-12 w-2 h-2 bg-rose-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/5 left-1/3 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6a0109] animate-ping" />
          <Sparkles size={18} className="text-[#6a0109] animate-bounce" />
          <h2 className="font-montserrat text-xs md:text-sm text-[#6a0109] uppercase tracking-wider font-extrabold">
            {countdownTitle}
          </h2>
          <Sparkles size={18} className="text-[#6a0109] animate-bounce" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#6a0109] animate-ping" />
        </div>

        {timeLeft.isCompleted ? (
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="py-8 space-y-5"
          >
            <div className="w-36 h-36 mx-auto mb-4 relative">
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl">
                <style>{`
                  @keyframes float-balloon {
                    0%, 100% { transform: translateY(0) rotate(-1deg); }
                    50% { transform: translateY(-3px) rotate(1deg); }
                  }
                  @keyframes happy-cake {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.01) translateY(-1px); }
                  }
                  .balloon-left { animation: float-balloon 8s infinite ease-in-out; transform-origin: 25px 85px; }
                  .balloon-right { animation: float-balloon 10s infinite ease-in-out 1s; transform-origin: 95px 85px; }
                  .happy-cake-svg { animation: happy-cake 6s infinite ease-in-out; transform-origin: 60px 80px; }
                `}</style>
                
                <g className="balloon-left">
                  <path d="M 25 50 C 15 50 15 25 25 25 C 35 25 35 50 25 50 Z" fill="#6a0109" />
                  <path d="M 25 50 L 25 80" stroke="#8b716e" strokeWidth="1" strokeDasharray="2,2" />
                </g>
                <g className="balloon-right">
                  <path d="M 95 45 C 85 45 85 20 95 20 C 105 20 105 45 95 45 Z" fill="#e9c349" />
                  <path d="M 95 45 L 95 75" stroke="#8b716e" strokeWidth="1" strokeDasharray="2,2" />
                </g>

                <g className="happy-cake-svg">
                  <rect x="35" y="70" width="50" height="20" rx="3" fill="#ffe088" />
                  <rect x="42" y="55" width="36" height="15" rx="3" fill="#fecbcb" />
                  <circle cx="48" cy="55" r="3" fill="#6a0109" />
                  <circle cx="60" cy="55" r="3" fill="#6a0109" />
                  <circle cx="72" cy="55" r="3" fill="#6a0109" />
                  <rect x="58" y="42" width="4" height="13" fill="#e9c349" />
                  <circle cx="60" cy="36" r="3" fill="#ff4d6d" className="animate-pulse" />
                </g>
              </svg>
            </div>

            <h3 className="font-display text-3.5xl md:text-4.5xl text-[#6a0109] font-amiri font-bold leading-tight drop-shadow-xs">
              {countdownCompletedTitle}
            </h3>
            <p className="font-sans text-sm md:text-base text-[#7b5455] font-semibold max-w-md mx-auto leading-relaxed">
              {countdownCompletedText}
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col items-center justify-center gap-3 pt-6 border-t border-[#6a0109]/10 mt-6"
            >
              <h4 className="font-amiri text-4xl md:text-5xl text-[#8b1d1d] font-bold tracking-wide drop-shadow-sm leading-normal">
                {isArabic ? `عيد ميلاد سعيد يا ${avatarTitle} 💖` : `Happy Birthday, ${avatarTitle} 💖`}
              </h4>
              <div className="relative w-28 h-28">
                <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-xl opacity-40" />
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-rose-600 fill-none stroke-[2.5] drop-shadow-md">
                  <style>{`
                    @keyframes draw-heart {
                      to { stroke-dashoffset: 0; }
                    }
                    .heart-path-yasmsma {
                      stroke-dasharray: 300;
                      stroke-dashoffset: 300;
                      animation: draw-heart 2s ease-out forwards;
                    }
                  `}</style>
                  <path 
                    className="heart-path-yasmsma" 
                    d="M50 35C50 35 62 17 78 30C93 43 85 70 50 90C15 70 7 43 22 30C38 17 50 35 50 35Z" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Bouncing Birthday Cake */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto drop-shadow-2xl flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <defs>
                  <radialGradient id="gold-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffe088" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#e9c349" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="cake-cream" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffe088" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#ffe088" />
                  </linearGradient>
                  <linearGradient id="cake-pink" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffb3ad" />
                    <stop offset="50%" stopColor="#fecbcb" />
                    <stop offset="100%" stopColor="#ffb3ad" />
                  </linearGradient>
                  <linearGradient id="cake-burgundy" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6a0109" />
                    <stop offset="50%" stopColor="#8b1d1d" />
                    <stop offset="100%" stopColor="#6a0109" />
                  </linearGradient>
                </defs>
                
                <style>{`
                  @keyframes float-up-heart {
                    0% { transform: translateY(0) scale(0.6); opacity: 0; }
                    30% { opacity: 0.85; }
                    100% { transform: translateY(-40px) scale(1.1); opacity: 0; }
                  }
                  @keyframes flicker-flame-grad {
                    0%, 100% { transform: scale(1) rotate(-1deg); }
                    50% { transform: scale(1.15) rotate(2deg); filter: drop-shadow(0 0 6px #ffe088); }
                  }
                  @keyframes swing-balloon-left {
                    0%, 100% { transform: rotate(-5deg) translateY(0); }
                    50% { transform: rotate(5deg) translateY(-4px); }
                  }
                  @keyframes swing-balloon-right {
                    0%, 100% { transform: rotate(4deg) translateY(0); }
                    50% { transform: rotate(-4deg) translateY(-5px); }
                  }
                  @keyframes star-blink {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                  }
                  .flame-anim { animation: flicker-flame-grad 0.8s infinite ease-in-out; }
                  .heart-float-1 { animation: float-up-heart 3s infinite ease-out; }
                  .heart-float-2 { animation: float-up-heart 3.2s infinite ease-out 1s; }
                  .heart-float-3 { animation: float-up-heart 2.8s infinite ease-out 2s; }
                  .balloon-left-sway { animation: swing-balloon-left 4s infinite ease-in-out; transform-origin: 20px 90px; }
                  .balloon-right-sway { animation: swing-balloon-right 4.5s infinite ease-in-out 0.5s; transform-origin: 100px 90px; }
                  .star-svg-1 { animation: star-blink 1.5s infinite alternate; transform-origin: 15px 40px; }
                  .star-svg-2 { animation: star-blink 2s infinite alternate 0.5s; transform-origin: 105px 45px; }
                `}</style>
                
                <circle cx="60" cy="65" r="45" fill="url(#gold-glow)" />

                <g className="star-svg-1">
                  <path d="M 15 40 L 17 43 L 20 40 L 17 37 Z" fill="#ffe088" />
                </g>
                <g className="star-svg-2">
                  <path d="M 105 45 L 107 48 L 110 45 L 107 42 Z" fill="#ffe088" />
                </g>

                <g className="balloon-left-sway">
                  <path d="M 20 50 C 10 50 8 20 20 20 C 32 20 30 50 20 50 Z" fill="#6a0109" opacity="0.85" />
                  <path d="M 20 50 L 17 53 L 23 53 Z" fill="#6a0109" />
                  <path d="M 20 53 Q 12 70 20 90" stroke="#8b716e" strokeWidth="1" fill="none" opacity="0.6" />
                </g>
                
                <g className="balloon-right-sway">
                  <path d="M 100 55 C 90 55 88 25 100 25 C 112 25 110 55 100 55 Z" fill="#e9c349" opacity="0.85" />
                  <path d="M 100 55 L 97 58 L 103 58 Z" fill="#e9c349" />
                  <path d="M 100 58 Q 108 75 100 95" stroke="#8b716e" strokeWidth="1" fill="none" opacity="0.6" />
                </g>

                <path d="M 20 92 L 100 92 Q 106 92 106 94 Q 106 96 100 96 L 20 96 Q 14 96 14 94 Q 14 92 20 92 Z" fill="#e9c349" />

                {/* Bottom Tier */}
                <rect x="26" y="72" width="68" height="20" rx="4" fill="url(#cake-burgundy)" />
                <path d="M 26 72 Q 43 76 60 72 Q 77 68 94 72 L 94 77 Q 77 73 60 77 Q 43 81 26 77 Z" fill="#fecbcb" opacity="0.4" />

                {/* Middle Tier */}
                <rect x="34" y="52" width="52" height="20" rx="3" fill="url(#cake-pink)" />
                <path d="M 34 52 Q 47 55 60 52 Q 73 49 86 52 L 86 56 Q 73 53 60 56 Q 47 59 34 56 Z" fill="#ffffff" opacity="0.6" />

                {/* Top Tier */}
                <rect x="42" y="32" width="36" height="20" rx="3" fill="url(#cake-cream)" />
                <path d="M 42 32 Q 51 35 60 32 Q 69 29 78 32 L 78 36 Q 69 33 60 36 Q 51 39 42 36 Z" fill="#6a0109" opacity="0.25" />

                <circle cx="47" cy="30" r="2.5" fill="#ff4d6d" />
                <circle cx="60" cy="30" r="2.5" fill="#ff4d6d" />
                <circle cx="73" cy="30" r="2.5" fill="#ff4d6d" />

                {/* Left Candle */}
                <rect x="48" y="16" width="3" height="16" rx="0.5" fill="#e9c349" />
                <path className="flame-anim" d="M 49.5 5 C 51 9 52 12 49.5 15 C 47 12 48 9 49.5 5 Z" fill="#ff4d6d" style={{ transformOrigin: '49.5px 16px' }} />
                
                {/* Center Candle */}
                <rect x="58.5" y="12" width="3" height="20" rx="0.5" fill="#6a0109" />
                <path className="flame-anim" d="M 60 1 C 61.5 5 62.5 8 60 11 C 57.5 8 58.5 5 60 1 Z" fill="#ffe088" style={{ transformOrigin: '60px 12px' }} />

                {/* Right Candle */}
                <rect x="69" y="16" width="3" height="16" rx="0.5" fill="#e9c349" />
                <path className="flame-anim" d="M 70.5 5 C 72 9 73 12 70.5 15 C 68 12 69 9 70.5 5 Z" fill="#ff4d6d" style={{ transformOrigin: '70.5px 16px' }} />

                <path className="heart-float-1 text-rose-500 fill-current" d="M 35 15 C 33 12 29 12 27 15 C 25 18 30 22 35 25 C 40 22 45 18 43 15 C 41 12 37 12 35 15 Z" transform="scale(0.5)" style={{ transformOrigin: '35px 15px' }} />
                <path className="heart-float-2 text-rose-400 fill-current" d="M 85 10 C 83 7 79 7 77 10 C 75 13 80 17 85 20 C 90 17 95 13 93 10 C 91 7 87 7 85 10 Z" transform="scale(0.4)" style={{ transformOrigin: '85px 10px' }} />
                <path className="heart-float-3 text-red-500 fill-current" d="M 60 -5 C 58 -8 54 -8 52 -5 C 50 -2 55 2 60 5 C 65 2 70 -2 68 -5 C 66 -8 62 -8 60 -5 Z" transform="scale(0.45)" style={{ transformOrigin: '60px -5px' }} />
              </svg>
            </div>

            <h3 className="font-sans text-lg md:text-2.5xl text-primary font-extrabold leading-relaxed px-4 tracking-normal text-center">
              {countdownPending}
            </h3>
            
            {/* Timer dials */}
            <div className="flex justify-center gap-1.5 xs:gap-2.5 md:gap-4 max-w-md mx-auto pt-2">
              {/* Days Card */}
              <motion.div 
                whileHover={{ scale: 1.08, y: -4 }}
                className="w-14 h-18 xs:w-16 xs:h-20 md:w-20 md:h-24 bg-white/95 md:bg-white/70 rounded-2xl border border-white/60 shadow-lg flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-[3px] bg-[#6a0109]/30" />
                <span className="font-sans font-extrabold text-xl xs:text-2xl md:text-3.5xl text-primary tracking-tighter leading-none">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] xs:text-[10px] md:text-xs text-secondary font-bold font-sans mt-1 md:mt-2 tracking-normal">{isArabic ? 'يوم' : 'Days'}</span>
              </motion.div>
              
              {/* Hours Card */}
              <motion.div 
                whileHover={{ scale: 1.08, y: -4 }}
                className="w-14 h-18 xs:w-16 xs:h-20 md:w-20 md:h-24 bg-white/95 md:bg-white/70 rounded-2xl border border-white/60 shadow-lg flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-[3px] bg-[#ffe088]" />
                <span className="font-sans font-extrabold text-xl xs:text-2xl md:text-3.5xl text-primary tracking-tighter leading-none">
                  {timeLeft.hours}
                </span>
                <span className="text-[9px] xs:text-[10px] md:text-xs text-secondary font-bold font-sans mt-1 md:mt-2 tracking-normal">{isArabic ? 'ساعة' : 'Hours'}</span>
              </motion.div>
              
              {/* Minutes Card */}
              <motion.div 
                whileHover={{ scale: 1.08, y: -4 }}
                className="w-14 h-18 xs:w-16 xs:h-20 md:w-20 md:h-24 bg-white/95 md:bg-white/70 rounded-2xl border border-white/60 shadow-lg flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-[3px] bg-[#ffe088]" />
                <span className="font-sans font-extrabold text-xl xs:text-2xl md:text-3.5xl text-primary tracking-tighter leading-none">
                  {timeLeft.minutes}
                </span>
                <span className="text-[9px] xs:text-[10px] md:text-xs text-secondary font-bold font-sans mt-1 md:mt-2 tracking-normal">{isArabic ? 'دقيقة' : 'Minutes'}</span>
              </motion.div>
              
              {/* Seconds Card */}
              <motion.div 
                whileHover={{ scale: 1.08, y: -4 }}
                className="w-14 h-18 xs:w-16 xs:h-20 md:w-20 md:h-24 bg-white/95 md:bg-white/70 rounded-2xl border border-[#ffe088] shadow-lg flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-[3px] bg-[#6a0109]" />
                <span className="font-sans font-extrabold text-xl xs:text-2xl md:text-3.5xl text-secondary tracking-tighter leading-none animate-[pulse_1s_infinite]">
                  {timeLeft.seconds}
                </span>
                <span className="text-[9px] xs:text-[10px] md:text-xs text-secondary font-bold font-sans mt-1 md:mt-2 tracking-normal">{isArabic ? 'ثانية' : 'Seconds'}</span>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-[#7b5455] font-semibold pt-6 pb-2 w-full text-center select-none">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
              <Calendar size={16} className="text-[#6a0109] shrink-0" />
              <span className="font-sans tracking-wide">{isArabic ? `الموعد المنتظر: ${heroBirthdate}` : `Awaited Date: ${heroBirthdate}`}</span>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Countdown;
