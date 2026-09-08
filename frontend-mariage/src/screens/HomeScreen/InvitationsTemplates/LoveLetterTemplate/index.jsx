import React, { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiHeart,
  FiMapPin,
  FiLock,
  FiMaximize2,
  FiPause,
  FiPlay,
  FiSend,
  FiX,
} from 'react-icons/fi';
import { CustomBottom, CustomInput } from '../../../../components';
import { submitInvitationRsvp } from '../../../../store/invitationSlice';
import CoupleName from '../../components/CoupleName';
import PartyUpload from '../../sections/PartyUpload';
import CurtainPanels from '../../../LoadingScreen/CurtainPanels';
import '../../../LoadingScreen/loadingScreen.css';
import loveLetterVideo from '../../../../assets/videos/background2.mp4';
import brideCurtain from '../../../../assets/images/loading/bride-curtain.png';
import groomCurtain from '../../../../assets/images/loading/groom-curtain.png';
import './index.css';

const revealViewport = { once: true, amount: 0.18 };
const rise = { hidden: { opacity: 0, y: 28 }, shown: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, shown: { transition: { staggerChildren: 0.12 } } };

const labelsByLocale = {
  ar: {
    received: 'لقد وصلتك دعوة زفاف',
    open: 'افتح الدعوة',
    heroTitle: 'نشارككم أجمل لحظاتنا',
    story: 'قصتنا',
    gallery: 'صورنا',
    details: 'تفاصيل الحفل',
    saveDate: 'احفظ الموعد',
    letter: 'رسالة خاصة',
    location: 'افتح الموقع',
    phone: 'رقم الهاتف',
    guests: 'عدد الضيوف',
    finalTitle: 'شكرا لمشاركتنا هذه اللحظة المميزة',
    finalText: 'ننتظر الاحتفال معكم بكل حب',
  },
  en: {
    received: 'You Have Received A Wedding Invitation',
    open: 'Open Invitation',
    heroTitle: 'Welcome To Our Wedding Celebration',
    story: 'Our Love Story',
    gallery: 'Gallery',
    details: 'Event Details',
    saveDate: 'Save The Date',
    letter: 'Personal Message',
    location: 'Open Location',
    phone: 'Phone Number',
    guests: 'Number Of Guests',
    finalTitle: 'Thank You For Sharing This Special Moment With Us',
    finalText: "We Can't Wait To Celebrate Together",
  },
};

const buildMapsUrl = (event = {}) => {
  if (event.map_url) return event.map_url;
  const query = [event.venue, event.location, event.address].filter(Boolean).join(', ');
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '';
};

const getYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const LoveLetterAudioPlayer = ({ invitation, playSignal = 0 }) => {
  const audioCopy = invitation?.audio || {};
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);
  const iframeRef = React.useRef(null);
  const playAudioRef = React.useRef(null);

  const youtubeId = getYouTubeId(audioCopy.src);
  const isDisabled = audioCopy.is_enabled === false;

  useEffect(() => {
    if (isDisabled || !audioCopy.src) return undefined;

    if (youtubeId) {
      playAudioRef.current = () => {
        if (!iframeRef.current?.contentWindow) return;
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        const targetVol = Math.round(Number(audioCopy.volume ?? 0.4) * 100);
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [targetVol] }), '*');
        setIsPlaying(true);
      };

      return () => {
        playAudioRef.current = null;
      };
    }

    const audio = new Audio(audioCopy.src);
    audio.loop = true;
    audio.volume = Number(audioCopy.volume ?? 0.4);
    audioRef.current = audio;

    playAudioRef.current = () => {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };

    return () => {
      audio.pause();
      audioRef.current = null;
      playAudioRef.current = null;
    };
  }, [audioCopy.src, audioCopy.volume, isDisabled, youtubeId]);

  useEffect(() => {
    if (isDisabled) return;
    if (playSignal > 0) playAudioRef.current?.();
  }, [isDisabled, playSignal]);

  if (isDisabled || !audioCopy.src) return null;

  const togglePlay = () => {
    if (isPlaying) {
      if (youtubeId) {
        iframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        audioRef.current?.pause();
      }
      setIsPlaying(false);
      return;
    }

    if (youtubeId) {
      iframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      const targetVol = Math.round(Number(audioCopy.volume ?? 0.4) * 100);
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [targetVol] }), '*');
      setIsPlaying(true);
    } else {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        type="button"
        onClick={togglePlay}
        className="group relative grid h-14 w-14 place-items-center rounded-full border border-[#c58c85]/25 bg-[#fffdf8]/92 text-[#9f6f68] shadow-[0_18px_44px_rgba(197,140,133,0.18)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#c58c85]/45 hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#c58c85]/20"
        aria-label={isPlaying ? audioCopy.pause : audioCopy.play}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f8d7da] text-[#9f6f68]">
          {isPlaying ? <FiPause /> : <FiPlay className="ms-0.5" />}
        </span>
      </button>
      {isPlaying ? <span className="absolute inset-0 -z-10 rounded-full bg-[#f8d7da]/50 blur-md" /> : null}

      {youtubeId && (
        <iframe
          ref={iframeRef}
          title="YouTube Background Music"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&loop=1&playlist=${youtubeId}&controls=0&mute=0`}
          allow="autoplay"
          className="hidden"
          style={{ display: 'none', width: 0, height: 0 }}
        />
      )}
    </div>
  );
};

const Petals = ({ count = 18 }) => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
    {Array.from({ length: count }, (_, index) => (
      <motion.span
        key={index}
        animate={{
          y: ['-12vh', '112vh'],
          x: [0, index % 2 ? -34 : 34, 0],
          rotate: [0, 180, 360],
          opacity: [0, 0.72, 0.5, 0],
        }}
        transition={{ duration: 10 + (index % 5), delay: index * 0.32, repeat: Infinity, ease: 'linear' }}
        className="absolute h-5 w-3 rounded-[80%_18%_76%_20%] bg-[linear-gradient(135deg,#fff7f0,#e7b9ad_52%,#9b5d56)] shadow-[0_8px_18px_rgba(116,63,58,0.18)]"
        style={{ left: `${3 + ((index * 19) % 94)}%` }}
      />
    ))}
  </div>
);

const FloralCorner = ({ className = '' }) => (
  <div aria-hidden="true" className={`pointer-events-none absolute h-32 w-32 opacity-80 ${className}`}>
    <span className="absolute left-8 top-8 h-12 w-12 rounded-full bg-[#f0b9ad] shadow-[18px_4px_0_#fff7ef,7px_18px_0_#e4a69b]" />
    <span className="absolute left-14 top-14 h-7 w-7 rounded-full bg-[#9b5d56]" />
    <span className="absolute left-3 top-20 h-12 w-5 rotate-45 rounded-full bg-[#879a79]" />
    <span className="absolute left-20 top-6 h-10 w-5 -rotate-45 rounded-full bg-[#a8b99a]" />
  </div>
);

const SectionTitle = ({ kicker, title }) => (
  <motion.header variants={rise} className="relative z-20 mx-auto mb-10 max-w-3xl text-center">
    {kicker ? <p className="text-xs font-black uppercase tracking-[0.22em] text-[#7a4039]">{kicker}</p> : null}
    <h2 className="mt-3 font-serif text-4xl leading-tight text-[#3d2d2a] sm:text-5xl">{title}</h2>
    <span className="mx-auto mt-5 block h-px w-24 bg-[#7a4039]/40" />
  </motion.header>
);

const LoveCountdown = ({ countdown }) => {
  const target = useMemo(() => new Date(countdown?.target_date), [countdown?.target_date]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!countdown?.target_date || Number.isNaN(target.getTime())) return null;

  const diff = Math.max(0, target.getTime() - now);
  const units = [
    ['Days', Math.floor(diff / 86400000)],
    ['Hours', Math.floor((diff / 3600000) % 24)],
    ['Minutes', Math.floor((diff / 60000) % 60)],
    ['Seconds', Math.floor((diff / 1000) % 60)],
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {units.map(([unit, value]) => (
        <div key={unit} className="rounded-[24px] border border-white/22 bg-[#3d211d]/60 p-4 text-center shadow-[0_18px_45px_rgba(61,33,29,0.24)] backdrop-blur-md">
          <strong className="block font-serif text-3xl font-normal text-[#ffd8c9]">{String(value).padStart(2, '0')}</strong>
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/70">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const OpeningEnvelope = ({ brideName = '', groomName = '', couple, openLabel = 'Open', onUnlock, onOpen }) => {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [openingStarted, setOpeningStarted] = useState(false);
  const leaveTimerRef = React.useRef(null);
  const finishTimerRef = React.useRef(null);
  const leftName = groomName || (couple.includes('&') ? couple.split('&')[0].trim() : couple);
  const rightName = brideName || (couple.includes('&') ? couple.split('&')[1]?.trim() || '' : '');
  const curtainTransition = { duration: 2.45, ease: [0.76, 0, 0.24, 1] };

  const handleOpenCurtains = () => {
    if (openingStarted) return;
    setOpeningStarted(true);
    onUnlock?.();
    setCurtainsOpen(true);
    leaveTimerRef.current = window.setTimeout(() => setIsLeaving(true), 4000);
    finishTimerRef.current = window.setTimeout(onOpen, 5200);
  };

  useEffect(() => () => {
    if (leaveTimerRef.current) window.clearTimeout(leaveTimerRef.current);
    if (finishTimerRef.current) window.clearTimeout(finishTimerRef.current);
  }, []);

  return (
    <motion.section
      exit={{ opacity: 0 }}
      animate={{
        opacity: isLeaving ? 0 : 1,
        scale: isLeaving ? 1.02 : 1,
        filter: isLeaving ? 'blur(10px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.85, ease: 'easeInOut' }}
      className="love-letter-curtain-opening fixed inset-0 z-[130] min-h-svh overflow-hidden text-[#3d2d2a]"
    >
      <motion.div
        aria-hidden="true"
        animate={{ opacity: curtainsOpen ? 0 : 1 }}
        transition={{ duration: 1.35, delay: 0.25, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,#fffdf8_0%,#fff7ef_50%,#f2ded6_100%)]"
      />

      <Petals count={18} />

      <CurtainPanels
        isOpen={curtainsOpen}
        groomName={leftName}
        brideName={rightName}
        transition={curtainTransition}
      />

      <div className="pointer-events-none absolute inset-0 z-40 grid place-items-center">
        <motion.button
          type="button"
          onClick={handleOpenCurtains}
          disabled={openingStarted}
          animate={openingStarted ? { opacity: 0, scale: 0.82 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="pointer-events-auto relative -mt-1 grid h-24 w-24 place-items-center rounded-full border border-[#fff7ef]/80 bg-[#fffaf4]/92 p-3 text-[#8a5b55] shadow-[0_18px_38px_rgba(145,82,75,0.24)] transition hover:scale-[1.03] hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#c58c85]/22 disabled:cursor-default"
        >
          <span className="grid justify-items-center gap-1 text-center">
            <FiLock className="text-2xl text-[#8a5b55]" />
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8a5b55]">{openLabel}</span>
          </span>
        </motion.button>
      </div>

      <div className="loading-couple-stage" aria-hidden="true">
        <motion.div
          className="loading-character-zone loading-character-zone-groom"
          initial={{ opacity: 0, x: 0, y: 18 }}
          animate={{ opacity: isLeaving ? 0 : 1, x: curtainsOpen ? '-52vw' : 0, y: 0 }}
          transition={{
            duration: curtainsOpen ? 2.45 : 0.95,
            ease: curtainsOpen ? [0.76, 0, 0.24, 1] : [0.16, 1, 0.3, 1],
            delay: curtainsOpen ? 0 : 0.2,
          }}
        >
          <figure className="loading-character loading-character-groom">
            <span className="loading-hand-pull loading-hand-pull-groom" />
            <span className="loading-grip-line loading-grip-line-groom" />
            <img src={groomCurtain} alt="" draggable="false" />
          </figure>
        </motion.div>

        <motion.div
          className="loading-character-zone loading-character-zone-bride"
          initial={{ opacity: 0, x: 0, y: 18 }}
          animate={{ opacity: isLeaving ? 0 : 1, x: curtainsOpen ? '52vw' : 0, y: 0 }}
          transition={{
            duration: curtainsOpen ? 2.45 : 0.95,
            ease: curtainsOpen ? [0.76, 0, 0.24, 1] : [0.16, 1, 0.3, 1],
            delay: curtainsOpen ? 0 : 0.2,
          }}
        >
          <figure className="loading-character loading-character-bride">
            <span className="loading-hand-pull loading-hand-pull-bride" />
            <span className="loading-grip-line loading-grip-line-bride" />
            <img src={brideCurtain} alt="" draggable="false" />
          </figure>
        </motion.div>
      </div>
    </motion.section>
  );
};

const LoveLetterRsvp = ({ invitation, invitationPath, labels }) => {
  const dispatch = useDispatch();
  const { rsvpStatus, rsvpError } = useSelector((state) => state.invitation);
  const copy = invitation?.rsvp || {};
  const pathKey = invitation?.public_path || invitationPath;
  const [form, setForm] = useState({ name: '', attending: 'yes', message: '' });
  const [submitted, setSubmitted] = useState(() => localStorage.getItem('rsvp_submitted_' + pathKey) === 'true');
  const [guestNameForThanks, setGuestNameForThanks] = useState(() => localStorage.getItem('rsvp_guest_name_' + pathKey) || '');
  const [attendingForThanks, setAttendingForThanks] = useState(() => localStorage.getItem('rsvp_attending_' + pathKey) || 'yes');

  if (copy.is_enabled === false) return null;

  const submit = async (event) => {
    event.preventDefault();
    await dispatch(submitInvitationRsvp({
      invitation_path: invitation?.public_path || invitationPath,
      full_name: form.name,
      attending: form.attending === 'yes',
      message: form.message,
      locale: invitation?.locale || 'en',
    })).unwrap();

    if (form.attending === 'yes') {
      confetti({ particleCount: 110, spread: 72, origin: { y: 0.72 }, colors: ['#c58c85', '#f8d7da', '#ffffff'] });
    }

    localStorage.setItem('rsvp_submitted_' + pathKey, 'true');
    localStorage.setItem('rsvp_guest_name_' + pathKey, form.name);
    localStorage.setItem('rsvp_attending_' + pathKey, form.attending);
    setGuestNameForThanks(form.name);
    setAttendingForThanks(form.attending);
    setSubmitted(true);
  };

  return (
    <motion.section id="love-letter-rsvp" initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf8,#f7ebe5)] px-4 py-16 sm:px-8 sm:py-24">
      <FloralCorner className="-left-10 top-10" />
      <FloralCorner className="-bottom-10 right-0 rotate-180" />
      <SectionTitle kicker="RSVP" title={copy.title || 'Are you attending?'} />
      <motion.div variants={rise} className="relative z-20 mx-auto max-w-3xl rounded-[32px] border border-[#c58c85]/20 bg-[#fffdf8] p-5 shadow-[0_18px_42px_rgba(197,140,133,0.10)] ring-1 ring-white/80 sm:p-8">
        {submitted ? (
          <div className="grid min-h-72 place-items-center text-center">
            <div>
              <FiHeart className="mx-auto mb-5 text-5xl text-[#c58c85]" />
              <h3 className="font-serif text-4xl text-[#4a4a4a]">{(copy.thanks || 'Thank you, {{name}}!').replace('{{name}}', guestNameForThanks.split(' ')[0])}</h3>
              <p className="mx-auto mt-4 max-w-lg leading-8 text-[#4a4a4a]/70">{attendingForThanks === 'yes' ? copy.yes_reply : copy.no_reply}</p>
            </div>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={submit}>
            <CustomInput label={copy.name || 'Guest Name'} name="love-letter-name" required value={form.name} placeholder={copy.name_placeholder} onChange={(event) => setForm({ ...form, name: event.target.value })} labelClassName="text-[#3d2d2a] font-black" inputClassName="rounded-[22px] border-[#c58c85]/30 bg-[#fffdf8] text-[#3d2d2a] placeholder:text-[#3d2d2a]/35 focus:border-[#c58c85]" />
            <div>
              <p className="mb-2 font-black text-[#3d2d2a]">{copy.attending || 'Are you attending?'}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {['yes', 'no'].map((option) => (
                  <label key={option} className="cursor-pointer">
                    <input type="radio" name="love-letter-attending" value={option} checked={form.attending === option} onChange={(event) => setForm({ ...form, attending: event.target.value })} className="peer sr-only" />
                    <span className="grid min-h-[3.25rem] place-items-center rounded-[22px] border border-[#c58c85]/30 bg-[#fffdf8] px-4 text-center font-black text-[#3d2d2a]/70 transition peer-checked:border-[#c58c85] peer-checked:bg-[#c58c85] peer-checked:text-white">{copy[option] || option}</span>
                  </label>
                ))}
              </div>
            </div>
            <CustomInput as="textarea" rows="4" label={copy.message || 'Message'} name="love-letter-message" value={form.message} placeholder={copy.message_placeholder} onChange={(event) => setForm({ ...form, message: event.target.value })} labelClassName="text-[#3d2d2a] font-black" inputClassName="rounded-[22px] border-[#c58c85]/30 bg-[#fffdf8] text-[#3d2d2a] placeholder:text-[#3d2d2a]/35 focus:border-[#c58c85]" />
            {rsvpError ? <p className="rounded-[22px] border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{rsvpError}</p> : null}
            <CustomBottom type="submit" text={copy.submit || 'Send Response'} loading={rsvpStatus === 'loading'} disabled={rsvpStatus === 'loading'} rightIcon={<FiSend />} buttonStyles="rounded-[24px] bg-[#c58c85] text-white shadow-[0_18px_38px_rgba(197,140,133,0.26)] hover:-translate-y-0.5 hover:bg-[#a66f68]" />
          </form>
        )}
      </motion.div>
    </motion.section>
  );
};

const LoveLetterTemplate = ({ invitation, invitationPath }) => {
  const isRTL = invitation?.locale === 'ar';
  const hero = invitation?.hero || {};
  const event = invitation?.event || {};
  const story = invitation?.love_story || {};
  const gallery = invitation?.gallery || {};
  const footer = invitation?.footer || {};
  const images = gallery.image_urls || [];
  const labels = labelsByLocale[invitation?.locale] || labelsByLocale.en;
  const couple = invitation?.couple_display_name || `${invitation?.groom_name || ''} & ${invitation?.bride_name || ''}`;
  const heroEnabled = hero.is_enabled !== false;
  const storyEnabled = story.is_enabled !== false;
  const galleryEnabled = gallery.is_enabled !== false && images.length > 0;
  const eventEnabled = event.is_enabled !== false;
  const countdownEnabled = invitation?.countdown?.is_enabled !== false;
  const footerEnabled = footer.is_enabled !== false;
  const [opened, setOpened] = useState(false);
  const [audioStartSignal, setAudioStartSignal] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const storyDragRef = React.useRef(false);
  const galleryDragRef = React.useRef(false);
  const lightboxImage = lightboxIndex == null ? null : images[lightboxIndex];
  const mapsUrl = buildMapsUrl(event);
  const milestones = story.events?.length ? story.events : [
    { title: 'First Meeting', desc: hero.body },
    { title: 'Engagement Day', desc: event.description },
    { title: 'Wedding Day', desc: event.date },
  ];
  const storySlides = milestones.slice(0, 4);

  useEffect(() => {
    document.body.style.overflow = lightboxImage ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxImage]);

  const handleStartOpening = () => {
    setAudioStartSignal((signal) => signal + 1);
  };

  const handleOpen = () => {
    setOpened(true);
  };

  const showPreviousImage = (event) => {
    event.stopPropagation();
    setLightboxIndex((current) => (current == null ? current : (current - 1 + images.length) % images.length));
  };

  const showNextImage = (event) => {
    event.stopPropagation();
    setLightboxIndex((current) => (current == null ? current : (current + 1) % images.length));
  };

  const moveSlide = (setter, length, direction) => {
    setter((current) => Math.min(Math.max(current + direction, 0), length - 1));
  };

  const startCarouselDrag = (dragRef) => {
    dragRef.current = true;
  };

  const stopCarouselDrag = (dragRef) => {
    window.setTimeout(() => {
      dragRef.current = false;
    }, 90);
  };

  const handleCarouselDrag = (setter, length, dragRef) => (_, info) => {
    if (length <= 1) {
      stopCarouselDrag(dragRef);
      return;
    }
    if (isRTL) {
      if (info.offset.x < -42) {
        moveSlide(setter, length, -1);
      } else if (info.offset.x > 42) {
        moveSlide(setter, length, 1);
      }
    } else {
      if (info.offset.x < -42) {
        moveSlide(setter, length, 1);
      } else if (info.offset.x > 42) {
        moveSlide(setter, length, -1);
      }
    }
    stopCarouselDrag(dragRef);
  };

  const handleCarouselTap = (setter, activeIndex, targetIndex, dragRef, onActive) => {
    if (dragRef.current) return;
    if (targetIndex === activeIndex) {
      onActive?.();
      return;
    }

    setter((current) => current + Math.sign(targetIndex - current));
  };

  return (
    <main className="min-h-screen bg-[#fff7ef] text-[#3d2d2a]" dir={invitation?.locale === 'ar' ? 'rtl' : 'ltr'}>
      <AnimatePresence>
        {!opened ? (
          <OpeningEnvelope
            couple={couple}
            groomName={invitation?.groom_name || ''}
            brideName={invitation?.bride_name || ''}
            openLabel={labels.open}
            onUnlock={handleStartOpening}
            onOpen={handleOpen}
          />
        ) : null}
      </AnimatePresence>
      <LoveLetterAudioPlayer invitation={invitation} playSignal={audioStartSignal} />

      {heroEnabled ? (
      <section className="relative isolate grid min-h-svh content-center overflow-hidden bg-[#2f1c19] px-4 py-14 text-white sm:px-8">
        <video
          className="absolute inset-0 -z-30 h-full w-full object-cover"
          src={loveLetterVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(42,22,19,0.92)_0%,rgba(83,45,39,0.68)_45%,rgba(255,244,235,0.18)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_26%,rgba(255,221,203,0.28),transparent_34%),linear-gradient(180deg,rgba(43,24,21,0.18),rgba(43,24,21,0.86))]" />
        <Petals />
        <FloralCorner className="-left-8 top-6 opacity-60" />
        <FloralCorner className="-bottom-8 right-0 rotate-180 opacity-60" />
        <motion.div initial="hidden" animate="shown" variants={stagger} className="relative z-20 mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_20rem] lg:items-end">
          <div className="max-w-4xl text-start">
            <motion.p variants={rise} className="text-xs font-black uppercase tracking-[0.26em] text-[#ffd8c9] sm:text-sm">{hero.kicker || event.kicker || labels.heroTitle}</motion.p>
            <motion.h1 variants={rise} className="mt-5 break-words font-serif text-5xl leading-[0.95] text-white drop-shadow-[0_12px_34px_rgba(0,0,0,0.34)] sm:text-7xl lg:text-8xl">
              <CoupleName value={couple} ampersandClassName="text-[#ffd8c9]" />
            </motion.h1>
            <motion.div variants={rise} className="mt-6 max-w-2xl border-s-2 border-[#ffd8c9]/70 ps-5">
              {event.date ? <p className="text-lg font-black text-[#ffd8c9]">{event.date}</p> : null}
              {hero.body ? <p className="mt-3 text-base font-semibold leading-8 text-white/82 sm:text-xl">{hero.body}</p> : null}
            </motion.div>
            {countdownEnabled ? <LoveCountdown countdown={invitation?.countdown} /> : null}
            <motion.a variants={rise} href="#love-letter-details" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-[#ffd8c9]/40 bg-[#fff7ef] px-7 text-sm font-black uppercase tracking-[0.16em] text-[#5b302b] shadow-[0_20px_46px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white">
              {hero.save_date || labels.saveDate}
            </motion.a>
          </div>

          {eventEnabled ? (
          <motion.aside variants={rise} className="relative overflow-hidden rounded-[32px] border border-white/24 bg-white/16 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#ffd8c9]/25 blur-2xl" />
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd8c9]">{event.title || labels.details}</p>
            <div className="mt-5 grid gap-3 text-sm font-bold text-white/82">
              {event.time ? <p className="flex gap-3"><FiClock className="mt-1 shrink-0 text-[#ffd8c9]" />{event.time}</p> : null}
              {event.venue ? <p className="flex gap-3"><FiMapPin className="mt-1 shrink-0 text-[#ffd8c9]" />{event.venue}</p> : null}
              {event.location ? <p className="flex gap-3"><FiMapPin className="mt-1 shrink-0 text-[#ffd8c9]" />{event.location}</p> : null}
            </div>
          </motion.aside>
          ) : null}
        </motion.div>
      </section>
      ) : null}

      {storyEnabled ? (
      <motion.section id="love-letter-story" initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[linear-gradient(180deg,#fff7ef,#f0d7ce)] px-4 py-16 sm:px-8 sm:py-24">
        <FloralCorner className="-left-8 top-12" />
        <SectionTitle kicker={story.kicker} title={story.title || labels.story} />
        <div className="relative z-20 mx-auto max-w-6xl">
          <div aria-hidden="true" className="absolute left-8 right-8 top-1/2 hidden h-px -translate-y-1/2 bg-[#c58c85]/26 sm:block" />
          <div aria-hidden="true" className="absolute left-6 top-24 h-[2px] w-[calc(100%-3rem)] rounded-full bg-[#c58c85]/24 sm:hidden" />
          <div className="-mx-4 block overflow-hidden pb-8 pt-4 sm:hidden">
            <motion.div
              className="flex touch-pan-x items-center gap-4 will-change-transform"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              dragMomentum={false}
              onDragStart={() => startCarouselDrag(storyDragRef)}
              onDragEnd={handleCarouselDrag(setActiveStoryIndex, storySlides.length, storyDragRef)}
              animate={{
                x: isRTL
                  ? `calc(-50% + 36vw + ${activeStoryIndex} * (72vw + 1rem))`
                  : `calc(50% - 36vw - ${activeStoryIndex} * (72vw + 1rem))`
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 28, mass: 0.6 }}
              style={{ backfaceVisibility: 'hidden' }}
            >
              {storySlides.map((item, index) => {
                const isActive = activeStoryIndex === index;

                return (
                  <motion.article
                    key={`${item.title}-${index}`}
                    variants={rise}
                    animate={{ scale: isActive ? 1 : 0.88, opacity: isActive ? 1 : 0.68 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    onClick={() => handleCarouselTap(setActiveStoryIndex, activeStoryIndex, index, storyDragRef)}
                    className={`relative min-h-64 w-[72vw] shrink-0 transform-gpu rounded-[6px] border border-[#9b5d56]/20 bg-[#fffaf4] p-6 shadow-[0_14px_34px_rgba(91,48,43,0.12)] ${index % 2 ? 'rotate-1' : '-rotate-1'}`}
                  >
                    <span aria-hidden="true" className="absolute -top-8 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border border-[#c58c85]/30 bg-[#fff7ef] text-[#c58c85]">
                      <FiHeart />
                    </span>
                    <span className="absolute -top-4 left-8 h-8 w-24 rotate-[-5deg] rounded-sm bg-[#d9a69b]/80 shadow-sm" />
                    <span className="absolute bottom-4 right-5 h-10 w-10 rounded-full border border-[#9b5d56]/18 bg-[#f3c6bb]/70" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9b5d56]">{item.date || String(index + 1).padStart(2, '0')}</p>
                    <h3 className="mt-3 font-serif text-3xl text-[#3d2d2a]">{item.title}</h3>
                    {item.desc ? <p className="mt-4 leading-7 text-[#3d2d2a]/70">{item.desc}</p> : null}
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
          <div className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {storySlides.map((item, index) => (
              <motion.article key={`${item.title}-${index}`} variants={rise} className={`relative min-h-64 rounded-[6px] border border-[#9b5d56]/20 bg-[#fffaf4] p-6 shadow-[0_24px_55px_rgba(91,48,43,0.14)] ${index % 2 ? 'rotate-1 sm:translate-y-8' : '-rotate-1'}`}>
                <span className="absolute -top-4 left-8 h-8 w-24 rotate-[-5deg] rounded-sm bg-[#d9a69b]/80 shadow-sm" />
                <span className="absolute bottom-4 right-5 h-10 w-10 rounded-full border border-[#9b5d56]/18 bg-[#f3c6bb]/70" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9b5d56]">{item.date || String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 font-serif text-3xl text-[#3d2d2a]">{item.title}</h3>
                {item.desc ? <p className="mt-4 leading-7 text-[#3d2d2a]/70">{item.desc}</p> : null}
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>
      ) : null}

      {galleryEnabled ? (
        <motion.section initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[#fff7ef] px-4 py-16 sm:px-8 sm:py-24">
          <Petals count={10} />
          <SectionTitle title={gallery.title || labels.gallery} />
          <div className="relative z-20 -mx-4 block overflow-hidden pb-10 pt-4 sm:hidden">
            <motion.div
              className="flex touch-pan-x items-center gap-4 will-change-transform"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              dragMomentum={false}
              onDragStart={() => startCarouselDrag(galleryDragRef)}
              onDragEnd={handleCarouselDrag(setActiveGalleryIndex, images.length, galleryDragRef)}
              animate={{
                x: isRTL
                  ? `calc(-50% + 33vw + ${activeGalleryIndex} * (66vw + 1rem))`
                  : `calc(50% - 33vw - ${activeGalleryIndex} * (66vw + 1rem))`
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 28, mass: 0.6 }}
              style={{ backfaceVisibility: 'hidden' }}
            >
              {images.map((image, index) => {
                const isActive = activeGalleryIndex === index;

                return (
                  <motion.button
                    key={`${image}-mobile-${index}`}
                    type="button"
                    onClick={() => handleCarouselTap(setActiveGalleryIndex, activeGalleryIndex, index, galleryDragRef, () => setLightboxIndex(index))}
                    animate={{ scale: isActive ? 1 : 0.84, opacity: isActive ? 1 : 0.68 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="relative w-[66vw] shrink-0 transform-gpu bg-[#fffaf4] p-3 shadow-[0_14px_36px_rgba(91,48,43,0.13)]"
                  >
                    <img src={image} alt={`${gallery.title || labels.gallery} ${index + 1}`} className="aspect-[4/5] w-full object-cover" />
                    {isActive ? <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-[#fffaf4]/90 text-[#7a4039] shadow-lg"><FiMaximize2 /></span> : null}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          <div className="relative z-20 mx-auto hidden max-w-6xl gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <motion.button
                key={`${image}-${index}`}
                type="button"
                variants={rise}
                onClick={() => setLightboxIndex(index)}
                whileTap={{ scale: 0.98 }}
                className={`group relative bg-[#fffaf4] p-3 shadow-[0_24px_60px_rgba(91,48,43,0.16)] transition duration-500 hover:z-10 hover:-translate-y-2 ${index % 2 ? 'rotate-2' : '-rotate-2'} hover:rotate-0`}
              >
                <img src={image} alt={`${gallery.title || labels.gallery} ${index + 1}`} className="aspect-[4/5] w-full object-cover" />
                <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-[#fffaf4]/90 text-[#7a4039] opacity-0 shadow-lg transition group-hover:opacity-100"><FiMaximize2 /></span>
              </motion.button>
            ))}
          </div>
        </motion.section>
      ) : null}

      {eventEnabled ? (
      <motion.section id="love-letter-details" initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8,#f9f3ef)] px-4 py-16 sm:px-8 sm:py-24">
        <FloralCorner className="-right-4 top-8 rotate-90" />
        <SectionTitle kicker={event.kicker} title={event.title || labels.details} />
        <motion.div variants={rise} className="relative z-20 mx-auto max-w-5xl rounded-[32px] border border-[#c58c85]/20 bg-[#fffdf8] p-5 shadow-[0_18px_42px_rgba(197,140,133,0.10)] ring-1 ring-white/80 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: FiCalendar, label: event.day_label || 'Wedding Date', value: event.date },
              { icon: FiClock, label: 'Time', value: event.time },
              { icon: FiMapPin, label: event.venue_label || 'Venue', value: event.venue },
              { icon: FiMapPin, label: event.address || 'Address', value: event.location },
            ].map(({ icon: Icon, label, value }) => value ? (
              <div key={`${label}-${value}`} className="rounded-[28px] border border-[#c58c85]/18 bg-[#fffdf8] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75)]">
                <Icon className="mb-4 text-2xl text-[#c58c85]" />
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a66f68]">{label}</p>
                <strong className="mt-2 block text-lg leading-7 text-[#4a4a4a]">{value}</strong>
              </div>
            ) : null)}
          </div>
          {mapsUrl ? (
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[24px] bg-[#c58c85] px-5 text-center text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_38px_rgba(197,140,133,0.24)] transition hover:-translate-y-0.5 hover:bg-[#a66f68]">
              <FiMapPin />
              {event.open_location || labels.location}
            </a>
          ) : null}
        </motion.div>
      </motion.section>
      ) : null}

      <motion.section initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[#fff7ef] px-4 py-16 sm:px-8 sm:py-24">
        <SectionTitle title={labels.letter} />
        <motion.div variants={rise} className="relative z-20 mx-auto max-w-3xl [perspective:1200px]">
          <motion.div
            initial={{ rotateX: -72, y: 34, opacity: 0 }}
            whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative origin-top rounded-[10px] border border-[#c58c85]/24 bg-[linear-gradient(135deg,#fffdf8,#fff7ef)] p-6 shadow-[0_28px_70px_rgba(197,140,133,0.14)] [transform-style:preserve-3d] sm:p-10"
          >
            <FloralCorner className="-left-10 -top-10 scale-75" />
            <motion.div
              initial={{ scaleX: 1 }}
              whileInView={{ scaleX: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.9, delay: 0.45, ease: 'easeInOut' }}
              className="absolute inset-0 origin-right rounded-[10px] bg-[#ead0c7]"
            />
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.9, delay: 0.85, ease: 'easeOut' }}
              className="relative overflow-hidden whitespace-normal font-serif text-3xl leading-snug text-[#4a4a4a] sm:text-4xl"
            >
              {event.description || hero.body || 'Your presence will make our day even more special. We look forward to celebrating this beautiful moment with you.'}
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.section>

      <LoveLetterRsvp invitation={invitation} invitationPath={invitationPath} labels={labels} />
      <PartyUpload invitation={invitation} invitationPath={invitationPath} />

      {footerEnabled ? (
      <footer className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#fff7ef,#d9a69b)] px-4 py-20 text-center sm:px-8 sm:py-28">
        <Petals />
        <div className="relative z-20 mx-auto max-w-4xl rounded-[32px] border border-white/60 bg-[#fffaf4]/70 p-8 shadow-[0_30px_80px_rgba(91,48,43,0.16)] backdrop-blur-md">
          <FiHeart className="mx-auto mb-5 text-6xl text-[#7a4039]" />
          <h2 className="font-serif text-4xl leading-tight text-[#3d2d2a] sm:text-6xl">{footer.title || labels.finalTitle}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#3d2d2a]/70">{footer.subtitle || labels.finalText}</p>
        </div>
      </footer>
      ) : null}

      {lightboxImage ? (
        <div className="fixed inset-0 z-[140] grid place-items-center bg-[#4a4a4a]/55 p-4 backdrop-blur-xl" role="dialog" aria-modal="true" onClick={() => setLightboxIndex(null)}>
          <button type="button" onClick={() => setLightboxIndex(null)} className="absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl text-[#c58c85] shadow-xl" aria-label="Close image"><FiX /></button>
          {images.length > 1 ? (
            <>
              <button type="button" onClick={showPreviousImage} className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl text-[#c58c85] shadow-xl sm:left-6" aria-label="Previous image"><FiChevronLeft /></button>
              <button type="button" onClick={showNextImage} className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-2xl text-[#c58c85] shadow-xl sm:right-6" aria-label="Next image"><FiChevronRight /></button>
            </>
          ) : null}
          <img src={lightboxImage} alt="" onClick={(event) => event.stopPropagation()} className="relative z-10 max-h-[86svh] max-w-full rounded-[32px] border-[10px] border-white object-contain shadow-[0_30px_90px_rgba(74,74,74,0.38)]" />
        </div>
      ) : null}
    </main>
  );
};

export default LoveLetterTemplate;
