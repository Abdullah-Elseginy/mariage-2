import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Gift, Heart, LockKeyhole, Music, Pause, Play, Unlock, X } from 'lucide-react';
import './index.css';

const getYouTubeId = (url) => {
  const match = String(url || '').match(/^.*(?:youtu.be\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/);
  return match?.[1] || null;
};

const timeSince = (startDate) => {
  const start = new Date(startDate).getTime();
  const distance = Number.isFinite(start) ? Math.max(0, Date.now() - start) : 0;
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
};

const legacyArabicTranslations = {
  'Someone left something special for you...': 'هناك شخص ترك لك شيئًا مميزًا...',
  'You have received a secret message': 'لقد وصلت إليك رسالة سرية',
  'Open My Message': 'افتح رسالتي',
  'Why do I love you?': 'لماذا أحبك؟',
  'Our Memories': 'ذكرياتنا',
  'A Letter for You': 'رسالة لك',
  'The first time I saw you': 'أول مرة رأيتك فيها',
  'My favorite thing about you': 'أكثر شيء أحبه فيك',
  'Our future': 'مستقبلنا',
  'My heart': 'قلبي',
  'We have been making memories together for': 'نحن نصنع الذكريات معًا منذ',
  'One last thing...': 'شيء أخير...',
  'I Love You': 'أحبك',
  'You are my favorite chapter.': 'أنت فصلي المفضل.',
  'Forever yours': 'لك إلى الأبد',
  'I have something to tell you': 'لدي شيء أريد أن أخبرك به',
  'Something I wanted to say for a long time': 'شيء أردت قوله منذ وقت طويل',
  'You make my days brighter': 'أنت تجعل أيامي أكثر إشراقًا',
  'You make me smile': 'أنت سبب ابتسامتي',
  'You make life beautiful': 'أنت تجعل الحياة أجمل',
  'You are special': 'أنت شخص مميز',
  'Very special': 'مميز جدًا',
  'More than you know': 'أكثر مما تتخيل',
  'Almost there': 'اقتربنا',
  'Love': 'حب',
  'Because your smile changes everything.': 'لأن ابتسامتك تغير كل شيء.',
  'Because talking to you feels like home.': 'لأن الحديث معك يشبه العودة إلى البيت.',
  'Because you make ordinary moments magical.': 'لأنك تجعل اللحظات العادية ساحرة.',
  'Because you are simply you.': 'لأنك ببساطة أنت.',
};

const HappyMessageTemplate = ({ message }) => {
  const { i18n } = useTranslation();
  const isArabic = (i18n.resolvedLanguage || i18n.language || message?.locale || 'en').startsWith('ar');
  const localized = (value, fallback = '') => {
    const text = value || fallback;
    return isArabic ? (legacyArabicTranslations[text] || text) : text;
  };
  const ui = isArabic ? {
    privateMoment: `لحظة خاصة من أجل ${message?.recipient_name || 'أنت'}`,
    reasonsKicker: 'كل ضغطة تكشف حقيقة جديدة',
    revealReason: 'اكشف سببًا آخر',
    allReasons: 'كل الأسباب تقود إليك',
    memoriesKicker: 'لحظات تستحق أن تبقى',
    letterKicker: 'كلمات من القلب',
    boxesKicker: 'أربعة أسرار صغيرة',
    boxesTitle: 'افتح ما احتفظ به قلبي',
    timerKicker: 'قصتنا ما زالت مستمرة',
    play: 'شغّل أغنيتنا',
    playing: 'أغنيتنا تعمل الآن',
    withLove: 'بكل الحب',
    pageTitle: message?.recipient_name ? `رسالة حب إلى ${message.recipient_name}` : 'رسالة حب',
    introFallback: 'هناك شخص ترك لك شيئًا مميزًا...',
    revealedFallback: 'لقد وصلت إليك رسالة سرية',
    openMessage: 'افتح رسالتي',
    openGift: 'افتح الهدية',
    reasonsTitle: 'لماذا أحبك؟',
    galleryTitle: 'ذكرياتنا',
    memory: 'ذكرى',
    memoryCaptions: [
      'لحظة جميلة ما زالت تسكن قلبي',
      'تفصيلة صغيرة صنعت سعادة كبيرة',
      'معك تصبح الذكريات أجمل',
      'صورة تحمل بين تفاصيلها الكثير من الحب',
    ],
    letterTitle: 'رسالة لك',
    timerTitle: 'نحن نصنع الذكريات معًا منذ',
    finalPrompt: 'شيء أخير...',
    finalMessage: 'أحبك',
    finalSubtitle: 'أنت فصلي المفضل.',
    favoriteMemory: 'ذكرياتنا المفضلة',
    closeMemory: 'إغلاق الصورة',
    countdownLove: 'حب',
    defaultLetterMessage: 'حبيبي،\n\nهناك مشاعر كثيرة تسكن قلبي كلما فكرت فيك، لكن الكلمات دائمًا تبدو أصغر من أن تحملها كلها. أصبحت أنت الهدوء في أكثر أيامي ازدحامًا، والابتسامة التي تظهر على وجهي دون سبب، والتفصيلة الجميلة التي تجعل اللحظات العادية ذكريات لا تُنسى.\n\nشكرًا لأنك أنت، بكل ما فيك من جمال وصدق ودفء. شكرًا لكل حديث جمعنا، ولكل ضحكة، ولكل لحظة صنعتها معي وما زلنا نصنعها معًا. لو كان لي أن أختار مكاني المفضل في هذا العالم، فسيكون دائمًا المكان الذي تكون فيه.\n\nأتمنى أن تذكّرك هذه الرسالة الصغيرة بأنك محبوب بصدق، ومقدّر بلا حدود، وقريب من قلبي أكثر مما تستطيع الكلمات أن تصف.',
    defaultSignature: 'لك دائمًا وبكل الحب',
    closeLetter: 'أغلق الرسالة',
    unlockBox: 'اضغط للفتح',
    tapGift: 'اضغط على الهدية',
    units: { days: 'أيام', hours: 'ساعات', minutes: 'دقائق', seconds: 'ثوانٍ' },
  } : {
    privateMoment: `A private moment for ${message?.recipient_name || 'you'}`,
    reasonsKicker: 'Every click tells another truth',
    revealReason: 'Reveal another reason',
    allReasons: 'Every reason leads to you',
    memoriesKicker: 'Moments worth keeping',
    letterKicker: 'Words from the heart',
    boxesKicker: 'Four little secrets',
    boxesTitle: 'Open what my heart has kept',
    timerKicker: 'Our story is still counting',
    play: 'Play our song',
    playing: 'Playing our song',
    withLove: 'With love',
    pageTitle: message?.recipient_name ? `A Love Message for ${message.recipient_name}` : 'A Love Message',
    introFallback: 'Someone left something special for you...',
    revealedFallback: 'You have received a secret message',
    openMessage: 'Open My Message',
    openGift: 'Open gift',
    reasonsTitle: 'Why do I love you?',
    galleryTitle: 'Our Memories',
    memory: 'Memory',
    memoryCaptions: [
      'A beautiful moment that still lives in my heart',
      'A small moment that brought so much happiness',
      'Every memory feels more beautiful with you',
      'A photo holding more love than words can say',
    ],
    letterTitle: 'A Letter for You',
    timerTitle: 'We have been making memories together for',
    finalPrompt: 'One last thing...',
    finalMessage: 'I Love You',
    finalSubtitle: 'You are my favorite chapter.',
    favoriteMemory: 'Our favorite memory',
    closeMemory: 'Close image',
    countdownLove: 'Love',
    defaultLetterMessage: 'My love,\n\nThere are so many things I feel whenever I think of you, but words never seem large enough to hold them all. You have become the calm in my busiest days, the smile that appears without a reason, and the beautiful detail that makes every ordinary moment worth remembering.\n\nThank you for being exactly who you are, for every conversation, every laugh, and every memory we continue to create together. If I could choose my favorite place in this world, it would always be wherever you are.\n\nI hope this little message reminds you that you are deeply loved, endlessly appreciated, and forever close to my heart.',
    defaultSignature: 'Forever yours',
    closeLetter: 'Close letter',
    unlockBox: 'Tap to unlock',
    tapGift: 'Tap the gift',
    units: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
  };
  const content = message?.content || {};
  const intro = content.intro || {};
  const countdownLines = content.countdown_reveal?.lines || [];
  const reasons = content.reasons?.items || [];
  const gallery = content.gallery?.items || [];
  const letter = content.letter || {};
  const boxes = content.secret_boxes?.items || [];
  const timer = content.love_timer || {};
  const final = content.final_surprise || {};
  const audioUrl = content.audio?.url || '';
  const youtubeId = useMemo(() => getYouTubeId(audioUrl), [audioUrl]);
  const audioRef = useRef(null);
  const youtubeFrameRef = useRef(null);
  const introRevealRef = useRef(null);
  const finalRevealRef = useRef(null);
  const [giftOpened, setGiftOpened] = useState(false);
  const [countdownOpen, setCountdownOpen] = useState(false);
  const [countdownIndex, setCountdownIndex] = useState(0);
  const [reasonCount, setReasonCount] = useState(0);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [letterOpen, setLetterOpen] = useState(false);
  const [openBoxes, setOpenBoxes] = useState([]);
  const [elapsed, setElapsed] = useState(() => timeSince(timer.start_date));
  const [finalOpen, setFinalOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const hasCountdown = countdownLines.some((line) => String(line || '').trim());
  const hasReasons = reasons.some((reason) => String(reason || '').trim());
  const hasGallery = gallery.some((memory) => String(memory?.image || '').trim());
  const hasLetter = Boolean(String(letter.message || '').trim());
  const hasBoxes = boxes.some((box) => (
    String(box?.title || '').trim()
    || String(box?.content || '').trim()
  ));
  const hasTimer = Boolean(String(timer.start_date || '').trim());
  const hasFinal = Boolean(
    String(final.message || '').trim()
    || String(final.subtitle || '').trim()
    || String(final.couple_photo || '').trim()
  );

  useEffect(() => {
    const interval = setInterval(() => setElapsed(timeSince(timer.start_date)), 1000);
    return () => clearInterval(interval);
  }, [timer.start_date]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!selectedMemory) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedMemory]);

  useEffect(() => {
    if (!countdownOpen) return undefined;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverscroll = root.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    root.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      root.style.overscrollBehavior = previousRootOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
    };
  }, [countdownOpen]);

  useEffect(() => {
    if (!audioUrl) return;

    if (youtubeId) {
      setPlaying(true);
      return;
    }

    const tryAutoplay = window.setTimeout(() => {
      audioRef.current?.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }, 250);

    return () => window.clearTimeout(tryAutoplay);
  }, [audioUrl, youtubeId]);

  const postYouTubeCommand = (func, args = []) => {
    try {
      youtubeFrameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*',
      );
    } catch (error) {
      console.warn('Failed to control YouTube player:', error);
    }
  };

  useEffect(() => {
    if (!countdownOpen) return undefined;
    if (countdownIndex >= 10) {
      confetti({ particleCount: 140, spread: 100, colors: ['#FF4D6D', '#FF8FA3', '#FFD6DD'] });
      const timeout = setTimeout(() => {
        setCountdownOpen(false);
        document.querySelector('[data-love-section="next"]')?.scrollIntoView({ behavior: 'smooth' });
      }, 1200);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setCountdownIndex((value) => value + 1), 900);
    return () => clearTimeout(timeout);
  }, [countdownIndex, countdownOpen]);

  const toggleAudio = () => {
    if (youtubeId) {
      if (playing) {
        postYouTubeCommand('pauseVideo');
        setPlaying(false);
      } else {
        postYouTubeCommand('playVideo');
        setPlaying(true);
      }
      return;
    }
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setPlaying((value) => !value);
  };

  const revealFinal = () => {
    setFinalOpen(true);
    confetti({ particleCount: 220, spread: 130, origin: { y: 0.65 }, colors: ['#FF4D6D', '#FF8FA3', '#FFFFFF'] });
    window.setTimeout(() => {
      finalRevealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 220);
  };

  const openGift = () => {
    setGiftOpened(true);
    if (audioUrl) {
      if (youtubeId) {
        if (!playing) {
          postYouTubeCommand('playVideo');
          setPlaying(true);
        }
      } else {
        audioRef.current?.play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      }
    }
    window.setTimeout(() => {
      introRevealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 180);
  };

  const openMessage = () => {
    if (hasCountdown) {
      setCountdownIndex(0);
      setCountdownOpen(true);
      return;
    }
    document.querySelector('[data-love-section="next"]')?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentCountdown = Math.max(1, 10 - countdownIndex);
  const currentSentence = localized(countdownLines[countdownIndex] || countdownLines.at(-1), ui.countdownLove);

  return (
    <main className="happy-message-template wil-font-theme" data-font-family={message?.font_family || 'elegant'} dir={isArabic ? 'rtl' : 'ltr'}>
      <Helmet><title>{ui.pageTitle}</title></Helmet>
      <div className="love-scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <div className="love-ambient" aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => <span key={index} style={{ '--x': `${(index * 37) % 100}%`, '--size': `${10 + (index % 5) * 3}px`, '--duration': `${13 + (index % 7) * 2}s`, '--delay': `${index * -0.7}s`, '--drift': `${(index % 2) * 40 - 20}px` }}>{index % 4 === 0 ? '♥' : '✦'}</span>)}
      </div>

      <section className="love-section mystery-section">
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="love-eyebrow">{ui.privateMoment}</motion.p>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{localized(intro.teaser, ui.introFallback)}</motion.h1>
        <motion.button className={`gift-button ${giftOpened ? 'is-open' : ''}`} whileTap={{ scale: 0.94 }} onClick={openGift} aria-label={ui.openGift}><Gift /></motion.button>
        {!giftOpened && <motion.div className="gift-hint" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}><span>{ui.tapGift}</span><span className="gift-hint-arrow" aria-hidden="true">↑</span></motion.div>}
        <AnimatePresence>
          {giftOpened && <motion.div ref={introRevealRef} className="intro-reveal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><h2>{localized(intro.revealed_message, ui.revealedFallback)} <Heart fill="currentColor" /></h2><button type="button" onClick={openMessage}>{localized(intro.open_button, ui.openMessage)}</button></motion.div>}
        </AnimatePresence>
      </section>

      {hasReasons && <section id="love-reasons" data-love-section="next" className="love-section reasons-section">
        <p className="love-eyebrow">{ui.reasonsKicker}</p>
        <h2>{localized(content.reasons?.title, ui.reasonsTitle)}</h2>
        <div className="reason-stack">
          {reasons.slice(0, reasonCount).map((reason, index) => <motion.article key={`${reason}-${index}`} initial={{ opacity: 0, y: 30, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: index % 2 ? 1 : -1 }}>{localized(reason)}</motion.article>)}
        </div>
        <button className="love-primary-button" type="button" disabled={reasonCount >= reasons.length} onClick={() => setReasonCount((count) => Math.min(reasons.length, count + 1))}>{reasonCount >= reasons.length ? ui.allReasons : ui.revealReason}</button>
      </section>}

      {hasGallery && <section data-love-section={hasReasons ? undefined : 'next'} className="love-section gallery-section">
        <p className="love-eyebrow">{ui.memoriesKicker}</p>
        <h2>{localized(content.gallery?.title, ui.galleryTitle)}</h2>
        <div className="polaroid-grid">
          {gallery.map((memory, index) => {
            const caption = memory.title || ui.memoryCaptions[index % ui.memoryCaptions.length];
            return <motion.button key={`${memory.image}-${index}`} type="button" className="polaroid" whileHover={{ y: -8, rotate: 0 }} style={{ transform: `rotate(${index % 2 ? 2 : -2}deg)` }} onClick={() => setSelectedMemory(memory)}><img src={memory.image} alt={caption} /><strong>{caption}</strong><span>{memory.date}</span></motion.button>;
          })}
        </div>
      </section>}

      {hasLetter && <section data-love-section={!hasReasons && !hasGallery ? 'next' : undefined} className="love-section letter-section">
        <p className="love-eyebrow">{ui.letterKicker}</p>
        <h2>{localized(letter.title, ui.letterTitle)}</h2>
        <div className={`love-envelope ${letterOpen ? 'is-open' : ''}`} role="button" tabIndex={0} onClick={() => { if (!letterOpen) setLetterOpen(true); }} onKeyDown={(event) => { if (!letterOpen && (event.key === 'Enter' || event.key === ' ')) setLetterOpen(true); }}><span className="envelope-flap" /><span className="envelope-letter"><strong>{localized(letter.title, ui.letterTitle)}</strong><p>{localized(letter.message, ui.defaultLetterMessage)}</p><em>{localized(letter.signature, ui.defaultSignature)}</em><button className="letter-close-button" type="button" onClick={(event) => { event.stopPropagation(); setLetterOpen(false); }}><X /> {ui.closeLetter}</button></span><Heart fill="currentColor" /></div>
      </section>}

      {hasBoxes && <section data-love-section={!hasReasons && !hasGallery && !hasLetter ? 'next' : undefined} className="love-section boxes-section">
        <p className="love-eyebrow">{ui.boxesKicker}</p>
        <h2>{ui.boxesTitle}</h2>
        <div className="secret-grid">
          {boxes.map((box, index) => {
            const open = openBoxes.includes(index);
            const boxTitle = localized(box.title, ui.unlockBox);
            const boxContent = String(box.content || '').trim();
            return <motion.button key={`${box.title}-${index}`} type="button" whileTap={{ scale: 0.97 }} onClick={() => setOpenBoxes((current) => current.includes(index) ? current : [...current, index])} className={open ? 'is-open' : ''}>{open ? <Unlock /> : <LockKeyhole />}<strong>{open ? boxTitle : ui.unlockBox}</strong><AnimatePresence>{open && boxContent && <motion.p className="secret-box-message" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>{localized(boxContent)}</motion.p>}</AnimatePresence></motion.button>;
          })}
        </div>
      </section>}

      {hasTimer && <section data-love-section={!hasReasons && !hasGallery && !hasLetter && !hasBoxes ? 'next' : undefined} className="love-section timer-section">
        <p className="love-eyebrow">{ui.timerKicker}</p>
        <h2>{localized(timer.title, ui.timerTitle)}</h2>
        <div className="love-timer">{Object.entries(elapsed).map(([label, value]) => <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{ui.units[label]}</span></div>)}</div>
      </section>}

      {hasFinal && <section data-love-section={!hasReasons && !hasGallery && !hasLetter && !hasBoxes && !hasTimer ? 'next' : undefined} className={`love-section final-section ${finalOpen ? 'is-open' : ''}`}>
        <p className="love-eyebrow">{localized(final.prompt, ui.finalPrompt)}</p>
        <motion.button className="final-heart" type="button" whileTap={{ scale: 0.9 }} onClick={revealFinal}><Heart fill="currentColor" /></motion.button>
        <AnimatePresence>{finalOpen && <motion.div ref={finalRevealRef} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}><h2>{localized(final.message, ui.finalMessage)} <Heart fill="currentColor" /></h2><p>{localized(final.subtitle, ui.finalSubtitle)}</p>{final.couple_photo && <img src={final.couple_photo} alt={ui.favoriteMemory} />}{message?.sender_name && <small>{ui.withLove}, {message.sender_name}</small>}</motion.div>}</AnimatePresence>
      </section>}

      <AnimatePresence>{countdownOpen && <motion.div className="countdown-cinema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.strong key={currentCountdown} initial={{ opacity: 0, scale: 1.6 }} animate={{ opacity: 1, scale: 1 }}>{countdownIndex >= 9 ? '♥' : currentCountdown}</motion.strong><motion.p key={currentSentence} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>{currentSentence}</motion.p></motion.div>}</AnimatePresence>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>{selectedMemory && <motion.div className="memory-modal" dir={isArabic ? 'rtl' : 'ltr'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMemory(null)}><motion.article initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} onClick={(event) => event.stopPropagation()}><button type="button" aria-label={ui.closeMemory} onClick={() => setSelectedMemory(null)}><X /></button><img src={selectedMemory.image} alt={selectedMemory.title || ui.memory} /><h3>{selectedMemory.title}</h3><p>{selectedMemory.description}</p><time>{selectedMemory.date}</time></motion.article></motion.div>}</AnimatePresence>,
        document.body,
      )}

      {audioUrl && !youtubeId && <audio ref={audioRef} src={audioUrl} loop onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />}
      {youtubeId && <iframe ref={youtubeFrameRef} className="love-youtube-audio" title="Our song" src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&loop=1&playlist=${youtubeId}&controls=0&playsinline=1`} allow="autoplay; encrypted-media" onLoad={() => { window.setTimeout(() => { postYouTubeCommand('setVolume', [40]); if (playing) postYouTubeCommand('playVideo'); }, 250); }} />}
      {audioUrl && <div className="love-music"><button type="button" onClick={toggleAudio}>{playing ? <Pause /> : <Play />}</button><Music /><span>{playing ? ui.playing : ui.play}</span></div>}
    </main>
  );
};

export default HappyMessageTemplate;
