import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, VolumeX } from 'lucide-react';
import {
  Rain,
  LockGate,
  Hero,
  Countdown,
  Wishes,
  Album,
  EnvelopeLetter,
  Footer,
  CelebrationReveal
} from '../../sections';

import birthdayBanner from '../../../../assets/images/birthday_banner.png';
import loveLetterBg from '../../../../assets/images/love_letter_bg.png';

import './index.css';

// Web Audio API Plucks Helper Definitions
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playHarpPluck(frequency, type = 'sine', duration = 0.8) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
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
    console.warn('Audio context not supported yet or gesture required', e);
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

function playWarmHarmony() {
  const notes = [329.63, 392.00, 493.88, 587.33];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playHarpPluck(freq, 'sine', 1.5);
    }, idx * 150);
  });
}

const getYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

let bgAudio = null;
let currentMusicUrl = null;
let musicRequested = true;

function initAudio(musicUrl) {
  if (getYouTubeId(musicUrl)) {
    if (bgAudio) {
      bgAudio.pause();
      bgAudio = null;
      currentMusicUrl = null;
    }
    return;
  }
  if (bgAudio && currentMusicUrl === musicUrl) return;
  try {
    if (bgAudio) {
      bgAudio.pause();
    }
    if (musicUrl) {
      bgAudio = new Audio(musicUrl);
      bgAudio.loop = true;
      bgAudio.volume = 0.4;
      currentMusicUrl = musicUrl;
      console.log('Background native audio initialized.');
    } else {
      bgAudio = null;
      currentMusicUrl = null;
    }
  } catch (e) {
    console.error('Failed to initialize background music:', e);
  }
}

function playAudioSync(musicUrl) {
  if (getYouTubeId(musicUrl)) return;
  initAudio(musicUrl);
  if (bgAudio && musicRequested) {
    bgAudio.play().then(() => {
      console.log('Audio sync successful');
    }).catch((e) => {
      console.warn('Audio play sync gesture failed/blocked:', e);
    });
  }
}

