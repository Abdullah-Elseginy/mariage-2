import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { CustomBottom, CustomInput } from '../../../components';

const LockGate = ({
  isArabic,
  isUnlocking,
  attempts,
  passwordInput,
  setPasswordInput,
  passwordError,
  handleUnlock,
  handleFirstInteraction,
  avatarImg,
  avatarTitle,
  recipientName,
  rainParticles,
  setIsMusicPlaying,
  startAmbientMusic,
  audioUrl,
  playHarpPluck
}) => {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <motion.div
      key="lock-page"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="flex-grow flex flex-col items-center justify-center p-4 select-none overflow-x-hidden overflow-y-auto min-h-screen bg-[#12080a] relative"
      onClick={handleFirstInteraction}
      onTouchStart={handleFirstInteraction}
    >
      <div 
        className="absolute inset-0 z-0 opacity-70"
        style={{ backgroundImage: 'radial-gradient(circle at center, #2e0c10 0%, #0d0406 100%)' }}
      />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-900/10 rounded-full blur-xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-900/10 rounded-full blur-xl opacity-60 pointer-events-none" />

      {/* Floating Gateway shimmers */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none opacity-50">
        {rainParticles.slice(0, 24).map((pt) => (
          <div
            key={pt.id}
            className="absolute"
            style={{
              left: `${pt.left}%`,
              top: `-30px`,
              fontSize: `${pt.size + 4}px`,
              animation: `float-petal ease-in-out infinite`,
              animationDuration: `${pt.duration - 3}s`,
              animationDelay: `${pt.delay}s`,
              color: pt.type === 'rose' ? 'rgba(244,63,94,0.3)' : pt.type === 'heart' ? 'rgba(225,29,72,0.3)' : 'rgba(253,224,71,0.25)'
            }}
          >
            {pt.type === 'rose' ? '🌹' : pt.type === 'heart' ? '❤️' : '✨'}
          </div>
        ))}
      </div>

      {/* Heart passcode container */}
      <div className="relative h-[280px] w-full flex items-center justify-center z-20 mb-4 md:mb-8">
        {!isUnlocking ? (
          <motion.div
            key="single-heart"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
            className="text-rose-600 hover:text-rose-500 cursor-pointer drop-shadow-[0_0_20px_rgba(220,38,38,0.7)] z-20"
            onClick={(e) => {
              e.stopPropagation();
              playHarpPluck(329.63, 'sine', 0.8);
              setIsMusicPlaying(true);
              startAmbientMusic(true, audioUrl);
            }}
          >
            <Heart size={150} className="fill-current" />
          </motion.div>
        ) : (
          <div className="relative w-[180px] h-[180px] flex items-center justify-center">
            <motion.div
              initial={{ x: 0, opacity: 1, rotate: 0 }}
              animate={{ x: -140, opacity: 0, rotate: -25 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="absolute text-rose-600 w-[180px] h-[180px] flex items-center justify-center z-20 pointer-events-none"
              style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
            >
              <Heart size={150} className="fill-current" />
            </motion.div>

            <motion.div
              initial={{ x: 0, opacity: 1, rotate: 0 }}
              animate={{ x: 140, opacity: 0, rotate: 25 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="absolute text-rose-600 w-[180px] h-[180px] flex items-center justify-center z-20 pointer-events-none"
              style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
            >
              <Heart size={150} className="fill-current" />
            </motion.div>

            <motion.div
              initial={{ scale: 0.1, y: 80, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, y: -10, opacity: 1, rotate: 3 }}
              transition={{ delay: 0.3, duration: 1.3, ease: 'backOut' }}
              className="absolute bg-[linear-gradient(180deg,#fff8f6_0%,#f3e3cd_100%)] p-3.5 pb-6 rounded-[28px] shadow-xl border border-[#f7d8cd] w-[200px] md:w-[240px] z-30 flex flex-col items-center select-none romantic-glow text-slate-800"
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#f5dfa0]/70 backdrop-blur-xs border-x border-[#f1d486]/60 transform rotate-1 shadow-sm opacity-90 pointer-events-none" />

              <div className="aspect-square w-full rounded-[22px] overflow-hidden bg-[#fff6f3] relative border border-[#f0d4c4] mb-3.5 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                {avatarImg && !avatarError ? (
                  <img 
                    className="w-full h-full object-cover animate-fade-in" 
                    src={avatarImg} 
                    alt={recipientName} 
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center select-none"
                    style={{ 
                      background: 'radial-gradient(circle, #fff8f4 0%, #f4dccf 100%)',
                    }}
                  >
                    <span 
                      className="text-6xl font-bold italic text-[#8a1f2d]"
                      style={{ 
                        fontFamily: "'Playfair Display', 'Georgia', serif",
                        opacity: 0.85
                      }}
                    >
                      {recipientName ? recipientName.charAt(0).toUpperCase() : 'M'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#6a0109]/10 to-transparent pointer-events-none" />
              </div>
              
              <div className="text-center font-display text-base text-[#7d1626] default-recipient-name">
                {avatarTitle} 💖
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Input Passcode Form */}
      {!isUnlocking && (
        <motion.form
          key={attempts}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: attempts > 0 ? [-10, 10, -10, 10, -5, 5, 0] : 0
          }}
          transition={{ 
            x: { type: 'spring', stiffness: 350, damping: 12 },
            delay: attempts > 0 ? 0 : 0.3
          }}
          onSubmit={handleUnlock}
          className="w-full max-w-xs space-y-4 text-center z-10 px-4"
        >
          <div className="space-y-2">
            <label className="text-xs font-semibold text-rose-300/90 font-sans block">
              {isArabic ? 'اكتب تاريخ ذكرى مميزة جداً لينا.. 💖' : 'Enter the date of our special anniversary.. 💖'}
            </label>
            <CustomInput
              name="passwordInput"
              placeholder={isArabic ? 'أدخل كلمة السر' : 'Enter password code'}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onFocus={handleFirstInteraction}
              onKeyDown={handleFirstInteraction}
              inputClassName="text-center bg-white/5 border-white/20 text-white placeholder:text-neutral-500 rounded-full focus:ring-rose-500/20 py-3.5 focus:border-rose-400"
            />
            {passwordError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-semibold text-rose-300 leading-normal pt-1"
              >
                {passwordError}
              </motion.p>
            )}
          </div>

          <CustomBottom
            text={isArabic ? 'فتح بوابة الحب 🔑' : 'Unlock Gateway 🔑'}
            type="submit"
            buttonStyles="w-full py-3.5 bg-rose-700 hover:bg-rose-600 text-white rounded-full font-bold text-xs tracking-wider shadow-lg hover:scale-102 transition"
          />
        </motion.form>
      )}
    </motion.div>
  );
};

export default LockGate;
