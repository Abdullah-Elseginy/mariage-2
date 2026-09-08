import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiCalendar,
  FiChevronDown,
  FiClock,
  FiMapPin,
  FiSend,
  FiHeart,
  FiAward,
  FiX,
  FiMaximize2,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { submitInvitationRsvp } from '../../../../store/invitationSlice';
import AudioPlayer from '../../sections/AudioPlayer';
import PartyUpload from '../../sections/PartyUpload';
import CoupleName from '../../components/CoupleName';
import flower1 from '../../../../assets/images/flowers/flower_1.png';
import flower2 from '../../../../assets/images/flowers/flower_2.png';
import './index.css';

const revealViewport = { once: true, amount: 0.12 };
const rise = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
};
const stagger = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.15 } }
};

const labelsByLocale = {
  ar: {
    welcome: 'نرحب بكم في يومنا الكبير',
    story: 'قصة حبنا الأبدية',
    details: 'مـوعد ومكـان الحفل',
    gallery: 'معرض ذكرياتنا الجميلة',
    countdown: 'العد التنازلي لليلتنا الكبرى',
    attending: 'هل ستسعدنا بحضورك؟',
    yes: 'شرف لي الحضور، نعم سأحضر بفرح',
    no: 'يؤسفني عدم الحضور، أعتذر بصدق',
    name: 'الاسم الكامل للضيف الكريم',
    name_placeholder: 'الرجاء كتابة اسمك الثلاثي هنا',
    message: 'رسالة تهنئة أو تمنيات للعروسين',
    message_placeholder: 'اكتب كلماتك وتمنياتك القلبية هنا...',
    submit: 'تأكيد الحضور والتهنئة الآن',
    finalTitle: 'نشكركم بصدق وود',
    finalText: 'فرحتنا تكتمل بوجودكم ومشاركتكم لنا هذه اللحظات',
    days: 'أيام',
    hours: 'ساعات',
    minutes: 'دقائق',
    seconds: 'ثواني',
    location: 'عرض موقع القاعة على الخريطة',
    open_inv: 'افتح الدعوة الملكية',
    scroll_down: 'انزل لأسفل لقراءة التفاصيل',
    save_the_date: 'احفظوا هذا التاريخ'
  },
  en: {
    welcome: 'Welcome to Our Big Day',
    story: 'Our Love Story',
    details: 'Wedding Details',
    gallery: 'Our Beautiful Memories',
    countdown: 'Countdown to the Big Day',
    attending: 'Are you attending?',
    yes: 'Yes, I will attend with joy',
    no: 'No, I cannot attend, I sincerely apologize',
    name: 'Guest Full Name',
    name_placeholder: 'Enter your full name here',
    message: 'Congratulatory Message',
    message_placeholder: 'Send your best wishes...',
    submit: 'Confirm RSVP & Send Wishes',
    finalTitle: 'Thank You Sincerely',
    finalText: 'Our day is not complete without your presence',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    location: 'Open Venue Location',
    open_inv: 'Open Royal Invitation',
    scroll_down: 'Scroll down to read details',
    save_the_date: 'Save the Date'
  }
};

const buildMapsUrl = (event = {}) => {
  if (event.map_url) return event.map_url;
  const query = [event.venue, event.location, event.address].filter(Boolean).join(', ');
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '';
};

// Custom Butterfly Component
const Butterfly = ({ style, delay = 0 }) => (
  <motion.div
    className="butterfly-container fixed pointer-events-none z-0"
    style={style}
    animate={{ 
      y: [0, -30, 0, 15, 0],
      x: [0, 20, -15, 10, 0]
    }}
    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay }}
  >
    <div className="butterfly">
      <div className="wing left-wing"></div>
      <div className="wing right-wing"></div>
    </div>
  </motion.div>
);

// Floating Flowers Decor Component
const FloatingFlowers = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <motion.img
      src={flower1}
      className="absolute -top-10 -left-10 w-48 h-48 sm:w-72 sm:h-72 opacity-20 blur-[1px]"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
    />
    <motion.img
      src={flower2}
      className="absolute top-1/3 -right-20 w-64 h-64 sm:w-96 sm:h-96 opacity-15 blur-[2px]"
      animate={{ rotate: -360, y: [0, 30, 0] }}
      transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
    />
    <motion.img
      src={flower1}
      className="absolute bottom-20 -left-20 w-56 h-56 sm:w-80 sm:h-80 opacity-15 blur-[2px]"
      animate={{ rotate: 360, y: [0, -20, 0] }}
      transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