function startAmbientMusic(isPlaying, musicUrl) {
  if (getYouTubeId(musicUrl)) {
    if (bgAudio) {
      bgAudio.pause();
    }
    return;
  }
  initAudio(musicUrl);
  if (!bgAudio) return;

  if (isPlaying) {
    musicRequested = true;
    bgAudio.play().then(() => {
      console.log('Ambient music playing');
    }).catch((e) => {
      console.warn('Ambient music play failed (awaiting interaction):', e);
    });
  } else {
    musicRequested = false;
    bgAudio.pause();
    console.log('Ambient music paused');
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
    return album.images_text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return [];
};

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

const DefaultBirthdayTemplate = ({ greeting }) => {
  const isArabic = greeting?.locale === 'ar';
  
  // Unpack Customizable Settings
  const content = greeting?.content || {};
  const basic = content.basic || {};
  const hero = content.hero || {};
  const countdown = content.countdown || {};
  const wishesList = Array.isArray(content.wishes?.items) ? content.wishes.items : EMPTY_ARRAY;
  const album = content.album || {};
  const letter = content.letter || {};
  const audio = content.audio || {};
  const footer = content.footer || {};

  // Form Fallbacks
  const recipientName = greeting?.recipient_name || 'Recipient';
  const senderName = greeting?.sender_name || 'Sender';
  const unlockPasscode = String(basic.passcode || '942026');
  
  const heroKicker = hero.kicker || (isArabic ? 'احتفالاً بيوم ميلادك المميز 💖' : 'Celebrating Your Special Day 💖');
  const heroQuote = hero.quote || (isArabic ? '"عامك الجديد وعمري ما يكملوش غير بنور عينيكي وضحكة قلبك الصافية"' : '"Your new year and my life are incomplete without the light of your eyes and the laughter of your pure heart."');
  const heroBirthdate = hero.birthdate || '11 • 06 • 2009';
  const albumImages = getAlbumImages(album);
  const primaryAlbumImage = albumImages[0] || null;
  const secondaryAlbumImage = albumImages[1] || albumImages[0] || null;
  const customBannerImage = hero.banner_image && !isDefaultLocalAsset(hero.banner_image) ? hero.banner_image : null;
  const customAvatarImage = hero.avatar_image && !isDefaultLocalAsset(hero.avatar_image) ? hero.avatar_image : null;
  const bannerImg = primaryAlbumImage || customBannerImage || birthdayBanner;
  const avatarImg = secondaryAlbumImage || customAvatarImage || null;
  const avatarTitle = recipientName;
  const avatarSubtitle = hero.avatar_subtitle || (isArabic ? `${recipientName} سر سعادتي وعمري 🌹` : `${recipientName}, the secret to my happiness and life 🌹`);

  const countdownDate = countdown.target_date || '2026-06-11T00:00:00+03:00';
  const countdownTitle = countdown.title || (isArabic ? 'THE BIRTHDAY COUNTDOWN • العد التنازلي المنتظر' : 'THE BIRTHDAY COUNTDOWN • The Awaited Moment');
  const countdownPending = countdown.pending_text || (isArabic ? 'الوقت المتبقي على عيد ميلاد اجمل انسانه في الكون 💖' : 'Time remaining until the birthday of the most beautiful person in the universe 💖');
  const countdownCompletedTitle = countdown.completed_title || (isArabic ? `🎉🎂 كل عام وأنتِ أسعد وأجمل يا ${recipientName}! 🎂🎉` : `🎉🎂 Happy Birthday, ${recipientName}! 🎂🎉`);
  const countdownCompletedText = countdown.completed_text || (isArabic ? 'يوم ميلادكِ السعيد بدأ الآن.. جعل الله كل أيامكِ فرحة وسروراً بجانبي ونبضات حبنا لا تنتهي أبداً! 💖✨' : 'Your happy birthday has started now.. May all your days be filled with joy by my side! 💖✨');

  const wishesTitle = wishesList.length > 0 ? (content.wishes?.title || (isArabic ? 'أمنيات خاصة 💖' : 'Special Wishes 💖')) : (isArabic ? 'أمنيات خاصة 💖' : 'Special Wishes 💖');
  const wishes = useMemo(() => {
    return wishesList.length > 0 ? wishesList : [
      { text: isArabic ? 'كل سنة وأنتِ جوة قلبي، كل عام وأنتِ حبي الأول والأخير وروحي وسر ضحكتي وسعادتي يا كل حياتي...' : 'Happy Birthday to the one who makes my world complete. May your year be filled with love and joy!', tags: isArabic ? ['حبي الأبدي ✨', 'حبنا بيكبر ❤️'] : ['Forever Love ✨', 'Growing Together ❤️'] },
      { text: isArabic ? 'يا رب يباركلي في عمرك يا حبيبتي، ويخلي أيامنا كلها حب وضحكة حلوة وراحة بال على طول سوا. | دنيتي الجميلة 🌱, سند وعمر 🙌' : 'Wishing you a lifetime of laughter, shared dreams, and endless happiness by my side.', tags: isArabic ? ['دنيتي الجميلة 🌱', 'سند وعمر 🙌'] : ['My Beautiful World 🌱', 'My Support & Companion 🙌'] },
      { text: isArabic ? 'يا نور عيني ويا حتة من روحي، كل سنة وأنتِ طيبة ومعايا وجنبي، ومنورالي حياتي يا أغلى وأجمل ما عندي في الدنيا.' : 'You are the light of my life and the joy in my heart. Happy Birthday, my dearest one.', tags: isArabic ? ['عشق ملوش آخر 🌹', 'نور عيوني 💫'] : ['Endless Love 🌹', 'Light of My Eyes 💫'] },
      { text: isArabic ? 'أنتِ مش بس فرحة يوم ميلادك، أنتِ فرحة العمر كله اللي كنت بتمناها، ربنا يديمك ليا يا أحلى حاجة حصلتلي.' : 'You are not just a blessing for today, but for a lifetime. Happy Birthday to my favorite person.', tags: isArabic ? ['نبض واحد 💞', 'حبيبة قلبي 🔗'] : ['One Beat 💞', 'Heart and Soul 🔗'] }
    ];
  }, [wishesList, isArabic]);

  const albumTitle = album.title || (isArabic ? 'ALBUM OF MEMORIES • ألبوم الذكريات' : 'ALBUM OF MEMORIES • Our Beautiful Moments');
  const albumDesc = album.description || (isArabic ? 'صور محفورة في القلب، ولحظات لا تُنسى بتفاصيلها الجميلة. اضغطي على أي صورة لرؤيتها بوضوح وحفظها كذكرى مخلدة 🌹' : 'Photos carved in the heart, and unforgettable moments with beautiful details. Click any photo to zoom in 🌹');
  const albumPhotos = albumImages;

  const letterTitle = letter.title || (isArabic ? `رسالة حب سرية مخصصة لـ ${recipientName} 💖` : `A Secret Love Letter Dedicated to ${recipientName} 💖`);
  const letterDesc = letter.description || (isArabic ? 'اضغطي على الختم في المنتصف لفتح الرسالة الخاصة والاستماع للألحان 💌' : 'Click the seal in the middle to open the private letter and listen to the music 💌');
  const letterSubject = letter.letter_title || (isArabic ? 'عيد ميلاد أحلى وأجمل وأطيب 17 في الدنيا كلها.. 🎂✨' : 'Happy Birthday to the most beautiful person in the world.. 🎂✨');
  const letterContent = letter.letter_content || (isArabic ? 'كل سنة وأنتِ طيبة يا أجمل حاجة حصلتلي في حياتي. النهار ده مش مجرد عيد ميلادك، ده يوم مميز عشان اتولدت فيه أغلى إنسانة في حياتي.\n\nكل سنة وأنتِ حبيبتي، وصاحبتي، وبنتي، وأجمل قدر ربنا كتبهولي. كل سنة وأنتِ جنبي، وسندي، وفرحتي. ربنا يديم ضحكتك السكر اللي بموت فيها دي وتفضل تنور أي مكان.\n\nربنا يسعد قلبك زي ما بتسعدي قلبي كل يوم. يا رب أفضل طول العمر أشوف الفرحة في عينيكي وأكون سبب في ابتسامتك. نفسي والله كل أعياد ميلادك نحتفل بيها سوا وإحنا بنحقق أحلامنا، وبإذن الله في يوم من الأيام أكون موجود جنبك ونحتفل بيه مع بعض.' : 'Happy Birthday to the best thing that ever happened to me in my life. Today is not just your birthday, it is a special day because the most precious person in my life was born.\n\nHappy Birthday, my love, my friend, my daughter, and the most beautiful destiny God wrote for me. Happy Birthday to you beside me, my support, and my joy.');
  const letterLovePhrase = letter.love_phrase || (isArabic ? 'بحبكككككككككككككك 💗💗💗' : 'I love you so much 💗💗💗');

  const audioUrl = audio.url || '';
  const youtubeId = useMemo(() => getYouTubeId(audioUrl), [audioUrl]);

  const footerText = footer.text || (isArabic ? 'شكراً لمشاركتنا لحظاتكم السعيدة 🌹' : 'Thank you for sharing your happy moments with us 🌹');

  const iframeRef = useRef(null);

  // State Definitions
  const [currentWishIndex, setCurrentWishIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterCharIndex, setTypewriterCharIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [lovePulses, setLovePulses] = useState([
    {
      id: 'p1',
      message: isArabic ? 'أُرسلت نبضة مودة ودفء متبادل 🌹✨' : 'Sent warmth and love pulse 🌹✨',
      timestamp: isArabic ? 'صباح اليوم' : 'This morning',
      emoji: '❤️'
    }
  ]);

  const [rainParticles, setRainParticles] = useState([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [loveCount, setLoveCount] = useState(() => {
    const cached = localStorage.getItem(`love_count_${greeting?.id || 'default'}`);
    return cached ? parseInt(cached, 10) : 72;
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  const [isLocked, setIsLocked] = useState(true);
  const [route, setRoute] = useState('lock');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  // Countdown calculations
  const targetDate = useMemo(() => new Date(countdownDate), [countdownDate]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Generate rain particles
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 15; i++) {
      list.push({
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: Math.random() * 8 + 6,
        size: Math.random() * 16 + 8,
        rotation: Math.random() * 360,
        type: i % 3 === 0 ? 'rose' : i % 3 === 1 ? 'star' : 'heart'
      });
    }
    setRainParticles(list);
  }, []);

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
      initAudio(audioUrl);
      if (bgAudio) {
        if (isMusicPlaying) {
          bgAudio.play().catch(() => {});
        } else {
          bgAudio.pause();
        }
      }
    }
  }, [isLocked, isMusicPlaying, audioUrl, youtubeId]);

  // ── Global User Interaction Audio Bypass ─────────────────────────────────────
  useEffect(() => {
    const handleGlobalInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (isMusicPlaying && !isLocked && !youtubeId) {
          playAudioSync(audioUrl);
        }
      }
    };
    window.addEventListener('click', handleGlobalInteraction);
    window.addEventListener('touchstart', handleGlobalInteraction);
    window.addEventListener('keydown', handleGlobalInteraction);
    return () => {
      window.removeEventListener('click', handleGlobalInteraction);
      window.removeEventListener('touchstart', handleGlobalInteraction);
      window.removeEventListener('keydown', handleGlobalInteraction);
    };
  }, [hasInteracted, isMusicPlaying, isLocked, audioUrl, youtubeId]);

  // Cleanup native audio on unmount
  useEffect(() => {
    return () => {
      if (bgAudio) {
        bgAudio.pause();
        bgAudio = null;
        currentMusicUrl = null;
      }
    };
  }, []);

  // Typewriter wish cycler
  useEffect(() => {
    if (wishes.length === 0) return;
    
    // Safety check if index is out of bounds
    const idx = currentWishIndex >= wishes.length ? 0 : currentWishIndex;
    const activeWish = wishes[idx] || wishes[0];
    const activeText = activeWish?.text || '';

    let timer;

    if (!isErasing) {
      if (typewriterCharIndex < activeText.length) {
        timer = setTimeout(() => {
          setTypewriterText((prev) => prev + activeText.charAt(typewriterCharIndex));
          setTypewriterCharIndex((prev) => prev + 1);
        }, 80);
      } else {
        timer = setTimeout(() => {
          setIsErasing(true);
        }, 4500);
      }
    } else {
      if (typewriterCharIndex > 0) {
        timer = setTimeout(() => {
          setTypewriterText((prev) => prev.substring(0, typewriterCharIndex - 1));
          setTypewriterCharIndex((prev) => prev - 1);
        }, 40);
      } else {
        setIsErasing(false);
        setCurrentWishIndex((prev) => (prev + 1) % wishes.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentWishIndex, typewriterCharIndex, isErasing, wishes]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      playAudioSync(audioUrl);
      startAmbientMusic(true, audioUrl);
    }
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    
    if (isPasscodeMatch(passwordInput, unlockPasscode)) {
      setPasswordError(null);
      setIsUnlocking(true);
      playChimeCascade();
      
      playAudioSync(audioUrl);
      setHasInteracted(true);
      
      setTimeout(() => {
        setIsLocked(false);
        setRoute('celebration');
        setIsUnlocking(false);
      }, 1500);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 3) {
        setPasswordError(isArabic ? 'فكري في تاريخ اول يوم عرفتك فيه .. 💖' : 'Think of the date of the first day we met.. 💖');
      } else {
        setPasswordError(isArabic ? 'التاريخ ده مش صح يا حبيبتي.. فكري تاني في يومنا المميز 💖' : 'Incorrect date, my love.. Think of our special day 💖');
      }
      playHarpPluck(261.63, 'triangle', 0.6);
      showToast(isArabic ? 'تاريخ غير صحيح.. جرب تاني 🌸' : 'Incorrect date.. try again 🌸');
      setTimeout(() => {
        setPasswordInput('');
      }, 800);
    }
  };

  const handleSendLovePulse = () => {
    const nextCount = loveCount + 1;
    setLoveCount(nextCount);
    localStorage.setItem(`love_count_${greeting?.id || 'default'}`, nextCount.toString());

    playChimeCascade();

    const burstParticles = [];
    for (let i = 0; i < 22; i++) {
      burstParticles.push({
        id: Math.random(),
        left: Math.random() * 100,
        delay: 0,
        duration: Math.random() * 3 + 1.5,
        size: Math.random() * 24 + 14,
        rotation: Math.random() * 360,
        type: i % 2 === 0 ? 'rose' : 'heart'
      });
    }

    setRainParticles((prev) => [...burstParticles, ...prev.slice(0, 30)]);

    const timestamp = new Date().toLocaleTimeString(isArabic ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const quotes = isArabic ? [
      'أرسل نبضة حب دافئة من المودة ❤️',
      'أرسل باقة ورد رقمية افتراضية معطرة عهدًا بالوفاء 🌹',
      'دعا لك ببهجة وسعادة تملأ فؤادك في عامك الجديد وعيد ميلادك السعيد ✨',
      'يرسل لك مودة نابضة بعطر الجوري الأحمر 💘'
    ] : [
      'sent a warm pulse of love and affection ❤️',
      'sent a virtual fragrant bouquet of roses 🌹',
      'wished you infinite happiness on your birthday ✨',
      'sent you a pulse of red roses 💘'
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const cleanMsg = `${senderName} ${randomQuote} ${isArabic ? 'إلى' : 'to'} ${recipientName}`;

    const newPulse = {
      id: 'p-' + Date.now(),
      message: cleanMsg,
      timestamp: isArabic ? `في تمام الساعة ${timestamp}` : `at ${timestamp}`,
      emoji: Math.random() > 0.5 ? '❤️' : '✨'
    };

    setLovePulses((prev) => [newPulse, ...prev].slice(0, 15));
    showToast(isArabic ? `أُرسلت نبضة مودة ودفء متبادل بين ${senderName} و ${recipientName}! ❤️🌹` : `Sent a warm love pulse from ${senderName} to ${recipientName}! ❤️🌹`);
  };

  const displayNames = [recipientName, senderName].filter(Boolean).join(isArabic ? ' و ' : ' & ');
  const pageTitle = `${displayNames} | ${isArabic ? 'ميلاد سعيد' : 'Happy Birthday'}`;

  return (
    <div className="birthday-template-wrapper arabesque-texture relative flex min-h-screen flex-col justify-between overflow-x-hidden selection:bg-secondary-container selection:text-on-secondary-container" dir={isArabic ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&family=Playfair+Display:ital,wght@0,600;0,800;1,600;1,800&family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      </Helmet>

      <Rain rainParticles={rainParticles} />

      {youtubeId && !isLocked && (
        <iframe
          ref={iframeRef}
          title="YouTube Background Music"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&loop=1&playlist=${youtubeId}&controls=0&mute=0`}
          allow="autoplay"
          className="hidden"
          style={{ display: 'none', width: 0, height: 0 }}
        />
      )}

      {/* Toast Alert logs */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="glass-card fixed top-16 inset-x-4 max-w-sm mx-auto z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-outline-variant/35"
          >
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-sm">
              ❤️
            </div>
            <p className="text-xs font-semibold text-on-surface-variant leading-normal flex-1 text-start">
              {toastMessage}
            </p>
            <button onClick={() => setToastMessage(null)} className="text-[#8b716e] hover:text-[#1d1b19]">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {route === 'lock' ? (
          <LockGate
            isArabic={isArabic}
            isUnlocking={isUnlocking}
            attempts={attempts}
            passwordInput={passwordInput}
            setPasswordInput={setPasswordInput}
            passwordError={passwordError}
            handleUnlock={handleUnlock}
            handleFirstInteraction={handleFirstInteraction}
            avatarImg={avatarImg}
            avatarTitle={avatarTitle}
            recipientName={recipientName}
            rainParticles={rainParticles}
            setIsMusicPlaying={setIsMusicPlaying}
            startAmbientMusic={startAmbientMusic}
            audioUrl={audioUrl}
            playHarpPluck={playHarpPluck}
          />
        ) : route === 'celebration' ? (
          <CelebrationReveal
            isArabic={isArabic}
            recipientName={recipientName}
            onComplete={() => {
              setRoute('home');
              setIsMusicPlaying(true);
              playWarmHarmony();
            }}
          />
        ) : (
          <motion.div
            key="home-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="flex-grow flex flex-col justify-between"
          >
            {/* Home Content flow */}
            <main className="flex-grow py-8 max-w-3xl w-full mx-auto px-4 relative z-20">
              <div className="space-y-10 md:space-y-16">
                
                {/* Hero section */}
                <Hero
                  isArabic={isArabic}
                  bannerImg={bannerImg}
                  isMusicPlaying={isMusicPlaying}
                  recipientName={recipientName}
                  heroBirthdate={heroBirthdate}
                  heroQuote={heroQuote}
                  handleSendLovePulse={handleSendLovePulse}
                  heroKicker={heroKicker}
                  avatarImg={avatarImg}
                  avatarTitle={avatarTitle}
                  avatarSubtitle={avatarSubtitle}
                  onPolaroidClick={avatarImg ? () => {
                    setSelectedPhoto(avatarImg);
                    setIsPhotoModalOpen(true);
                  } : undefined}
                />

                {/* Countdown Timer Section */}
                <Countdown
                  isArabic={isArabic}
                  countdownTitle={countdownTitle}
                  timeLeft={timeLeft}
                  countdownCompletedTitle={countdownCompletedTitle}
                  countdownCompletedText={countdownCompletedText}
                  avatarTitle={avatarTitle}
                  countdownPending={countdownPending}
                  heroBirthdate={heroBirthdate}
                />

                {/* Wishes Section */}
                <Wishes
                  isArabic={isArabic}
                  wishesTitle={wishesTitle}
                  typewriterText={typewriterText}
                  wishes={wishes}
                  currentWishIndex={currentWishIndex}
                />

                {/* Photo Album Memories */}
                <Album
                  isArabic={isArabic}
                  albumTitle={albumTitle}
                  albumDesc={albumDesc}
                  albumPhotos={albumPhotos}
                  onPhotoClick={(photo) => {
                    setSelectedPhoto(photo);
                    setIsPhotoModalOpen(true);
                  }}
                />

                {/* Final Love Letter Envelope */}
                <EnvelopeLetter
                  isArabic={isArabic}
                  loveLetterBg={loveLetterBg}
                  isEnvelopeOpen={isEnvelopeOpen}
                  setIsEnvelopeOpen={setIsEnvelopeOpen}
                  playChimeCascade={playChimeCascade}
                  letterTitle={letterTitle}
                  letterDesc={letterDesc}
                  letterSubject={letterSubject}
                  letterContent={letterContent}
                  letterLovePhrase={letterLovePhrase}
                />
              </div>
            </main>

            {/* Custom footer */}
            <Footer
              isArabic={isArabic}
              footerText={footerText}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music toggle */}
      {!isLocked && (
        <button className="music-toggle" onClick={() => setIsMusicPlaying(p => !p)} title={isMusicPlaying ? 'Pause' : 'Play'}>
          {isMusicPlaying ? <Music size={18} /> : <VolumeX size={18} />}
        </button>
      )}

      {/* Zoom photo modal */}
      <AnimatePresence>
        {isPhotoModalOpen && selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsPhotoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-2xl w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>

              <img className="w-full h-auto max-h-[82vh] object-contain mx-auto animate-fade-in" src={selectedPhoto} alt="Zoomed view" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DefaultBirthdayTemplate;
