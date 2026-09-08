import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const CelebrationReveal = ({ recipientName, isArabic, onComplete, variant = 'romantic' }) => {
  const [progress, setProgress] = useState(0);
  const isNeon = variant === 'neon';

  // Maintain reference to the callback to prevent resets on parent state updates (e.g. typewriter)
  const onCompleteRef = useRef(onComplete);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // 1. Initial smooth explosion from the center with a slight delay to allow smooth mount transition
    const confettiTimer = setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: isNeon
          ? ['#00f5ff', '#8b5cf6', '#f472b6', '#34d399', '#ffffff']
          : ['#ff007f', '#00f5ff', '#ffeb3b', '#e040fb', '#ffffff'],
        disableForced3d: true
      });
    }, 150);

    // 2. Smooth 60fps countdown progress calculation based on elapsed time (6 seconds duration)
    const startTime = Date.now();
    const duration = 6000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, 30);

    return () => {
      clearTimeout(confettiTimer);
      clearInterval(interval);
    };
  }, [isNeon]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 overflow-hidden select-none text-white ${isNeon ? 'bg-[#05070f]' : 'bg-[#090305]'}`}
    >
      {/* Background Glowing Orbs (Uses radial gradient circles instead of GPU-heavy CSS blurs) */}
      <div 
        className="absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: isNeon
            ? 'radial-gradient(circle at center, #15112f 0%, #05070f 72%)'
            : 'radial-gradient(circle at center, #230811 0%, #050103 100%)'
        }}
      />
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full opacity-60 pointer-events-none" 
        style={{
          background: isNeon
            ? 'radial-gradient(circle, rgba(0,245,255,0.16) 0%, rgba(0,245,255,0) 70%)'
            : 'radial-gradient(circle, rgba(244,63,94,0.12) 0%, rgba(244,63,94,0) 70%)'
        }}
      />
      <div 
        className="absolute bottom-1/4 left-1/4 w-[280px] h-[280px] rounded-full opacity-40 pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, rgba(6,182,212,0) 70%)' }}
      />

      {/* Celebration Content */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-lg w-full px-6">
        
        {/* Heart & Cake Animation Box */}
        <div className="relative flex items-center justify-center mb-8 h-48 w-full">
          {/* Beating background Heart (Optimized: no blur filters) */}
          <motion.div
            animate={{ 
              scale: [1, 1.08, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: 'easeInOut' 
            }}
            className={`absolute pointer-events-none ${isNeon ? 'text-violet-500/15' : 'text-rose-600/10'}`}
          >
            <Heart size={220} className="fill-current" />
          </motion.div>

          {/* Glowing Cake SVG */}
          <motion.div
            initial={{ scale: 0.5, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 }}
            className="relative z-10"
          >
            <svg width="180" height="180" viewBox="0 0 120 120" className={isNeon ? 'drop-shadow-[0_0_24px_rgba(0,245,255,0.42)]' : 'drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]'}>
              <defs>
                <linearGradient id="standGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
                <linearGradient id="tier1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isNeon ? '#00f5ff' : '#fb7185'} />
                  <stop offset="100%" stopColor={isNeon ? '#2563eb' : '#e11d48'} />
                </linearGradient>
                <linearGradient id="tier2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isNeon ? '#a78bfa' : '#fecdd3'} />
                  <stop offset="100%" stopColor={isNeon ? '#7c3aed' : '#fda4af'} />
                </linearGradient>
                <linearGradient id="creamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isNeon ? '#ecfeff' : '#ffffff'} />
                  <stop offset="100%" stopColor={isNeon ? '#c4b5fd' : '#fff1f2'} />
                </linearGradient>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(253, 224, 71, 0.8)" />
                  <stop offset="40%" stopColor="rgba(249, 115, 22, 0.4)" />
                  <stop offset="100%" stopColor="rgba(249, 115, 22, 0)" />
                </radialGradient>
              </defs>

              {/* Stand/Plate */}
              <ellipse cx="60" cy="98" rx="42" ry="7" fill="url(#standGrad)" />
              <path d="M 60 98 L 60 108 M 45 108 L 75 108" stroke="url(#standGrad)" strokeWidth="4" strokeLinecap="round" />
              <ellipse cx="60" cy="99" rx="35" ry="3" fill="#94a3b8" opacity="0.3" />

              {/* Lower Tier (Base Cake) */}
              <path d="M 28 65 L 28 92 Q 28 96 32 96 L 88 96 Q 92 96 92 92 L 92 65 Z" fill="url(#tier1Grad)" />
              <path d="M 28 65 Q 33 72 38 65 Q 43 75 48 65 Q 53 72 58 65 Q 63 78 68 65 Q 73 70 78 65 Q 83 75 88 65 Q 92 69 92 65 L 92 58 L 28 58 Z" fill="url(#creamGrad)" />
              {/* Confetti sprinkles on cream */}
              <circle cx="34" cy="62" r="1.2" fill="#38bdf8" />
              <circle cx="46" cy="63" r="1.2" fill="#a78bfa" />
              <circle cx="58" cy="62" r="1.2" fill="#facc15" />
              <circle cx="70" cy="63" r="1.2" fill="#4ade80" />
              <circle cx="82" cy="62" r="1.2" fill="#fb7185" />

              {/* Upper Tier */}
              <path d="M 38 38 L 38 58 L 82 58 L 82 38 Z" fill="url(#tier2Grad)" />
              <path d="M 38 38 Q 42 45 46 38 Q 50 48 54 38 Q 58 44 62 38 Q 66 46 70 38 Q 74 42 78 38 Q 82 43 82 38 L 82 32 L 38 32 Z" fill="url(#creamGrad)" />
              {/* Cherry decorations */}
              <circle cx="40" cy="31" r="3" fill={isNeon ? '#f472b6' : '#be123c'} />
              <circle cx="40" cy="30" r="1" fill={isNeon ? '#fbcfe8' : '#fda4af'} opacity="0.7" />
              <circle cx="60" cy="31" r="3" fill={isNeon ? '#f472b6' : '#be123c'} />
              <circle cx="60" cy="30" r="1" fill={isNeon ? '#fbcfe8' : '#fda4af'} opacity="0.7" />
              <circle cx="80" cy="31" r="3" fill={isNeon ? '#f472b6' : '#be123c'} />
              <circle cx="80" cy="30" r="1" fill={isNeon ? '#fbcfe8' : '#fda4af'} opacity="0.7" />

              {/* Candles */}
              {/* Candle 1 (Left) */}
              <rect x="47" y="16" width="3.5" height="16" fill="#60a5fa" rx="1" />
              <path d="M 47 20 L 50.5 23" stroke="#2563eb" strokeWidth="0.8" />
              <path d="M 47 26 L 50.5 29" stroke="#2563eb" strokeWidth="0.8" />
              <line x1="48.75" y1="16" x2="48.75" y2="12" stroke="#475569" strokeWidth="1" />
              <motion.path 
                animate={{ scale: [1, 1.15, 0.95, 1], y: [0, -0.8, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
                d="M 48.75 4 C 47.5 8 47.5 11 48.75 13 C 50 11 50 8 48.75 4 Z" 
                fill="url(#goldGrad)" 
              />
              <circle cx="48.75" cy="8" r="8" fill="url(#glow)" opacity="0.4" pointerEvents="none" />

              {/* Candle 2 (Right) */}
              <rect x="69.5" y="16" width="3.5" height="16" fill="#a78bfa" rx="1" />
              <path d="M 69.5 20 L 73 23" stroke="#7c3aed" strokeWidth="0.8" />
              <path d="M 69.5 26 L 73 29" stroke="#7c3aed" strokeWidth="0.8" />
              <line x1="71.25" y1="16" x2="71.25" y2="12" stroke="#475569" strokeWidth="1" />
              <motion.path 
                animate={{ scale: [1, 0.9, 1.12, 1], y: [0, -1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
                d="M 71.25 4 C 70 8 70 11 71.25 13 C 72.5 11 72.5 8 71.25 4 Z" 
                fill="url(#goldGrad)" 
              />
              <circle cx="71.25" cy="8" r="8" fill="url(#glow)" opacity="0.4" pointerEvents="none" />
            </svg>
          </motion.div>
        </div>

        {/* Happy Birthday Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.3 }}
          className="space-y-4"
        >
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isNeon ? 'bg-cyan-400/10 border border-cyan-300/30 text-cyan-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}`}>
            <Sparkles size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
            {isArabic ? 'بوابة الاحتفال السعيد' : 'Celebration Gateway Active'}
          </div>

          <h1 
            className="text-4xl sm:text-5xl font-black tracking-tight leading-tight uppercase font-display"
            style={{ 
              textShadow: isNeon ? '0 0 18px rgba(139,92,246,0.55)' : '0 0 10px rgba(244,63,94,0.4)',
              fontFamily: isArabic ? "'Cairo', sans-serif" : "'Outfit', sans-serif"
            }}
          >
            {isArabic ? (
              <>
                عيد ميلاد سعيد <br />
                <span className="text-[#00f5ff] font-extrabold">{recipientName}</span> 💖
              </>
            ) : (
              <>
                Happy Birthday <br />
                <span className="text-[#00f5ff] font-extrabold">{recipientName}</span> 💖
              </>
            )}
          </h1>

          <p 
            className={`text-sm font-light max-w-sm mx-auto ${isNeon ? 'text-cyan-100/80' : 'text-rose-200'}`}
            style={{ fontFamily: isArabic ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}
          >
            {isArabic 
              ? 'تتفتح لكِ بوابات الحب الآن لمشاهدة تهنئتك الخاصة ولحظاتنا الجميلة معاً... 🌹' 
              : 'The gates of love are unfolding to show your personalized greeting and our beautiful moments together... 🌹'
            }
          </p>
        </motion.div>

        {/* Progress bar / Auto redirect timer */}
        <div className="w-full mt-10 flex flex-col items-center justify-center space-y-4">
          
          {/* Normal Sleek Progress Bar (6 seconds) */}
          <div className="w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden relative border border-white/5">
            <div 
              className={`h-full rounded-full transition-all duration-75 ease-out ${isNeon ? 'bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-400 shadow-[0_0_14px_rgba(0,245,255,0.72)]' : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.7)]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Glowing Vibrant Hearts underneath */}
          <div className="flex items-center justify-center gap-3.5 py-1">
            {[...Array(5)].map((_, i) => {
              // Create a sequential pulsing wave effect for the vibrant hearts
              const isPulse = Math.floor(progress / 20) === i;
              return (
                <motion.svg
                  key={i}
                  viewBox="0 0 24 24"
                  className={`w-7 h-7 fill-current ${isNeon ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]' : 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.75)]'}`}
                  animate={isPulse ? { scale: [1, 1.25, 1], filter: 'drop-shadow(0 0 14px rgba(244,63,94,0.95))' } : { scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </motion.svg>
              );
            })}
          </div>

          {/* Percentage Indicator */}
          <div className="text-lg font-black tracking-widest text-[#00f5ff] drop-shadow-[0_0_10px_rgba(0,245,255,0.4)]">
            {Math.round(progress)}%
          </div>

          <div className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] select-none">
            {isArabic ? 'جاري فتح التهنئة تلقائياً...' : 'Entering greeting automatically...'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CelebrationReveal;