// Luxury Star Dust particles background
const FloatingParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = 45;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.5 + 0.1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > height) {
          this.y = 0;
          this.x = Math.random() * width;
        }
        if (this.x > width || this.x < 0) {
          this.speedX = -this.speedX;
        }
      }
      draw() {
        ctx.fillStyle = `rgba(230, 195, 135, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#e6c387';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

const ModernMinimalistTemplate = ({ invitation, invitationPath }) => {
  const dispatch = useDispatch();
  const { rsvpStatus, rsvpError } = useSelector((state) => state.invitation);

  const hero = invitation?.hero || {};
  const event = invitation?.event || {};
  const story = invitation?.love_story || {};
  const gallery = invitation?.gallery || {};
  const footer = invitation?.footer || {};
  const rsvp = invitation?.rsvp || {};
  const heroEnabled = hero.is_enabled !== false;
  const storyEnabled = story.is_enabled !== false;
  const galleryEnabled = gallery.is_enabled !== false;
  const eventEnabled = event.is_enabled !== false;
  const countdownEnabled = invitation?.countdown?.is_enabled !== false;
  const footerEnabled = footer.is_enabled !== false;

  const labels = labelsByLocale[invitation?.locale] || labelsByLocale.en;
  
  const groomName = invitation?.groom_name || '';
  const brideName = invitation?.bride_name || '';
  const couple = invitation?.couple_display_name || `${groomName} & ${brideName}`;

  const pathKey = invitation?.public_path || invitationPath;
  const [form, setForm] = useState({ name: '', attending: 'yes', message: '' });
  const [submitted, setSubmitted] = useState(() => localStorage.getItem('rsvp_submitted_' + pathKey) === 'true');
  const [guestNameForThanks, setGuestNameForThanks] = useState(() => localStorage.getItem('rsvp_guest_name_' + pathKey) || '');
  const [attendingForThanks, setAttendingForThanks] = useState(() => localStorage.getItem('rsvp_attending_' + pathKey) || 'yes');
  const [audioStartSignal, setAudioStartSignal] = useState(0);
  const [audioInteractionPrimed, setAudioInteractionPrimed] = useState(false);

  // Entrance state
  const [isOpened, setIsOpened] = useState(false);

  // Gallery state
  const images = gallery.image_urls || [];
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const lightboxImage = lightboxIndex === null ? null : images[lightboxIndex];

  // Time state for Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!invitation?.countdown?.target_date) return;
    
    const calculateTimeLeft = () => {
      const targetTime = new Date(invitation.countdown.target_date).getTime();
      const difference = targetTime - Date.now();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [invitation?.countdown?.target_date]);


  useEffect(() => {
    if (!isOpened || audioInteractionPrimed || !invitation?.audio?.src) return undefined;

    const triggerAudio = () => {
      setAudioStartSignal((signal) => signal + 1);
      setAudioInteractionPrimed(true);
    };

    window.addEventListener('pointerdown', triggerAudio, { once: true });
    window.addEventListener('touchstart', triggerAudio, { once: true });
    window.addEventListener('wheel', triggerAudio, { once: true, passive: true });
    window.addEventListener('scroll', triggerAudio, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', triggerAudio);
      window.removeEventListener('touchstart', triggerAudio);
      window.removeEventListener('wheel', triggerAudio);
      window.removeEventListener('scroll', triggerAudio);
    };
  }, [audioInteractionPrimed, invitation?.audio?.src, isOpened]);

  // Disable/enable page scroll during Entrance loader and Lightbox popup
  useEffect(() => {
    if (!isOpened || lightboxImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpened, lightboxImage]);

  // Handle RSVP Submit
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    await dispatch(
      submitInvitationRsvp({
        invitation_path: invitation?.public_path || invitationPath,
        full_name: form.name,
        attending: form.attending === 'yes',
        message: form.message,
        locale: invitation?.locale || 'en',
      })
    ).unwrap();

    if (form.attending === 'yes') {
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#e6c387', '#ffffff', '#ffd700', '#dfb06c']
      });
    }
    localStorage.setItem('rsvp_submitted_' + pathKey, 'true');
    localStorage.setItem('rsvp_guest_name_' + pathKey, form.name);
    localStorage.setItem('rsvp_attending_' + pathKey, form.attending);
    setGuestNameForThanks(form.name);
    setAttendingForThanks(form.attending);
    setSubmitted(true);
  };

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setAudioStartSignal((prev) => prev + 1);
  };

  const milestones = story.events?.length ? story.events : [
    { title: 'First Meeting', desc: hero.body || 'Where our paths crossed for the first time.' },
    { title: 'The Proposal', desc: 'When we promised to stay together forever.' },
    { title: 'Our Wedding Day', desc: event.date || 'The day we say "I do".' },
  ];

  const isRTL = invitation?.locale === 'ar';
  const mapsUrl = buildMapsUrl(event);

  return (
    <main
      className="celestial-container min-h-screen relative overflow-x-hidden selection:bg-[#e6c387] selection:text-[#07070b]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background stardust */}
      <div className="stardust-bg pointer-events-none" />
      <FloatingParticles />
      <FloatingFlowers />

      {/* Butterflies */}
      <Butterfly style={{ top: '15%', left: '10%' }} delay={0} />
      <Butterfly style={{ top: '60%', right: '15%' }} delay={2} />
      <Butterfly style={{ bottom: '20%', left: '20%' }} delay={4} />

      {/* Floating Audio Player */}
      <AudioPlayer invitation={invitation} playSignal={audioStartSignal} className="celestial-audio" />

      {/* 1. CINEMATIC SPLIT ENTRANCE */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="split-entrance"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[150] flex flex-col md:flex-row overflow-hidden"
          >
            {/* Left Shutter Half */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
              className="w-full md:w-1/2 h-1/2 md:h-full hero-split-left flex items-center justify-center relative p-6 border-b md:border-b-0 md:border-r border-[#e6c387]/15"
            >
              <div className="absolute inset-0 stardust-bg opacity-30" />
              <div className="text-center relative z-10">
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#e6c387]/70 block mb-3">
                  THE GROOM
                </span>
                <h2 className="font-serif-lux text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide">
                  {groomName || 'Groom'}
                </h2>
              </div>
            </motion.div>

            {/* Right Shutter Half */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
              className="w-full md:w-1/2 h-1/2 md:h-full hero-split-right flex items-center justify-center relative p-6"
            >
              <div className="absolute inset-0 stardust-bg opacity-20" />
              <div className="text-center relative z-10">
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#e6c387]/70 block mb-3">
                  THE BRIDE
                </span>
                <h2 className="font-serif-lux text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide">
                  {brideName || 'Bride'}
                </h2>
              </div>
            </motion.div>

            {/* Central Round Portal Click Button */}
            <div className="absolute inset-0 m-auto w-40 h-40 flex items-center justify-center z-30">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenInvitation}
                className="w-32 h-32 rounded-full bg-radial-gradient border-2 border-[#e6c387] bg-[#07070b] text-white flex flex-col items-center justify-center gap-1.5 shadow-[0_0_40px_rgba(230,195,135,0.4)] focus:outline-none relative group cursor-pointer"
              >
                <div className="absolute inset-0 rounded-full border border-white/20 scale-110 animate-ping opacity-25 pointer-events-none" />
                <FiHeart className="text-2xl text-[#e6c387] group-hover:scale-125 transition duration-300" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[#e6c387] text-center px-2">
                  {labels.open_inv}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION CONTAINER */}
      {heroEnabled ? (
      <section className="relative min-h-[100svh] flex flex-col justify-between items-center px-6 py-12 md:py-20 text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -z-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={isOpened ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <span className="uppercase tracking-[0.35em] text-[10px] font-black text-[#e6c387] modern-glow-text">
            {hero.kicker || labels.welcome}
          </span>
          <div className="w-16 h-[0.5px] bg-[#e6c387]/40" />
        </motion.div>

        <div className="my-auto max-w-5xl w-full flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={isOpened ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center"
          >
            <span className="font-script text-4xl sm:text-5xl text-[#e6c387] mb-4 drop-shadow-md">
              {hero.save_the_date || labels.save_the_date}
            </span>

            <h1 className="font-serif-lux text-5xl sm:text-8xl md:text-9xl font-extrabold tracking-tight text-white leading-none break-words max-w-full drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
              <CoupleName value={couple} ampersandClassName="text-[#e6c387]" />
            </h1>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={isOpened ? { width: '8rem' } : {}}
            transition={{ delay: 0.8, duration: 1 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#e6c387] to-transparent my-10"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isOpened ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.9 }}
            className="flex flex-col items-center gap-6"
          >
            {event.date && (
              <span className="px-6 py-3 rounded-full border border-[#e6c387]/25 bg-[#121319]/80 text-white tracking-[0.25em] text-xs uppercase font-semibold shadow-lg backdrop-blur">
                {event.date}
              </span>
            )}
            
            {hero.body && (
              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-300 font-light px-4">
                {hero.body}
              </p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isOpened ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex flex-col items-center gap-3 cursor-pointer group"
          onClick={() => {
            document.getElementById('wedding-details')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#e6c387]/70 group-hover:text-[#e6c387] transition duration-300">
            {labels.scroll_down}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-9 h-9 rounded-full border border-[#e6c387]/20 flex items-center justify-center text-[#e6c387] bg-[#121319]/40 backdrop-blur"
          >
            <FiChevronDown />
          </motion.div>
        </motion.div>
      </section>
      ) : null}

      {/* 2. OUR LOVE STORY */}
      {storyEnabled ? (
      <motion.section
        id="our-story"
        initial="hidden"
        whileInView="shown"
        viewport={revealViewport}
        variants={stagger}
        className="relative py-24 md:py-36 px-6 max-w-6xl mx-auto"
      >
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#07070b] to-transparent pointer-events-none -z-10" />

        <div className="text-center mb-20 md:mb-28">
          <span className="text-xs uppercase tracking-[0.3em] text-[#e6c387]/80 font-bold block mb-2">
            {story.kicker || labels.story}
          </span>
          <h2 className="font-serif-lux text-3xl md:text-5xl lg:text-6xl font-bold text-white">
            {story.title || labels.story}
          </h2>
          <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-[#e6c387] to-transparent mx-auto mt-5" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-[1px] timeline-connector" />

          <div className="space-y-16 md:space-y-28">
            {milestones.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={`${item.title}-${index}`}
                  variants={rise}
                  className={`flex flex-col md:flex-row items-stretch justify-between gap-8 md:gap-12 relative ${
                    isEven ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="absolute left-6 md:left-1/2 -translate-x-[7px] md:-translate-x-1/2 top-6 w-3.5 h-3.5 rounded-full border border-[#e6c387] bg-[#07070b] z-20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e6c387] animate-ping opacity-75" />
                  </div>

                  <div className="w-full md:w-[45%] pl-12 md:pl-0">
                    <div className="modern-glass-card p-6 md:p-10 rounded-[2rem] relative overflow-hidden group">
                      <span className="absolute top-0 right-0 font-serif-lux text-[6rem] md:text-[8.5rem] font-bold text-white/[0.03] leading-none select-none pointer-events-none group-hover:text-[#e6c387]/[0.05] transition duration-500">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      
                      <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#e6c387] border border-[#e6c387]/30 bg-[#e6c387]/5 px-3 py-1 rounded-full mb-4">
                        {item.date || `0${index + 1}`}
                      </span>

                      <h3 className="font-serif-lux text-2xl md:text-3xl font-extrabold text-white mb-3 group-hover:text-[#e6c387] transition duration-300">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-[45%] hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
      ) : null}

      {/* 3. WEDDING DETAILS */}
      {eventEnabled ? (
      <motion.section
        id="wedding-details"
        initial="hidden"
        whileInView="shown"
        viewport={revealViewport}
        variants={stagger}
        className="relative py-24 md:py-36 px-6 max-w-6xl mx-auto"
      >
        <div className="text-center mb-20 md:mb-28">
          <span className="text-xs uppercase tracking-[0.3em] text-[#e6c387]/80 font-bold block mb-2">{event.kicker || labels.details}</span>
          <h2 className="font-serif-lux text-3xl md:text-5xl lg:text-6xl font-bold text-white">{event.title || labels.details}</h2>
          <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-[#e6c387] to-transparent mx-auto mt-5" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-stretch">
          {/* Gate Arch 1: Date & Time */}
          <motion.div
            variants={rise}
            className="gate-arch-card p-10 sm:p-14 flex flex-col justify-between text-center min-h-[480px]"
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-[#e6c387]/30 bg-[#e6c387]/5 flex items-center justify-center text-[#e6c387] mb-8">
                <FiCalendar className="text-2xl" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-black text-[#e6c387]/80 mb-2">
                {event.day_label || 'Wedding Date'}
              </span>
              <h3 className="font-serif-lux text-3xl sm:text-4xl font-bold text-white mt-1 mb-6 leading-tight">
                {event.date}
              </h3>
              {event.description && (
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light max-w-sm">
                  {event.description}
                </p>
              )}
            </div>

            {event.time && (
              <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-3 text-white/90">
                <FiClock className="text-[#e6c387] text-lg" />
                <span className="text-sm font-mono tracking-widest uppercase">{event.time}</span>
              </div>
            )}
          </motion.div>

          {/* Gate Arch 2: Venue & Location */}
          <motion.div
            variants={rise}
            className="gate-arch-card p-10 sm:p-14 flex flex-col justify-between text-center min-h-[480px]"
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-[#e6c387]/30 bg-[#e6c387]/5 flex items-center justify-center text-[#e6c387] mb-8">
                <FiMapPin className="text-2xl" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-black text-[#e6c387]/80 mb-2">
                {event.venue_label || 'The Venue'}
              </span>
              <h3 className="font-serif-lux text-3xl sm:text-4xl font-bold text-white mt-1 mb-3 leading-tight">
                {event.venue}
              </h3>
              {event.location && (
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light max-w-sm">
                  {event.location}
                </p>
              )}
              {event.landmark_value && (
                <p className="text-xs text-[#e6c387]/80 font-mono mt-4 border border-[#e6c387]/15 bg-[#e6c387]/5 px-3 py-1.5 rounded-md">
                  {event.landmark ? `${event.landmark}: ` : ''}{event.landmark_value}
                </p>
              )}
            </div>

            {mapsUrl && (
              <div className="mt-10 pt-6 border-t border-white/5">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-[#e6c387] bg-transparent text-[#e6c387] hover:bg-[#e6c387] hover:text-[#07070b] font-black text-xs uppercase tracking-[0.2em] transition duration-500 shadow-md"
                >
                  <FiMapPin />
                  {event.open_location || labels.location}
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>
      ) : null}

      {/* 4. NEW GALLERY / MEMORIES SECTION (الذكريات والبلومينج صور) */}
      {galleryEnabled && images.length > 0 && (
        <motion.section
          id="gallery"
          initial="hidden"
          whileInView="shown"
          viewport={revealViewport}
          variants={stagger}
          className="relative py-24 md:py-36 px-6 max-w-6xl mx-auto"
        >
          <div className="text-center mb-16 md:mb-24">
            <span className="text-xs uppercase tracking-[0.3em] text-[#e6c387]/80 font-bold block mb-2">
              {gallery.title || labels.gallery}
            </span>
            <h2 className="font-serif-lux text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              {gallery.title || labels.gallery}
            </h2>
            <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-[#e6c387] to-transparent mx-auto mt-5" />
          </div>

          {/* Luxury Masonry / Staggered Grids */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {images.map((image, index) => (
              <motion.div
                key={`${image}-${index}`}
                variants={rise}
                onClick={() => setLightboxIndex(index)}
                className={`gallery-luxury-card group cursor-pointer ${
                  index % 3 === 1 ? 'lg:translate-y-8' : index % 3 === 2 ? 'lg:-translate-y-4' : ''
                }`}
              >
                <div className="relative overflow-hidden aspect-[4/5] rounded-xl">
                  <img
                    src={image}
                    alt={`${gallery.title || labels.gallery} ${index + 1}`}
                    loading="lazy"
                    className="gallery-inner-img w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#e6c387] text-[#07070b] flex items-center justify-center text-lg shadow-lg transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                      <FiMaximize2 />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 5. COUNTDOWN */}
      {countdownEnabled && invitation?.countdown?.target_date && (
        <motion.section
          initial="hidden"
          whileInView="shown"
          viewport={revealViewport}
          variants={stagger}
          className="relative py-24 md:py-36 px-6 max-w-6xl mx-auto overflow-hidden"
        >
          <div className="text-center mb-16 md:mb-24">
            <span className="text-xs uppercase tracking-[0.3em] text-[#e6c387]/80 font-bold block mb-2">
              {invitation.countdown.kicker || labels.countdown}
            </span>
            <h2 className="font-serif-lux text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              {invitation.countdown.title || labels.countdown}
            </h2>
            <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-[#e6c387] to-transparent mx-auto mt-5" />
          </div>

          <motion.div
            variants={rise}
            className="relative z-10 mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl"
          >
            {[
              [timeLeft.days, labels.days],
              [timeLeft.hours, labels.hours],
              [timeLeft.minutes, labels.minutes],
              [timeLeft.seconds, labels.seconds]
            ].map(([val, unit], i) => (
              <div
                key={unit}
                className="orb-counter w-full aspect-square rounded-full flex flex-col justify-center items-center p-6"
              >
                <div className="absolute inset-4 rounded-full bg-[#e6c387]/[0.02] filter blur-md pointer-events-none" />
                
                <span className="block font-mono text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  {String(val).padStart(2, '0')}
                </span>
                <span className="mt-2 block text-[9px] md:text-xs font-black uppercase tracking-[0.25em] text-[#e6c387]/80">
                  {unit}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* 6. RSVP: ARE YOU ATTENDING? (REDESIGNED ULTRA LUXURY) */}
      {rsvp.is_enabled !== false && (
        <motion.section
          initial="hidden"
          whileInView="shown"
          viewport={revealViewport}
          variants={stagger}
          className="relative py-24 md:py-36 px-6 max-w-4xl mx-auto"
        >
          <div className="text-center mb-16 md:mb-24">
            <span className="text-xs uppercase tracking-[0.3em] text-[#e6c387]/80 font-bold block mb-2">
              {rsvp.kicker || labels.attending}
            </span>
            <h2 className="font-serif-lux text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              {rsvp.title || labels.attending}
            </h2>
            <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-[#e6c387] to-transparent mx-auto mt-5" />
          </div>

          {/* Highly Polished Glass Container */}
          <motion.div
            variants={rise}
            className="rsvp-glass-container p-8 sm:p-12 max-w-2xl mx-auto relative overflow-hidden"
          >
            {/* Subtle Ambient Glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#e6c387]/10 rounded-full blur-2xl pointer-events-none" />

            {submitted ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-12 text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-[#e6c387]/10 border border-[#e6c387]/30 flex items-center justify-center text-[#e6c387] mb-6">
                  <FiHeart className="text-4xl animate-pulse fill-[#e6c387]" />
                </div>
                <h4 className="font-serif-lux text-3xl font-bold text-white mb-3">
                  {rsvp.thanks ? rsvp.thanks.replace('{{name}}', guestNameForThanks) : labels.finalTitle}
                </h4>
                <p className="text-sm sm:text-base text-slate-300 font-light mt-2 max-w-md leading-relaxed px-4">
                  {attendingForThanks === 'yes'
                    ? rsvp.yes_reply || labelsByLocale[invitation?.locale]?.yes_reply || 'We cannot wait to celebrate with you!'
                    : rsvp.no_reply || labelsByLocale[invitation?.locale]?.no_reply || 'You will be missed!'}
                </p>
              </motion.div>
            ) : (
              <form className="space-y-8" onSubmit={handleRsvpSubmit}>
                {/* Full Name Input Field */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-[#e6c387]">
                    {rsvp.name || labels.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={rsvp.name_placeholder || labels.name_placeholder}
                    className="w-full min-h-[3.5rem] px-5 bg-transparent text-white placeholder:text-white/20 luxury-glass-input outline-none font-medium text-sm"
                  />
                </div>

                {/* Attendance Selection: Custom Luxury Option Cards */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-[#e6c387]">
                    {rsvp.attending || labels.attending}
                  </label>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Option 1: Yes */}
                    <div
                      onClick={() => setForm({ ...form, attending: 'yes' })}
                      className={`attendance-card p-5 flex items-center justify-between gap-4 ${
                        form.attending === 'yes' ? 'attendance-card-active' : ''
                      }`}
                    >
                      <div className="flex flex-col text-start">
                        <span className="text-sm font-bold text-white">
                          {rsvp.yes || labels.yes}
                        </span>
                      </div>
                      {form.attending === 'yes' ? (
                        <FiCheckCircle className="text-lg text-[#e6c387]" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/20" />
                      )}
                    </div>

                    {/* Option 2: No */}
                    <div
                      onClick={() => setForm({ ...form, attending: 'no' })}
                      className={`attendance-card p-5 flex items-center justify-between gap-4 ${
                        form.attending === 'no' ? 'attendance-card-active' : ''
                      }`}
                    >
                      <div className="flex flex-col text-start">
                        <span className="text-sm font-bold text-white">
                          {rsvp.no || labels.no}
                        </span>
                      </div>
                      {form.attending === 'no' ? (
                        <FiAlertCircle className="text-lg text-slate-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/20" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Wishes Message Area */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-[#e6c387]">
                    {rsvp.message || labels.message}
                  </label>
                  <textarea
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={rsvp.message_placeholder || labels.message_placeholder}
                    className="w-full p-5 bg-transparent text-white placeholder:text-white/20 luxury-glass-input outline-none text-sm resize-none"
                  />
                </div>

                {/* RSVP submit errors */}
                {rsvpError && (
                  <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-400">
                    {rsvpError}
                  </p>
                )}

                {/* Confirm submit button */}
                <button
                  type="submit"
                  disabled={rsvpStatus === 'loading'}
                  className="w-full inline-flex min-h-[3.75rem] items-center justify-center gap-3 rounded-2xl bg-[#e6c387] text-[#07070b] hover:bg-[#edd1a4] font-bold text-xs uppercase tracking-[0.25em] transition duration-300 disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-[#e6c387]/10"
                >
                  {rsvpStatus === 'loading' ? (
                    <span className="w-5 h-5 rounded-full border-2 border-[#07070b] border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <FiSend />
                      {rsvp.submit || labels.submit}
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.section>
      )}

      <PartyUpload invitation={invitation} invitationPath={invitationPath} />

      {/* 7. FOOTER */}
      {footerEnabled ? (
      <footer className="relative py-20 px-6 text-center border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0e0d14] to-transparent pointer-events-none" />
        
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-5">
          <div className="w-10 h-10 rounded-full border border-[#e6c387]/30 flex items-center justify-center text-[#e6c387] bg-[#e6c387]/5">
            <FiAward className="text-base" />
          </div>

          <h3 className="font-script text-5xl text-[#e6c387] drop-shadow-[0_2px_10px_rgba(230,195,135,0.2)]">
            <CoupleName value={couple} ampersandClassName="text-white" />
          </h3>

          {footer.date && (
            <p className="text-xs uppercase tracking-[0.25em] text-[#e6c387] font-mono font-bold">
              {footer.date}
            </p>
          )}

          {footer.made_with && (
            <p className="text-[10px] tracking-widest text-slate-500 max-w-sm mt-3 leading-relaxed">
              {footer.made_with} {footer.for_day}
            </p>
          )}

        </div>
      </footer>
      ) : null}

      {/* LIGHTBOX POPUP DIALOG FOR GALLERY IMAGES */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] grid place-items-center bg-black/90 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-6 top-6 z-[210] grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-2xl text-white transition cursor-pointer"
              aria-label="Close image"
            >
              <FiX />
            </button>
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage}
                alt=""
                className="max-h-[85svh] max-w-full rounded-2xl border border-white/10 object-contain shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ModernMinimalistTemplate;
