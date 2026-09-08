import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, VolumeX, Heart, Sparkles, Calendar, Mail, Lock } from 'lucide-react';
import CelebrationReveal from '../../sections/CelebrationReveal';
import { CustomBottom, CustomInput } from '../../../../components';

import birthdayBanner from '../../../../assets/images/birthday_banner.png';

import './index.css';

// ─── Web Audio helpers ─────────────────────────────────────────────────────────
let romanticAudioCtx = null;
function getRomanticAudioContext() {
  if (!romanticAudioCtx) {
    romanticAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return romanticAudioCtx;
}

function playHarpPluck(frequency, type = 'sine', duration = 0.8) {
  try {
    const ctx = getRomanticAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio blocked or unsupported', e);
  }
}

function playChimeCascade() {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playHarpPluck(freq, 'triangle', 1.2);
    }, idx * 120);
  });
}

const getYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// ─── Background music helpers ──────────────────────────────────────────────────
let romanticBgAudio = null;
let romanticCurrentMusicUrl = null;
let musicRequested = true;

function initAudio(musicUrl) {
  if (getYouTubeId(musicUrl)) {
    if (romanticBgAudio) {
      romanticBgAudio.pause();
      romanticBgAudio = null;
      romanticCurrentMusicUrl = null;
    }
    return;
  }
  if (romanticBgAudio && romanticCurrentMusicUrl === musicUrl) return;
  try {
    if (romanticBgAudio) {
      romanticBgAudio.pause();
    }
    if (musicUrl) {
      romanticBgAudio = new Audio(musicUrl);
      romanticBgAudio.loop = true;
      romanticBgAudio.volume = 0.4;
      romanticCurrentMusicUrl = musicUrl;
    } else {
      romanticBgAudio = null;
      romanticCurrentMusicUrl = null;
    }
  } catch (e) {
    console.error('Background music initialization failed:', e);
  }
}

function playAudioSync(musicUrl) {
  if (getYouTubeId(musicUrl)) return;
  initAudio(musicUrl);
  if (romanticBgAudio && musicRequested) {
    romanticBgAudio.play().catch((e) => {
      console.warn('Audio synchronization waiting for interaction:', e);
    });
  }
}

const EMPTY_ARRAY = [];

const isDefaultLocalAsset = (value) => (
  typeof value === 'string' &&
  (value.startsWith('/assets/images/') || value.startsWith('assets/images/'))
);

const getAlbumImages = (album) => {
  if (Array.isArray(album?.images) && album.images.length > 0) {
    return album.images.filter(Boolean);
  }
  if (typeof album?.images_text === 'string') {
    return album.images_text.split('\n').map((line) => line.trim()).filter(Boolean);
  }
  return [];
};

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
      if (dayMonth.startsWith('0')) dayMonth = dayMonth.substring(1);
      if (dayMonth.length > 2 && dayMonth.charAt(dayMonth.length - 2) === '0') {
        dayMonth = dayMonth.substring(0, dayMonth.length - 2) + dayMonth.substring(dayMonth.length - 1);
      }
      if (dayMonth.startsWith('0')) dayMonth = dayMonth.substring(1);
      return dayMonth + year;
    }
    return s;
  };

  if (removeLeadingZeros(cleanInput) === removeLeadingZeros(cleanCorrect)) return true;
  if (removeLeadingZeros(cleanInput) === cleanCorrect) return true;
  if (cleanInput === removeLeadingZeros(cleanCorrect)) return true;
  return false;
}

