import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, VolumeX, Heart, ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react';
import CelebrationReveal from '../../sections/CelebrationReveal';

import './index.css';

// ─── YouTube helpers ──────────────────────────────────────────────────────────
const getYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// ─── Audio helpers ────────────────────────────────────────────────────────────
let neonAudioCtx = null;
function getNeonAudioContext() {
  if (!neonAudioCtx) {
    neonAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return neonAudioCtx;
}
function playNeonTone(frequency, duration = 0.5, type = 'sine') {
  try {
    const ctx = getNeonAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio context error:', e);
  }
}
function playUnlockSequence() {
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, i) => setTimeout(() => playNeonTone(freq, 0.4, 'triangle'), i * 100));
}
function playErrorTone() {
  playNeonTone(200, 0.3, 'sawtooth');
}

// ─── Native audio management ──────────────────────────────────────────────────
let neonBgAudio = null;
let neonCurrentUrl = null;
function initNeonAudio(url) {
  if (getYouTubeId(url)) { if (neonBgAudio) { neonBgAudio.pause(); neonBgAudio = null; } return; }
  if (neonBgAudio && neonCurrentUrl === url) return;
  if (neonBgAudio) neonBgAudio.pause();
  if (url) {
    neonBgAudio = new Audio(url);
    neonBgAudio.loop = true;
    neonBgAudio.volume = 0.35;
    neonCurrentUrl = url;
  } else {
    neonBgAudio = null; neonCurrentUrl = null;
  }
}
function playNeonAudio(url) {
  if (getYouTubeId(url)) return;
  initNeonAudio(url);
  if (neonBgAudio) neonBgAudio.play().catch(() => {});
}

// ─── Particle generator ───────────────────────────────────────────────────────
function generateParticles(count = 18) {
  const colors = ['cyan', 'violet', 'pink'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 5 + 3,
    delay: Math.random() * 12,
    duration: Math.random() * 10 + 8,
    color: colors[i % 3],
    drift: (Math.random() - 0.5) * 80,
  }));
}

// ─── Fallback assets ──────────────────────────────────────────────────────────
const FALLBACK_PHOTOS = [];
const EMPTY_ARRAY = [];