const RomanticBirthdayTemplate = ({ greeting }) => {
  const isArabic = greeting?.locale === 'ar';
  
  // Unpack Custom settings
  const content = greeting?.content || {};
  const basic = content.basic || {};
  const hero = content.hero || {};
  const countdown = content.countdown || {};
  const wishesList = Array.isArray(content.wishes?.items) ? content.wishes.items : EMPTY_ARRAY;
  const album = content.album || {};
  const letter = content.letter || {};
  const audio = content.audio || {};
  const footer = content.footer || {};

  const recipientName = greeting?.recipient_name || 'My Love';
  const senderName = greeting?.sender_name || 'Your Partner';
  const unlockPasscode = String(basic.passcode || '942026');

  const heroKicker = hero.kicker || (isArabic ? 'حكاية حب سماوية تكتمل بوجودكِ 🌌' : 'A celestial love story complete with you 🌌');
  const heroQuote = hero.quote || (isArabic ? '"سأبقى أحبكِ في كل ثانية ودقيقة وعام، فأنتِ عيدي وسر ابتسامتي المخلدة"' : '"I will love you through every second, minute, and year. Happy Birthday, my star."');
  const heroBirthdate = hero.birthdate || '';

  const albumImages = getAlbumImages(album);
  const primaryAlbumImage = albumImages[0] || null;
  const secondaryAlbumImage = albumImages[1] || albumImages[0] || null;
  const customBannerImage = hero.banner_image && !isDefaultLocalAsset(hero.banner_image) ? hero.banner_image : null;
  const customAvatarImage = hero.avatar_image && !isDefaultLocalAsset(hero.avatar_image) ? hero.avatar_image : null;
  const bannerImg = primaryAlbumImage || customBannerImage || birthdayBanner;
  const avatarImg = secondaryAlbumImage || customAvatarImage || null;
  const albumPhotos = albumImages;

  const countdownDate = countdown.target_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const countdownTitle = countdown.title || (isArabic ? 'العد التنازلي لميلاد نجمتي 🌠' : 'Countdown to the birth of my star 🌠');
  const countdownPending = countdown.pending_text || (isArabic ? 'الوقت المتبقي لليلة عيد ميلاد أغلى إنسانة بالكون...' : 'Time remaining until the most precious birthday...');
  const countdownCompletedTitle = countdown.completed_title || (isArabic ? `🎉 كل عام وأنتِ بقلبي يا ${recipientName}!` : `🎉 Happy Birthday, my love ${recipientName}!`);
  const countdownCompletedText = countdown.completed_text || (isArabic ? 'بدأ الآن أسعد أيام العام. جعل الله كل أيامكِ فرحاً وسعادة بجانبي ونبض حبنا لا ينتهي أبداً.' : 'Your special day is here. May all your days be filled with joy by my side.');

  const wishesTitle = wishesList.length > 0 ? (content.wishes?.title || (isArabic ? 'أمنيات سماوية 💫' : 'Celestial Wishes 💫')) : (isArabic ? 'أمنيات سماوية 💫' : 'Celestial Wishes 💫');
  const wishes = useMemo(() => {
    return wishesList.length > 0 ? wishesList : [
      { text: isArabic ? 'كل عام وأنتِ روحي ونور عيوني وعشقي الأول والأخير...' : 'Happy Birthday to the one who makes my world complete. May your year overflow with joy.', tags: isArabic ? ['حبي الأبدي 💫'] : ['Eternal Love 💫'] },
      { text: isArabic ? 'ربي يبارك في عمرك ويخلي أيامنا كلها مودة وراحة بال سوا.' : 'Wishing you infinite shared dreams and comfortable nights.', tags: isArabic ? ['سند وعمر 🔗'] : ['My Companion 🔗'] }
    ];
  }, [wishesList, isArabic]);

  const albumTitle = album.title || (isArabic ? 'معرض ذكرياتنا المحفورة بالذهب 📸' : 'Our Golden Memories Gallery 📸');
  const albumDesc = album.description || (isArabic ? 'لحظات محفورة في ثنايا القلوب، تفاصيلها تفيض بالود والحب...' : 'Photos that keep our beautiful moments alive in our hearts...');

  const letterTitle = letter.title || (isArabic ? `رسالة سرية مغلفة بالشمع لـ ${recipientName} 💌` : `A Secret Wax-Sealed Letter for ${recipientName} 💌`);
  const letterDesc = letter.description || (isArabic ? 'اضغطي على الختم الشمعي لفك لفافة الرسالة 🔐' : 'Click the wax seal to unroll the parchment 🔐');
  const letterSubject = letter.letter_title || (isArabic ? 'إلى مالكة قلبي وسر سعادتي...' : 'To the keeper of my happiness...');
  const letterContent = letter.letter_content || (isArabic 
    ? 'كل سنة وأنتِ طيبة ومعايا وجنبي. النهار ده هو اليوم المفضل لقلبي لأنه اليوم اللي اتولدت فيه أغلى إنسانة في دنيتي.\n\nكل عام وأنتِ حبيبتي، بنتي، وصديقتي المقربة. ربي يسعد فؤادك ويحفظ ضحكتكِ السكر التي تنير ظلمة أيامي.'
    : 'Happy Birthday, my love. Today is my favorite day of the year because the most precious person in my life was born. I love you forever.');
  const letterLovePhrase = letter.love_phrase || (isArabic ? 'بحبكِ إلى ما وراء الأبد 💗' : 'I love you beyond eternity 💗');

  const audioUrl = audio.url || '';
  const youtubeId = useMemo(() => getYouTubeId(audioUrl), [audioUrl]);

  const footerText = footer.text || (isArabic ? 'صنع بكل الحب وعطر الجوري من أجلكِ 🌹' : 'Made with love and red roses just for you 🌹');

  const iframeRef = useRef(null);

  // State
  const [currentWishIndex, setCurrentWishIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterCharIndex, setTypewriterCharIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLocked, setIsLocked] = useState(true);
  const [route, setRoute] = useState('lock');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [blossoms, setBlossoms] = useState([]);
  const [loveCount, setLoveCount] = useState(() => {
    const cached = localStorage.getItem(`romantic_love_${greeting?.id || 'default'}`);
    return cached ? parseInt(cached, 10) : 99;
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  // Target countdown calculation
  const targetDate = useMemo(() => new Date(countdownDate), [countdownDate]);
  useEffect(() => {
    const calculateTime = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isCompleted: false
      });
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Astrological glowing blossoms / stars / hearts / roses
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 24; i++) {
      list.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: Math.random() * 12 + 10,
        size: Math.random() * 14 + 12,
        driftX: Math.random() * 120 + 50,
        rot: Math.random() * 360 + 360,
        type: i % 4 === 0 ? 'star' : i % 4 === 1 ? 'rose' : i % 4 === 2 ? 'heart' : 'love'
      });
    }
    setBlossoms(list);
  }, []);

  // Sync YouTube audio state
  useEffect(() => {
    if (youtubeId && !isLocked && iframeRef.current) {
      const command = isMusicPlaying ? 'playVideo' : 'pauseVideo';
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command, args: '' }),
          '*'
        );
      } catch (e) {
        console.warn('Failed to communicate with YouTube iframe:', e);
      }
    }
  }, [isMusicPlaying, youtubeId, isLocked]);

  // Sync Native audio state
  useEffect(() => {
    if (isLocked) return;
    if (!youtubeId && audioUrl) {
      initAudio(audioUrl);
      if (romanticBgAudio) {
        if (isMusicPlaying) {
          romanticBgAudio.play().catch(() => {});
        } else {
          romanticBgAudio.pause();
        }
      }
    }
  }, [isLocked, isMusicPlaying, audioUrl, youtubeId]);

  // Handle global interaction for audio activation
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (isMusicPlaying && !isLocked && !youtubeId) {
          playAudioSync(audioUrl);
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

  // Cleanup native audio
  useEffect(() => {
    return () => {
      if (romanticBgAudio) {
        romanticBgAudio.pause();
        romanticBgAudio = null;
        romanticCurrentMusicUrl = null;
      }
    };
  }, []);

  // Typewriter wish cycler
  useEffect(() => {
    if (wishes.length === 0) return;
    const activeWish = wishes[currentWishIndex >= wishes.length ? 0 : currentWishIndex];
    const activeText = activeWish?.text || '';
    let timer;

    if (!isErasing) {
      if (typewriterCharIndex < activeText.length) {
        timer = setTimeout(() => {
          setTypewriterText((prev) => prev + activeText.charAt(typewriterCharIndex));
          setTypewriterCharIndex((prev) => prev + 1);
        }, 70);
      } else {
        timer = setTimeout(() => setIsErasing(true), 4000);
      }
    } else {
      if (typewriterCharIndex > 0) {
        timer = setTimeout(() => {
          setTypewriterText((prev) => prev.slice(0, -1));
          setTypewriterCharIndex((prev) => prev - 1);
        }, 35);
      } else {
        setIsErasing(false);
        setCurrentWishIndex((prev) => (prev + 1) % wishes.length);
      }
    }
    return () => clearTimeout(timer);
  }, [currentWishIndex, typewriterCharIndex, isErasing, wishes]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUnlockSubmit = (e) => {
    if (e) e.preventDefault();

    if (isPasscodeMatch(passwordInput, unlockPasscode)) {
      setPasswordError(null);
      setIsUnlocking(true);
      playHarpPluck(523.25, 'sine', 1.0);
      playChimeCascade();

      setHasInteracted(true);
      playAudioSync(audioUrl);

      setTimeout(() => {
        setIsLocked(false);
        setRoute('celebration');
        setIsUnlocking(false);
      }, 1600);
    } else {
      setIsShaking(true);
      playHarpPluck(220, 'triangle', 0.6);
      setTimeout(() => setIsShaking(false), 500);
      const nextAtt = attempts + 1;
      setAttempts(nextAtt);
      if (nextAtt >= 3) {
        setPasswordError(isArabic ? 'تلميح: تاريخ أول يوم عرفتك فيه 💖' : 'Hint: Think of the date we first met 💖');
      } else {
        setPasswordError(isArabic ? 'التاريخ المدخل غير صحيح يا حبيبتي، فكري جيداً.. 🌸' : 'Incorrect anniversary date, my love.. think again.. 🌸');
      }
      showToast(isArabic ? 'رمز البوابة غير صحيح.. 🌸' : 'Incorrect passcode.. 🌸');
    }
  };

  const handleLoveTap = () => {
    const nextVal = loveCount + 1;
    setLoveCount(nextVal);
    localStorage.setItem(`romantic_love_${greeting?.id || 'default'}`, nextVal.toString());
    playChimeCascade();
    showToast(isArabic ? `أرسلتِ نبضة مودة ودفء رومانسي إلى ${senderName}! ❤️` : `Sent a warm romantic pulse to ${senderName}! ❤️`);
  };

  const pageTitle = `${recipientName} | ${isArabic ? 'يوم ميلاد سعيد مخملي' : 'A Romantic Birthday'}`;

  return (
    <div className="romantic-birthday-template starry-texture relative flex min-h-screen flex-col justify-between overflow-x-hidden selection:bg-[#ff9a9e] selection:text-[#2d1518]" dir={isArabic ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=El+Messiri:wght@400;600;700&family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Floating Astrological Blossoms & Stars */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {blossoms.map((pt) => (
          <div
            key={pt.id}
            className="blossom-element"
            style={{
              left: `${pt.left}%`,
              top: `-32px`,
              fontSize: `${pt.size}px`,
              animation: `float-blossom ease-in-out infinite`,
              animationDuration: `${pt.duration}s`,
              animationDelay: `${pt.delay}s`,
              '--drift-x': `${pt.driftX}px`,
              '--rot': `${pt.rot}deg`,
              color: pt.type === 'rose' ? '#ff758f' : pt.type === 'star' ? '#e5c158' : pt.type === 'heart' ? '#ffccd5' : '#ff4d6d',
              opacity: pt.type === 'star' ? 0.45 : 0.35
            }}
          >
            {pt.type === 'rose' ? '🌹' : pt.type === 'star' ? '✨' : pt.type === 'heart' ? '💖' : '❤️'}
          </div>
        ))}
      </div>

      {youtubeId && !isLocked && (
        <iframe
          ref={iframeRef}
          title="Background Romantic Music"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&loop=1&playlist=${youtubeId}&controls=0&mute=0`}
          allow="autoplay"
          className="hidden"
          style={{ display: 'none', width: 0, height: 0 }}
        />
      )}

      {/* Astro Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.92 }}
            className="toast-romantic fixed top-16 inset-x-4 max-w-sm mx-auto z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 border text-start"
            style={{ background: '#2a030b', borderColor: '#e5c158', color: '#fff5f6' }}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <span className="text-xl">🌌</span>
            <p className="text-xs font-bold leading-normal flex-1 text-start">
              {toastMessage}
            </p>
            <button onClick={() => setToastMessage(null)} className="text-[#e5c158] hover:text-[#fff5f6]">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {route === 'lock' ? (
          /* ══════════════════════════ HEARTLOCK GATE ══════════════════════════ */
          <motion.div
            key="lock-page"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.75 } }}
            className="flex-grow flex flex-col items-center justify-center p-4 min-h-screen relative z-10"
            style={{ background: 'radial-gradient(circle at center, #2e040c 0%, #150005 100%)' }}
          >
            {/* Keyhole and Padlock */}
            <div className="relative h-[260px] w-full flex items-center justify-center mb-6">
              {!isUnlocking ? (
                <motion.div
                  key="celestial-lock"
                  className={`flex flex-col items-center justify-center relative cursor-pointer ${isShaking ? 'animate-gate-shake' : ''}`}
                  onClick={() => playHarpPluck(392.00, 'sine', 0.6)}
                >
                  {/* Orbits in background */}
                  <div className="absolute w-[200px] h-[200px] border border-[#e5c158]/25 rounded-full animate-[spin_12s_linear_infinite] pointer-events-none" />
                  <div className="absolute w-[230px] h-[230px] border border-dashed border-[#ffccd5]/20 rounded-full animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />

                  {/* Heart lock block */}
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#2a030b] to-[#4c0818] border-2 border-[#e5c158] shadow-[0_0_30px_rgba(255,117,143,0.3)] flex items-center justify-center relative z-10 hover:border-[#ffccd5] transition duration-300">
                    <Lock size={64} className="text-[#e5c158] drop-shadow-[0_0_12px_rgba(229,193,88,0.5)]" />
                    <div className="absolute bottom-5 text-[10px] font-black tracking-widest text-[#ff9a9e] uppercase select-none">
                      {isArabic ? 'مغلق بالحب' : 'Secured'}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Gate opening split */
                <div className="relative w-[180px] h-[180px] flex items-center justify-center">
                  <motion.div
                    initial={{ x: 0, opacity: 1, scale: 1 }}
                    animate={{ x: -140, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute text-[#e5c158] w-[180px] h-[180px] flex items-center justify-center z-20 pointer-events-none"
                    style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
                  >
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#2a030b] to-[#4c0818] border-2 border-[#e5c158] flex items-center justify-center">
                      <Lock size={64} />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ x: 0, opacity: 1, scale: 1 }}
                    animate={{ x: 140, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute text-[#e5c158] w-[180px] h-[180px] flex items-center justify-center z-20 pointer-events-none"
                    style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
                  >
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#2a030b] to-[#4c0818] border-2 border-[#e5c158] flex items-center justify-center">
                      <Lock size={64} />
                    </div>
                  </motion.div>
                  
                  {/* Central oval mirror avatar reveal */}
                  <motion.div
                    initial={{ scale: 0.1, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 1.1, ease: 'backOut' }}
                    className="absolute w-32 h-40 oval-mirror-frame bg-[#2a030b] flex items-center justify-center z-10 text-white"
                  >
                    {avatarImg ? (
                      <img src={avatarImg} alt={recipientName} className="w-full h-full object-cover animate-fade-in" />
                    ) : (
                      <span className="text-4xl font-extrabold italic text-[#e5c158]">{recipientName.charAt(0).toUpperCase()}</span>
                    )}
                  </motion.div>
                </div>
              )}
            </div>

            {/* Input Form */}
            {!isUnlocking && (
              <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleUnlockSubmit}
                className="w-full max-w-xs space-y-4 text-center z-10 px-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#ff9a9e] block tracking-wide font-amiri text-lg">
                    {isArabic ? 'اكتبي تاريخ ذكرى حبنا المميز للدخول.. 🔑' : 'Enter our anniversary passcode to unlock.. 🔑'}
                  </label>
                  <CustomInput
                    name="passwordInput"
                    placeholder={isArabic ? 'رمز المرور (مثال: ٢٠٢٦)' : 'Anniversary code'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    inputClassName="text-center bg-white/5 border-[#ff758f]/40 text-white placeholder:text-neutral-500 rounded-full focus:ring-[#ff758f]/25 py-3.5 focus:border-[#ff758f]"
                  />
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] font-semibold text-rose-300 leading-normal pt-1.5"
                    >
                      {passwordError}
                    </motion.p>
                  )}
                </div>

                <CustomBottom
                  text={isArabic ? 'فك لغز البوابة 🌟' : 'Solve Gateway Lock 🌟'}
                  type="submit"
                  buttonStyles="btn-vibrant-love w-full"
                />
              </motion.form>
            )}
          </motion.div>

        ) : route === 'celebration' ? (
          /* ══════════════════════════ CELEBRATION REVEAL ══════════════════════════ */
          <CelebrationReveal
            isArabic={isArabic}
            recipientName={recipientName}
            onComplete={() => {
              setRoute('home');
              setIsMusicPlaying(true);
              playChimeCascade();
            }}
          />
        ) : (
          /* ══════════════════════════ HOME FLOW ══════════════════════════ */
          <motion.div
            key="home-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
            className="flex-grow flex flex-col justify-between relative z-10"
          >
            <main className="flex-grow py-8 max-w-2xl w-full mx-auto px-4 relative z-20">
              <div className="space-y-12 md:space-y-16">
                
                {/* ── HERO SECTION ── */}
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="velvet-deck-card p-6 md:p-10 flex flex-col items-center justify-center relative min-h-[520px]"
                >
                  {/* Orbits */}
                  <div className="astrolabe-ring w-[300px] h-[300px] top-10 animate-[spin_20s_linear_infinite]" />
                  <div className="astrolabe-ring w-[380px] h-[380px] top-4 border-dashed animate-[spin_30s_linear_infinite_reverse]" />

                  {/* Banner Backdrop */}
                  {bannerImg && (
                    <div className="absolute inset-0 z-0">
                      <img src={bannerImg} alt="" className="w-full h-full object-cover opacity-15 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#150005] via-[#150005]/45 to-transparent" />
                    </div>
                  )}

                  <div className="relative z-10 flex flex-col items-center text-center space-y-6 w-full">
                    <Sparkles className="text-[#e5c158] text-3xl animate-pulse" />

                    <div className="space-y-2 select-none flex flex-col items-center w-full">
                      <motion.h1
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                        className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fff5f2] via-[#e5c158] to-[#ff9a9e] text-4xl xs:text-5xl md:text-6xl tracking-wide drop-shadow-md text-center max-w-full leading-normal"
                      >
                        {recipientName}
                      </motion.h1>
                      <div className="w-20 h-[1.5px] bg-[#e5c158] mx-auto opacity-60 mt-1" />
                      
                      <div className="px-4 py-1.5 bg-[#e5c158]/10 border border-[#e5c158]/40 rounded-full flex items-center gap-2 mt-4 shadow-inner">
                        <span className="text-xs">🌠</span>
                        <span className="font-sans text-xs text-[#fff5f2] font-black tracking-widest leading-none">
                          {heroBirthdate}
                        </span>
                        <span className="text-xs">🎂</span>
                      </div>
                    </div>

                    {/* Parchment Quote Scroll */}
                    <div className="love-parchment-scroll p-6 rounded-2xl max-w-md w-full border shadow-2xl scroll-content">
                      <p className="text-center font-amiri text-base sm:text-lg leading-relaxed italic md:px-4 text-[#3c2415]">
                        {heroQuote}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-[280px] pt-2">
                      <CustomBottom
                        text={isArabic ? 'أرسل نبضة حب 💖' : 'Send Love Pulse 💖'}
                        onClick={handleLoveTap}
                        buttonStyles="btn-vibrant-love w-full"
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 z-10 text-white/80">
                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10 text-[10px] font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                      <span>{heroKicker}</span>
                    </div>
                  </div>
                </motion.section>

                {/* Avatar oval mirror */}
                {avatarImg && (
                  <motion.section
                    initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 1 }}
                    viewport={{ once: true }}
                    className="max-w-[240px] mx-auto relative group hover:shadow-2xl transition-all duration-300 select-none"
                    onClick={() => setSelectedPhoto(avatarImg)}
                  >
                    <div className="oval-mirror-frame cursor-zoom-in">
                      <img src={avatarImg} alt={recipientName} className="group-hover:scale-[1.04] transition-all duration-700" />
                    </div>
                    <div className="text-center mt-3 flex items-center justify-center gap-1 text-[#ff9a9e]">
                      <Sparkles size={12} className="animate-pulse" />
                      <p className="font-amiri text-lg font-bold">{recipientName}</p>
                      <Sparkles size={12} className="animate-pulse" />
                    </div>
                  </motion.section>
                )}

                {/* COUNTDOWN TIMER */}
                <motion.section
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="velvet-deck-card p-6 sm:p-8 text-center relative overflow-hidden"
                >
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles size={16} className="text-[#e5c158] animate-pulse" />
                      <h2 className="font-display text-xs md:text-sm text-[#ff9a9e] uppercase tracking-wider font-extrabold">
                        {countdownTitle}
                      </h2>
                      <Sparkles size={16} className="text-[#e5c158] animate-pulse" />
                    </div>

                    {timeLeft.isCompleted ? (
                      <div className="py-6 space-y-4">
                        <h3 className="font-display text-3.5xl md:text-4.5xl text-rose-300 font-bold leading-tight">
                          {countdownCompletedTitle}
                        </h3>
                        <p className="text-sm font-semibold text-rose-100/90 max-w-md mx-auto leading-relaxed">
                          {countdownCompletedText}
                        </p>
                        <h4 className="font-amiri text-3.5xl md:text-4.5xl text-[#e5c158] font-bold mt-4 animate-pulse">
                          {isArabic ? `كل عام وأنتِ عيدي 💖` : `Happy Birthday, my star 💖`}
                        </h4>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p className="font-sans text-sm md:text-base text-rose-100/80 font-semibold max-w-md mx-auto leading-relaxed">
                          {countdownPending}
                        </p>

                        {/* Dial Cards */}
                        <div className="flex justify-center gap-2.5 xs:gap-3.5 md:gap-5 max-w-md mx-auto pt-2">
                          {[
                            { val: timeLeft.days, label: isArabic ? 'يوم' : 'Days' },
                            { val: timeLeft.hours, label: isArabic ? 'ساعة' : 'Hours' },
                            { val: timeLeft.minutes, label: isArabic ? 'دقيقة' : 'Min' },
                            { val: timeLeft.seconds, label: isArabic ? 'ثانية' : 'Sec', alert: true }
                          ].map(({ val, label, alert }) => (
                            <motion.div
                              whileHover={{ scale: 1.06 }}
                              key={label}
                              className="w-14 h-16 xs:w-16 xs:h-18 md:w-20 md:h-22 rounded-xl flex flex-col items-center justify-center astrological-dial relative overflow-hidden"
                            >
                              <span className={`font-sans font-bold text-xl xs:text-2xl md:text-3.5xl text-[#e5c158] tracking-tight leading-none ${alert ? 'animate-pulse' : ''}`}>
                                {val}
                              </span>
                              <span className="text-[10px] text-neutral-300 font-bold mt-1.5">{label}</span>
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs text-neutral-300 font-semibold pt-4">
                          <Calendar size={14} className="text-[#ff758f]" />
                          <span>{isArabic ? `اليوم الموعود: ${heroBirthdate}` : `Celebration Date: ${heroBirthdate}`}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.section>

                {/* WISHES CAROUSEL */}
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="relative velvet-deck-card p-6 sm:p-8 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Heart size={140} className="fill-current" />
                  </div>

                  <div className="relative z-10 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Mail size={15} className="text-[#e5c158] animate-bounce" />
                        <h2 className="font-display text-xs text-[#ff9a9e] uppercase tracking-wider font-semibold">
                          {wishesTitle}
                        </h2>
                      </div>
                      <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-white/95 border border-white/5">
                        {isArabic ? 'أمنيات رقيقة 🌸' : 'Kind Wish 🌸'}
                      </span>
                    </div>

                    <div className="min-h-[100px] flex items-center justify-start text-start">
                      <p className="font-amiri text-lg md:text-2xl leading-relaxed text-[#ffebd6] typewriter-text w-full">
                        {typewriterText}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 select-none">
                      {Array.isArray(wishes[currentWishIndex]?.tags) && wishes[currentWishIndex].tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-[#ff758f]/10 border border-[#ff758f]/30 px-2.5 py-1 rounded-full text-[#ffccd5]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* PHOTO ALBUM */}
                {albumPhotos.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-2 select-none">
                      <h2 className="font-display text-xl sm:text-2xl text-rose-300 font-bold">{albumTitle}</h2>
                      <p className="text-xs text-neutral-400 font-semibold max-w-md mx-auto">{albumDesc}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                      {albumPhotos.map((photo, index) => (
                        <motion.div
                          whileHover={{ scale: 1.04 }}
                          key={index}
                          className="aspect-square rounded-2xl overflow-hidden border border-[#ff758f]/30 shadow-2xl relative cursor-zoom-in group bg-[#2a030b]"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <img src={photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* SECRET LETTER */}
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1.5 select-none">
                    <h2 className="font-display text-xl sm:text-2xl text-rose-300 font-bold">{letterTitle}</h2>
                    <p className="text-xs text-neutral-400 font-semibold">{letterDesc}</p>
                  </div>

                  <div className="letter-capsule">
                    {!isLetterOpen ? (
                      /* Sealed Capsule */
                      <div className="flex flex-col items-center justify-center py-16 gap-5 select-none">
                        <div className="w-20 h-20 rounded-full cork-wax-seal flex items-center justify-center text-white" onClick={() => { setIsLetterOpen(true); playChimeCascade(); }}>
                          <Heart size={36} className="fill-current text-[#fff5f6] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                        </div>
                        <p className="text-xs text-rose-200/90 font-bold uppercase tracking-wider">
                          {isArabic ? '🔓 اضغطي الختم لفتح الرسالة' : '🔓 Tap seal to open scroll'}
                        </p>
                      </div>
                    ) : (
                      /* Parchment Scroll Content */
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-5 sm:p-8 md:p-10 love-parchment-scroll rounded-3xl"
                      >
                        <div className="flex justify-between items-center border-b border-[#3b2314]/20 pb-4 mb-4 select-none">
                          <button
                            onClick={() => setIsLetterOpen(false)}
                            className="text-xs text-rose-900 bg-black/5 px-4 py-2 rounded-full border border-rose-900/10 hover:bg-black/15 transition active:scale-95 cursor-pointer font-bold"
                          >
                            {isArabic ? 'إغلاق الرسالة ✉️' : 'Close Letter ✉️'}
                          </button>
                          <span className="font-sans text-[10px] font-black text-amber-900 tracking-wider">
                            {isArabic ? 'رسالة حب سرية' : 'SECRET LETTER'}
                          </span>
                        </div>

                        <div className="scroll-content space-y-5 leading-relaxed text-right font-amiri text-sm sm:text-base md:text-lg">
                          <p className="text-center text-xl font-bold text-amber-900 pb-2 border-b border-dashed border-amber-900/10">
                            {letterSubject}
                          </p>
                          <div className="whitespace-pre-line text-neutral-800 indent-4 font-amiri text-start" dir={isArabic ? 'rtl' : 'ltr'}>
                            {letterContent}
                          </div>
                          <div className="pt-6 text-center select-none">
                            <motion.p
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="text-xl sm:text-2xl text-rose-700 font-extrabold font-display leading-none"
                            >
                              {letterLovePhrase}
                            </motion.p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.section>

              </div>
            </main>

            {/* Custom velvet footer */}
            <footer className="relative z-10 text-center px-4 py-8 mt-10 border-t border-[#ff758f]/20 bg-[#2d040c]/40 backdrop-blur-md">
              <p className="text-xs text-neutral-400 font-bold mb-4">{footerText}</p>
              <p className="text-[10px] mt-6 text-neutral-500 font-bold">
                Made with ❤️ &amp; ✨
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Toggle */}
      {!isLocked && (
        <button className="romantic-music-toggle" onClick={() => setIsMusicPlaying(p => !p)} title={isMusicPlaying ? 'Pause' : 'Play'}>
          {isMusicPlaying ? <Music size={18} /> : <VolumeX size={18} />}
        </button>
      )}

      {/* Astro Image zoom modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-xl w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
              <img className="w-full h-auto max-h-[80vh] object-contain mx-auto" src={selectedPhoto} alt="Preview" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RomanticBirthdayTemplate;