// ─── Flexible Passcode Validation Matcher ──────────────────────────────────────
function isPasscodeMatch(input, correct) {
  const normalize = (str) => {
    return String(str || '')
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
      .replace(/\D/g, '');
  };

  const cleanInput = normalize(input);
  const cleanCorrect = normalize(correct);

  if (cleanInput === cleanCorrect) return true;

  const removeLeadingZeros = (s) => {
    if (s.length >= 6) {
      const year = s.substring(s.length - 4);
      let dayMonth = s.substring(0, s.length - 4);
      
      if (dayMonth.startsWith('0')) {
        dayMonth = dayMonth.substring(1);
      }
      if (dayMonth.length > 2 && dayMonth.charAt(dayMonth.length - 2) === '0') {
        dayMonth = dayMonth.substring(0, dayMonth.length - 2) + dayMonth.substring(dayMonth.length - 1);
      }
      if (dayMonth.startsWith('0')) {
        dayMonth = dayMonth.substring(1);
      }
      return dayMonth + year;
    }
    return s;
  };

  if (removeLeadingZeros(cleanInput) === removeLeadingZeros(cleanCorrect)) return true;
  if (removeLeadingZeros(cleanInput) === cleanCorrect) return true;
  if (cleanInput === removeLeadingZeros(cleanCorrect)) return true;

  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  NeonBirthdayTemplate
// ═══════════════════════════════════════════════════════════════════════════════
const NeonBirthdayTemplate = ({ greeting }) => {
  const isArabic = greeting?.locale === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  const inputRef = useRef(null);
  const iframeRef = useRef(null);
  const [isShaking, setIsShaking] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  // ── Unpack content ──────────────────────────────────────────────────────────
  const content = greeting?.content || {};
  const basic   = content.basic   || {};
  const hero    = content.hero    || {};
  const countdown = content.countdown || {};
  const wishesList = Array.isArray(content.wishes?.items) ? content.wishes.items : EMPTY_ARRAY;
  const album   = content.album   || {};
  const letter  = content.letter  || {};
  const audio   = content.audio   || {};
  const footer  = content.footer  || {};

  const recipientName  = greeting?.recipient_name || 'You';
  const senderName     = greeting?.sender_name    || 'With Love';
  const passcode       = String(basic.passcode || '942026');
  const audioUrl       = audio.url || '';
  const youtubeId      = useMemo(() => getYouTubeId(audioUrl), [audioUrl]);

  const heroKicker     = hero.kicker    || (isArabic ? `🎂 احتفالاً بك يا ${recipientName}` : `🎂 Celebrating You, ${recipientName}`);
  const heroQuote      = hero.quote     || (isArabic ? '"أنتِ نور حياتي وسبب ابتسامتي كل يوم"' : '"You are the light of my life and the reason I smile every day"');
  const heroBirthdate  = hero.birthdate || '';

  const albumImages  = Array.isArray(album.images) && album.images.length > 0 ? album.images : FALLBACK_PHOTOS;
  const bannerImg    = albumImages[0] || null;
  const avatarImg    = albumImages[1] || null;

  const marqueeImages = useMemo(() => {
    if (albumImages.length === 0) return [];
    let list = [...albumImages];
    while (list.length < 12) {
      list = [...list, ...albumImages];
    }
    return list;
  }, [albumImages]);

  const wishesTitle  = content.wishes?.title || (isArabic ? 'أمنيات خاصة 💖' : 'Special Wishes 💖');
  const wishes = useMemo(() => wishesList.length > 0 ? wishesList : [
    { text: isArabic ? 'كل سنة وأنتِ جوة قلبي، حبي الأول والأخير وروحي وسر سعادتي 💖' : `Happy Birthday ${recipientName}! May your year overflow with joy, love, and magic. ✨`, tags: isArabic ? ['حبي الأبدي ✨'] : ['Forever Love ✨'] },
    { text: isArabic ? 'ربنا يبارك في عمرك ويخلي أيامنا كلها حب وضحكة حلوة وراحة بال 🌹' : 'Wishing you a lifetime of laughter, beautiful dreams, and endless happiness. 🌹', tags: isArabic ? ['سند وعمر 🙌'] : ['My Beautiful World 🌱'] },
    { text: isArabic ? 'يا نور عيني، كل سنة وأنتِ طيبة وجنبي، ومنورالي حياتي يا أغلى ما عندي 💫' : 'You are the most precious thing in my world. Happy Birthday, my dearest. 💫', tags: isArabic ? ['نور عيوني 💫'] : ['Light of My Eyes 💫'] },
  ], [wishesList, isArabic, recipientName]);

  const countdownDate       = countdown.target_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const countdownTitle      = countdown.title || (isArabic ? 'العد التنازلي 🎉' : 'Countdown 🎉');
  const countdownPending    = countdown.pending_text || (isArabic ? `الوقت المتبقي لعيد ميلاد ${recipientName} 💖` : `Time until ${recipientName}'s birthday 💖`);
  const countdownDoneTitle  = countdown.completed_title || (isArabic ? `🎉 كل عام وأنتِ بخير يا ${recipientName}!` : `🎉 Happy Birthday, ${recipientName}!`);
  const countdownDoneText   = countdown.completed_text || (isArabic ? 'يومك السعيد بدأ الآن! 💖' : 'Your special day is here! 💖');

  const albumTitle    = album.title       || (isArabic ? 'ذكرياتنا الجميلة 📸' : 'Our Beautiful Memories 📸');
  const albumDesc     = album.description || (isArabic ? 'لحظات محفورة في القلب للأبد 🌹' : 'Moments carved in our hearts forever 🌹');

  const letterTitle   = letter.title         || (isArabic ? `رسالة مخصصة لـ ${recipientName} 💌` : `A Letter for ${recipientName} 💌`);
  const letterDesc    = letter.description   || (isArabic ? 'اضغط لفتح الرسالة السرية 🔐' : 'Tap to open the secret letter 🔐');
  const letterSubject = letter.letter_title  || (isArabic ? 'في يوم ميلادك الجميل...' : 'On Your Beautiful Birthday...');
  const letterContent = letter.letter_content || (isArabic
    ? `يا ${recipientName}، كل سنة وأنتِ طيبة. ده يوم مميز جداً عشان اتولدت فيه أغلى إنسانة في حياتي. ربنا يسعد قلبك دايماً ويخليكِ ليا.`
    : `Dear ${recipientName}, this is your special day. You are the most precious person in my life and I'm so grateful you exist. May this year bring you endless joy and beautiful moments.`);
  const letterLovePhrase = letter.love_phrase || (isArabic ? 'بحبكككككككككك 💗' : 'I love you so much 💗');

  const footerText      = footer.text      || (isArabic ? 'شكراً لمشاركتنا لحظاتكم 🌹' : 'Thank you for sharing this moment 🌹');

  // ── State ───────────────────────────────────────────────────────────────────
  const [isLocked,        setIsLocked]        = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [passcodeInput,   setPasscodeInput]   = useState('');
  const [passcodeError,   setPasscodeError]   = useState(null);
  const [isUnlocking,     setIsUnlocking]     = useState(false);
  const [isMusicPlaying,  setIsMusicPlaying]  = useState(true);
  const [hasInteracted,   setHasInteracted]   = useState(false);
  const [toast,           setToast]           = useState(null);
  const [particles,       setParticles]       = useState([]);
  const [wishIndex,       setWishIndex]       = useState(0);
  const [typeText,        setTypeText]        = useState('');
  const [typeIdx,         setTypeIdx]         = useState(0);
  const [isErasing,       setIsErasing]       = useState(false);
  const [timeLeft,        setTimeLeft]        = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: false });
  const [selectedPhoto,   setSelectedPhoto]   = useState(null);
  const [isLetterOpen,    setIsLetterOpen]    = useState(false);
  const [loveCount,       setLoveCount]       = useState(() => {
    const cached = localStorage.getItem(`neon_love_${greeting?.id || 'default'}`);
    return cached ? parseInt(cached, 10) : 0;
  });
  const [attempts, setAttempts] = useState(0);

  // ── Particles ────────────────────────────────────────────────────────────────
  useEffect(() => { setParticles(generateParticles(20)); }, []);

  // ── Countdown ────────────────────────────────────────────────────────────────
  const targetDate = useMemo(() => new Date(countdownDate), [countdownDate]);
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true }); return; }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isCompleted: false,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  // ── Typewriter ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!wishes.length) return;
    const activeWish = wishes[wishIndex >= wishes.length ? 0 : wishIndex];
    const activeText = activeWish?.text || '';
    let timer;
    if (!isErasing) {
      if (typeIdx < activeText.length) {
        timer = setTimeout(() => { setTypeText(p => p + activeText.charAt(typeIdx)); setTypeIdx(p => p + 1); }, 60);
      } else {
        timer = setTimeout(() => setIsErasing(true), 4000);
      }
    } else {
      if (typeIdx > 0) {
        timer = setTimeout(() => { setTypeText(p => p.slice(0, -1)); setTypeIdx(p => p - 1); }, 35);
      } else {
        setIsErasing(false);
        setWishIndex(p => (p + 1) % wishes.length);
      }
    }
    return () => clearTimeout(timer);
  }, [wishIndex, typeIdx, isErasing, wishes]);

  // Reset typewriter when index changes manually or automatically
  useEffect(() => {
    setTypeText('');
    setTypeIdx(0);
    setIsErasing(false);
  }, [wishIndex]);

  // ── YouTube Iframe Pause/Resume Control ──────────────────────────────────────
  useEffect(() => {
    if (youtubeId && !isLocked && iframeRef.current) {
      const command = isMusicPlaying ? 'playVideo' : 'pauseVideo';
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command, args: '' }),
          '*'
        );
      } catch (e) {
        console.warn('Failed to post message to youtube iframe:', e);
      }
    }
  }, [isMusicPlaying, youtubeId, isLocked]);

  // ── Native Audio Control ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isLocked) return;

    if (!youtubeId && audioUrl) {
      initNeonAudio(audioUrl);
      if (neonBgAudio) {
        if (isMusicPlaying) {
          neonBgAudio.play().catch(() => {});
        } else {
          neonBgAudio.pause();
        }
      }
    }
  }, [isLocked, isMusicPlaying, audioUrl, youtubeId]);

  // ── Global User Interaction Audio Bypass ─────────────────────────────────────
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (isMusicPlaying && !isLocked && !youtubeId) {
          playNeonAudio(audioUrl);
        }
      }
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted, isMusicPlaying, isLocked, audioUrl, youtubeId]);

  // Cleanup native audio on unmount
  useEffect(() => {
    return () => {
      if (neonBgAudio) {
        neonBgAudio.pause();
        neonBgAudio = null;
        neonCurrentUrl = null;
      }
    };
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    if (isPasscodeMatch(passcodeInput, passcode)) {
      setPasscodeError(null);
      setIsUnlocking(true);
      playUnlockSequence();
      if (!youtubeId) { initNeonAudio(audioUrl); if (isMusicPlaying) playNeonAudio(audioUrl); }
      setHasInteracted(true);
      setTimeout(() => { 
        setIsLocked(false); 
        setIsUnlocking(false); 
        setShowCelebration(true);
      }, 2200);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      playErrorTone();
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setPasscodeInput('');
      }, 600);
      setPasscodeError(next >= 3
        ? (isArabic ? '💡 فكر في تاريخ مميز بيننا...' : '💡 Think of a special date between us...')
        : (isArabic ? '❌ الكود ده مش صح، جرب تاني' : '❌ Wrong code, try again'));
      showToast(isArabic ? '🔐 الكود غلط...' : '🔐 Incorrect code...');
    }
  };

  const handleLoveTap = () => {
    const next = loveCount + 1;
    setLoveCount(next);
    localStorage.setItem(`neon_love_${greeting?.id || 'default'}`, next.toString());
    playNeonTone(523.25, 0.3, 'triangle');
    showToast(isArabic ? `💖 أُرسلت نبضة حب إلى ${recipientName}!` : `💖 Love pulse sent to ${recipientName}!`);
  };

  const toggleMusic = () => {
    setIsMusicPlaying(p => !p);
  };

  // ── Page meta ─────────────────────────────────────────────────────────────────
  const displayNames = [recipientName, senderName].filter(Boolean).join(isArabic ? ' و ' : ' & ');
  const pageTitle = `${displayNames} | ${isArabic ? 'عيد ميلاد سعيد' : 'Happy Birthday'}`;

  // ─────────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="neon-birthday-template" dir={dir}>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&family=Outfit:wght@400;600;800;900&family=Playfair+Display:ital,wght@0,600;0,800;1,600;1,800&family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Aurora background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-accent" />
      </div>

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className={`particle particle-${p.color}`}
          style={{
            left: `${p.left}%`,
            bottom: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float-particle ${p.duration}s ${p.delay}s ease-in infinite`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}

      {/* YouTube hidden audio */}
      {youtubeId && !isLocked && (
        <iframe
          ref={iframeRef}
          title="Background Music"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&loop=1&playlist=${youtubeId}&controls=0&mute=0`}
          allow="autoplay"
          style={{ display: 'none', width: 0, height: 0 }}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="glass-panel fixed top-4 inset-x-4 max-w-sm mx-auto z-[100] px-5 py-3 flex items-center gap-3"
            style={{ borderColor: 'rgba(0,245,255,0.3)', boxShadow: '0 0 30px rgba(0,245,255,0.15)' }}
          >
            <span className="flex-1 text-sm font-semibold" style={{ color: 'rgba(200,220,255,0.9)' }}>{toast}</span>
            <button onClick={() => setToast(null)} className="text-xs" style={{ color: 'rgba(0,245,255,0.7)' }}><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music toggle */}
      {!isLocked && (
        <button className="music-toggle" onClick={toggleMusic} title={isMusicPlaying ? 'Pause' : 'Play'}>
          {isMusicPlaying ? <Music size={18} /> : <VolumeX size={18} />}
        </button>
      )}

      <AnimatePresence mode="wait">
        {/* ═══ LOCK GATE ═══════════════════════════════════════════════════════ */}
        {isLocked ? (
          <motion.div
            key="lock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12"
          >
            <div className="w-full max-w-sm mx-auto">
              {/* Glow orb - pulsing heart lock */}
              <div className="relative flex justify-center mb-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="pulse-ring" style={{ width: '96px', height: '96px', top: 0, left: 0, borderColor: 'var(--neon-pink)' }} />
                  <div className="pulse-ring" style={{ width: '96px', height: '96px', top: 0, left: 0, borderColor: 'var(--neon-pink)', animationDelay: '0.5s' }} />
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center glass-panel neon-glow-border-pink relative cursor-pointer"
                    style={{ background: 'rgba(244, 114, 182, 0.08)' }}
                    onClick={focusInput}
                  >
                    <Heart 
                      size={52} 
                      className="absolute animate-pulse" 
                      style={{ 
                        color: 'rgba(244, 114, 182, 0.15)', 
                        fill: 'rgba(244, 114, 182, 0.1)' 
                      }} 
                    />
                    {isUnlocking ? (
                      <Unlock size={28} style={{ color: 'var(--neon-cyan)', position: 'relative', zIndex: 1 }} />
                    ) : (
                      <Lock size={28} style={{ color: 'var(--neon-pink)', position: 'relative', zIndex: 1 }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Avatar / Name Circle */}
              <div className="flex justify-center mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden neon-glow-border-violet flex items-center justify-center"
                  style={{ 
                    border: '2px solid rgba(139, 92, 246, 0.4)',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(5, 7, 15, 0.85) 100%)'
                  }}>
                  {avatarImg && !avatarError ? (
                    <img 
                      src={avatarImg} 
                      alt={recipientName} 
                      className="w-full h-full object-cover" 
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span 
                      className={`font-bold italic text-white select-none truncate max-w-full px-2 ${
                        recipientName.length > 8 ? 'text-sm' : recipientName.length > 5 ? 'text-base' : 'text-xl'
                      }`}
                      style={{ 
                        fontFamily: "'Playfair Display', 'Georgia', serif",
                        textShadow: '0 0 10px rgba(139, 92, 246, 0.95), 0 0 20px rgba(236, 72, 153, 0.6)'
                      }}
                    >
                      {recipientName}
                    </span>
                  )}
                  <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(139, 92, 246, 0.25))' }} />
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="section-label justify-center mb-2">
                  {isArabic ? 'بوابة سرية بالحب' : 'Secret Gateway of Love'}
                </p>
                <h1 className="text-3xl font-black mb-1 gradient-text-neon neon-recipient-name">
                  {isArabic ? `🎂 لـ ${recipientName}` : `🎂 For ${recipientName}`}
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {isArabic ? 'أدخلي الكود السري لفتح هديتك' : 'Enter the secret code to unlock your gift'}
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-6">
                {/* Modern Plaintext Passcode Input */}
                <div className={`relative ${isShaking ? 'animate-shake' : ''}`}>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={isArabic ? "مثال: 4/9/2026 أو 492026" : "e.g. 4/9/2026 or 492026"}
                    value={passcodeInput}
                    onChange={e => {
                      const val = e.target.value;
                      setPasscodeInput(val);
                      if (val.length > passcodeInput.length) {
                        playNeonTone(300 + val.length * 20, 0.05, 'sine');
                      }
                    }}
                    className="neon-input-plaintext text-center w-full py-4 px-6 text-lg font-bold tracking-wider rounded-xl transition-all duration-300"
                    disabled={isUnlocking}
                    autoComplete="off"
                    autoFocus
                  />
                </div>

                <AnimatePresence>
                  {passcodeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-xs font-semibold"
                      style={{ color: 'var(--neon-pink)' }}
                    >
                      {passcodeError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isUnlocking}
                  className="neon-btn-filled w-full py-4 text-sm font-black uppercase tracking-[0.18em] flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                    borderColor: 'rgba(244, 114, 182, 0.4)',
                    boxShadow: '0 0 25px rgba(244, 114, 182, 0.15)'
                  }}
                >
                  {isUnlocking ? (
                    <>
                      <svg className="animate-spin w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {isArabic ? 'جاري الفتح...' : 'Unlocking...'}
                    </>
                  ) : (
                    <>{isArabic ? 'افتح هديتك بالحب ✨' : 'Unlock With Love ✨'}</>
                  )}
                </motion.button>
              </form>

              <p className="text-center text-xs mt-6 animate-pulse" style={{ color: 'rgba(244,114,182,0.45)', textShadow: '0 0 8px rgba(244,114,182,0.2)' }}>
                {isArabic ? '💖 محمي بالحب الصادق' : '💖 Secured with true love'}
              </p>
            </div>
          </motion.div>

        ) : showCelebration ? (
          <CelebrationReveal
            isArabic={isArabic}
            recipientName={recipientName}
            variant="neon"
            onComplete={() => {
              setShowCelebration(false);
            }}
          />
        ) : (
          /* ═══ MAIN CONTENT ══════════════════════════════════════════════════ */
          <motion.main
            key="main"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative z-10 pb-20"
          >
            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
              {/* Banner background */}
              {bannerImg && (
                <div className="absolute inset-0 z-0">
                  <img src={bannerImg} alt="" className="w-full h-full object-cover opacity-20" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,7,15,0.6), rgba(5,7,15,0.4), rgba(5,7,15,0.95))' }} />
                </div>
              )}
              {/* Scanner line */}
              <div className="scanner-line z-0" />

              <div className="relative z-10 text-center max-w-2xl mx-auto">
                {heroBirthdate && (
                  <p className="section-label justify-center mb-4">{heroBirthdate}</p>
                )}

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl sm:text-7xl font-black mb-3 leading-none neon-recipient-name"
                >
                  <span className="glitch-text gradient-text-neon" data-text={recipientName}>
                    {recipientName}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-lg sm:text-xl font-light mb-4 italic"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {heroKicker}
                </motion.p>

                <motion.blockquote
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="glass-panel px-6 py-4 mx-auto max-w-lg text-sm leading-relaxed mb-8"
                  style={{ color: 'rgba(220, 230, 255, 0.85)', fontStyle: 'italic' }}
                >
                  {heroQuote}
                </motion.blockquote>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <button
                    onClick={handleLoveTap}
                    className="neon-btn-pink px-8 py-3 flex items-center gap-2 text-sm font-bold"
                  >
                    <Heart size={16} fill="currentColor" />
                    {isArabic ? `أرسل حبك (${loveCount})` : `Send Love (${loveCount})`}
                  </button>
                </motion.div>
              </div>
            </section>

            <hr className="neon-divider mx-0" />

            {/* ── COUNTDOWN ────────────────────────────────────────────────── */}
            <section className="max-w-2xl mx-auto px-4 py-16">
              <div className="text-center mb-10">
                <p className="section-label justify-center mb-3">{countdownTitle}</p>
              </div>

              {timeLeft.isCompleted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel neon-glow-border-cyan text-center px-6 py-10"
                >
                  <p className="text-4xl mb-4">🎉🎂✨</p>
                  <h2 className="text-2xl font-black mb-3 gradient-text-neon">{countdownDoneTitle}</h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{countdownDoneText}</p>
                </motion.div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { val: timeLeft.days,    label: isArabic ? 'يوم' : 'Days' },
                      { val: timeLeft.hours,   label: isArabic ? 'ساعة' : 'Hours' },
                      { val: timeLeft.minutes, label: isArabic ? 'دقيقة' : 'Min' },
                      { val: timeLeft.seconds, label: isArabic ? 'ثانية' : 'Sec' },
                    ].map(({ val, label }) => (
                      <div key={label} className="countdown-digit-box flex flex-col items-center py-5 px-2">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={val}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="text-3xl sm:text-4xl font-black neon-text-cyan tabular-nums"
                          >
                            {String(val).padStart(2, '0')}
                          </motion.span>
                        </AnimatePresence>
                        <span className="text-xs mt-1 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>{countdownPending}</p>
                </>
              )}
            </section>

            <hr className="neon-divider" />

            {/* ── WISHES ───────────────────────────────────────────────────── */}
            <section className="max-w-2xl mx-auto px-4 py-16">
              <div className="text-center mb-10">
                <p className="section-label justify-center mb-3">{wishesTitle}</p>
              </div>

              <div className="relative min-h-[180px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {wishes[wishIndex] && (
                    <motion.div
                      key={wishIndex}
                      initial={{ opacity: 0, x: isArabic ? 25 : -25 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isArabic ? -25 : 25 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="wish-card px-6 py-5 active w-full"
                    >
                      <p className="text-sm leading-7 neon-typewriter" style={{ color: 'rgba(220,230,255,0.9)' }}>
                        {typeText}
                      </p>
                      {wishes[wishIndex].tags && wishes[wishIndex].tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 justify-center">
                          {wishes[wishIndex].tags.map((tag, ti) => (
                            <span
                              key={ti}
                              className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)', color: 'var(--neon-cyan)' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wish navigation */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button onClick={() => setWishIndex(p => (p - 1 + wishes.length) % wishes.length)} className="neon-btn w-10 h-10 rounded-full flex items-center justify-center">
                  <ChevronLeft size={16} />
                </button>
                {wishes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWishIndex(i)}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{ background: i === wishIndex ? 'var(--neon-cyan)' : 'rgba(0,245,255,0.2)', boxShadow: i === wishIndex ? '0 0 8px rgba(0,245,255,0.6)' : 'none' }}
                  />
                ))}
                <button onClick={() => setWishIndex(p => (p + 1) % wishes.length)} className="neon-btn w-10 h-10 rounded-full flex items-center justify-center">
                  <ChevronRight size={16} />
                </button>
              </div>
            </section>

            {/* ── ALBUM ────────────────────────────────────────────────────── */}
            <>
              <hr className="neon-divider" />
              <section className="py-16 overflow-hidden">
                <div className="text-center mb-10 px-4">
                  <p className="section-label justify-center mb-3">{albumTitle}</p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{albumDesc}</p>
                </div>

                {albumImages.length > 0 ? (
                  <div className="neon-marquee-container relative w-full overflow-hidden py-4" dir="ltr">
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#05070f] to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#05070f] to-transparent z-10 pointer-events-none" />

                    <div className="neon-marquee-track">
                      <div className="neon-marquee-group">
                        {marqueeImages.map((photo, i) => (
                          <div
                            key={`m1-${i}`}
                            className="neon-marquee-item"
                            onClick={() => setSelectedPhoto(photo)}
                          >
                            <img src={photo} alt="" />
                            <div className="album-photo-overlay" />
                          </div>
                        ))}
                      </div>
                      <div className="neon-marquee-group" aria-hidden="true">
                        {marqueeImages.map((photo, i) => (
                          <div
                            key={`m2-${i}`}
                            className="neon-marquee-item"
                            onClick={() => setSelectedPhoto(photo)}
                          >
                            <img src={photo} alt="" />
                            <div className="album-photo-overlay" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="mx-auto max-w-2xl rounded-2xl border border-dashed px-6 py-10 text-center text-sm font-semibold"
                    style={{ borderColor: 'rgba(0,245,255,0.25)', color: 'var(--text-secondary)', background: 'rgba(0,245,255,0.03)' }}
                  >
                    {isArabic ? 'لا توجد صور مرفوعة بعد.' : 'No photos uploaded yet.'}
                  </div>
                )}
              </section>
            </>

            {/* ── LOVE LETTER ──────────────────────────────────────────────── */}
            <hr className="neon-divider" />
            <section className="max-w-2xl mx-auto px-4 py-16">
              <div className="text-center mb-10">
                <p className="section-label justify-center mb-3">{letterTitle}</p>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{letterDesc}</p>
              </div>

              <div className="envelope-card">
                {/* Envelope header / seal */}
                <div
                  className="flex flex-col items-center justify-center py-10 cursor-pointer select-none"
                  onClick={() => { setIsLetterOpen(p => !p); if (!isLetterOpen) playNeonTone(659.25, 0.4, 'triangle'); }}
                >
                  <motion.div
                    animate={{ scale: isLetterOpen ? 1.15 : 1, rotate: isLetterOpen ? 10 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="text-5xl mb-4 cursor-pointer"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(244,114,182,0.6))' }}
                  >
                    {isLetterOpen ? '💌' : '💌'}
                  </motion.div>
                  <p className="text-sm font-semibold neon-text-pink">
                    {isLetterOpen
                      ? (isArabic ? '🔓 الرسالة مفتوحة' : '🔓 Letter Opened')
                      : (isArabic ? '🔐 اضغط لفتح الرسالة' : '🔐 Tap to open the letter')}
                  </p>
                </div>

                {/* Letter content */}
                <AnimatePresence>
                  {isLetterOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 space-y-6">
                        <hr className="neon-divider" />
                        <h3 className="text-lg font-bold neon-text-pink text-center">{letterSubject}</h3>
                        <div className="text-sm leading-8 whitespace-pre-wrap" style={{ color: 'rgba(220,230,255,0.85)' }}>
                          {letterContent}
                        </div>
                        <p className="text-center text-xl font-black gradient-text-neon">{letterLovePhrase}</p>
                        <p className="text-center text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                          — {senderName} 💫
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────────────── */}
            <footer className="relative z-10 text-center px-4 py-8 mt-8">
              <hr className="neon-divider mb-8" />
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{footerText}</p>
              <p className="text-xs mt-6" style={{ color: 'rgba(200,210,255,0.2)' }}>
                Made with 💙 &amp; ✨
              </p>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

      {/* ── Photo modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 cursor-zoom-out"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-2xl w-full rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(0,245,255,0.3)', boxShadow: '0 0 60px rgba(0,245,255,0.15)' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <X size={16} />
              </button>
              <img src={selectedPhoto} alt="Zoom" className="w-full max-h-[85vh] object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeonBirthdayTemplate;
