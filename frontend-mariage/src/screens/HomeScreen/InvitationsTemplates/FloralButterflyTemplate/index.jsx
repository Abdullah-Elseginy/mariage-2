import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiCalendar,
  FiChevronDown,
  FiClock,
  FiMapPin,
  FiMaximize2,
  FiSend,
  FiX,
} from 'react-icons/fi';
import { CustomBottom, CustomInput } from '../../../../components';
import { submitInvitationRsvp } from '../../../../store/invitationSlice';
import AudioPlayer from '../../sections/AudioPlayer';
import PartyUpload from '../../sections/PartyUpload';
import CoupleName from '../../components/CoupleName';
import flower1 from '../../../../assets/images/flowers/flower_1.png';
import flower2 from '../../../../assets/images/flowers/flower_2.png';
import flower3 from '../../../../assets/images/flowers/flower_3.png';
import flower4 from '../../../../assets/images/flowers/flower_4.png';
import flower5 from '../../../../assets/images/flowers/flower_5.png';
import flower6 from '../../../../assets/images/flowers/flower_6.png';
import './index.css';

const flowers = [flower1, flower2, flower3, flower6, flower5];
const revealViewport = { once: true, amount: 0.18 };
const rise = { hidden: { opacity: 0, y: 28 }, shown: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, shown: { transition: { staggerChildren: 0.12 } } };

const labelsByLocale = {
  ar: {
    welcome: 'نشارككم أجمل لحظاتنا',
    story: 'قصة حبنا',
    gallery: 'معرض الصور',
    details: 'موعد ومكان الحفل',
    countdown: 'العد التنازلي',
    letter: 'رسالة خاصة',
    location: 'افتح الموقع',
    attending: 'هل ستحضر؟',
    yes: 'نعم',
    no: 'لا',
    name: 'اسم الضيف',
    message: 'رسالة',
    submit: 'إرسال الرد',
    finalTitle: 'شكرا لمشاركتكم فرحتنا',
    finalText: 'ننتظركم لنحتفل معا',
  },
  en: {
    welcome: 'Welcome To Our Wedding Garden',
    story: 'Our Love Story',
    gallery: 'Garden Gallery',
    details: 'When & Where',
    countdown: 'Countdown',
    letter: 'Personal Message',
    location: 'Open Location',
    attending: 'Are you attending?',
    yes: 'Yes',
    no: 'No',
    name: 'Guest Name',
    message: 'Message',
    submit: 'Send Response',
    finalTitle: 'Thank You For Sharing Our Blooming Day',
    finalText: "We Can't Wait To Celebrate Together",
  },
};

const buildMapsUrl = (event = {}) => {
  if (event.map_url) return event.map_url;
  const query = [event.venue, event.location, event.address].filter(Boolean).join(', ');
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '';
};

const Butterflies = ({ count = 9 }) => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
    {Array.from({ length: count }, (_, index) => (
      <motion.span
        key={index}
        className="absolute h-5 w-5"
        initial={{ x: `${-10 - index * 4}vw`, y: `${18 + ((index * 11) % 58)}vh`, opacity: 0 }}
        animate={{
          x: ['-12vw', `${20 + ((index * 17) % 68)}vw`, '112vw'],
          y: [`${18 + ((index * 11) % 58)}vh`, `${10 + ((index * 19) % 70)}vh`, `${22 + ((index * 7) % 54)}vh`],
          opacity: [0, 0.9, 0.8, 0],
        }}
        transition={{ duration: 9 + (index % 4) * 1.2, delay: index * 0.42, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.span
          animate={{ rotate: [-18, 18, -18] }}
          transition={{ duration: 0.55 + (index % 3) * 0.08, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1 top-1 h-4 w-3 origin-bottom-right rounded-full bg-[#cba7ee]/85 shadow-[0_0_12px_rgba(148,83,174,0.32)]"
        />
        <motion.span
          animate={{ rotate: [18, -18, 18] }}
          transition={{ duration: 0.55 + (index % 3) * 0.08, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-1 top-1 h-4 w-3 origin-bottom-left rounded-full bg-[#9453ae]/72 shadow-[0_0_12px_rgba(148,83,174,0.32)]"
        />
        <span className="absolute left-1/2 top-2 h-4 w-1 -translate-x-1/2 rounded-full bg-[#5f744a]/80" />
      </motion.span>
    ))}
  </div>
);

const FloatingFlowers = ({ soft = false, withoutTree = false }) => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
    {flowers.filter((flower) => !withoutTree || flower !== flower4).map((flower, index) => (
      <motion.img
        key={flower}
        src={flower}
        alt=""
        className={`absolute ${soft ? 'w-20 opacity-30 sm:w-28' : 'w-24 opacity-70 sm:w-36'}`}
        style={{
          left: `${index % 2 ? 74 : 4 + index * 7}%`,
          top: `${8 + index * 17}%`,
        }}
        animate={{ y: [0, -14, 0], rotate: [index * 8, index * 8 + 5, index * 8] }}
        transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

const TreeWatermark = () => (
  <motion.img
    src={flower4}
    alt=""
    aria-hidden="true"
    animate={{ y: [0, -10, 0], scale: [1, 1.025, 1], rotate: [0, 0.8, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    className="pointer-events-none fixed left-1/2 top-1/2 z-[1] h-[86svh] w-[86vw] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.24] mix-blend-multiply will-change-transform"
  />
);

const TypewriterMessage = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    const fullText = text || 'Your presence will make our day bloom with joy.';
    const isTyping = phase === 'typing';
    const isComplete = displayed.length === fullText.length;
    const isEmpty = displayed.length === 0;
    const delay = isTyping && isComplete ? 2200 : !isTyping && isEmpty ? 900 : isTyping ? 92 : 58;

    const timer = window.setTimeout(() => {
      if (isTyping && isComplete) {
        setPhase('deleting');
        return;
      }
      if (!isTyping && isEmpty) {
        setPhase('typing');
        return;
      }
      setDisplayed(fullText.slice(0, displayed.length + (isTyping ? 1 : -1)));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [displayed, phase, text]);

  return (
    <p className="min-h-[12rem] whitespace-pre-wrap px-5 py-6 text-start font-serif text-3xl leading-snug text-[#33273c] sm:min-h-[10rem] sm:text-4xl">
      {displayed}
      <span className="ml-1 inline-block h-8 w-px translate-y-1 bg-[#7e3f99]" />
    </p>
  );
};

const FloralEntrance = ({ couple, onFinished, locale }) => {

  return (
    <motion.section
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[130] grid min-h-svh place-items-center overflow-hidden bg-[#fffdf8] text-[#33273c]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_0%,#f7f2fb_42%,#d9c2ef_100%)]" />
      <FloatingFlowers withoutTree />
      <Butterflies count={24} />
      <motion.div
        initial={{ scale: 0.72, opacity: 0 }}
        animate={{ scale: [0.72, 1, 1.08], opacity: [0, 1, 1] }}
        transition={{ duration: 4.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30 grid h-[min(82vw,24rem)] w-[min(82vw,24rem)] place-items-center rounded-full border border-[#9f73c2]/40 bg-white/86 shadow-[0_26px_90px_rgba(126,63,153,0.26)] backdrop-blur-xl"
      >
        {flowers.map((flower, index) => (
          <motion.img
            key={flower}
            src={flower}
            alt=""
            className="absolute w-24 sm:w-32"
            initial={{ scale: 0.45, opacity: 0, rotate: index * 40 }}
            animate={{
              scale: [0.45, 1, 1.22],
              opacity: [0, 1, 0.82],
              rotate: [index * 40, index * 40 + 18],
              x: [0, Math.cos(index * 1.25) * 150],
              y: [0, Math.sin(index * 1.25) * 150],
            }}
            transition={{ duration: 3.9, delay: 0.25 + index * 0.1, ease: 'easeInOut' }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: [0, 1, 1, 1], y: [18, 0, 0, 0] }}
          transition={{ duration: 3.4, delay: 0.45, ease: 'easeInOut' }}
          className="relative z-50 mx-5 px-5 py-6 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#5f744a]">A blooming invitation</p>
          <h1 className="mt-3 break-words font-serif text-4xl font-bold leading-tight text-[#7e3f99] drop-shadow-[0_2px_0_rgba(255,255,255,0.95)] sm:text-5xl">
            <CoupleName value={couple} ampersandClassName="text-[#5f744a]" />
          </h1>
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.82, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 4.25, duration: 0.42, ease: 'easeOut' }}
            onClick={onFinished}
            aria-label={locale === 'ar' ? '\u0627\u0641\u062a\u062d \u0627\u0644\u062f\u0639\u0648\u0629' : 'Open invitation'}
            className="mt-6 inline-grid h-10 w-10 place-items-center rounded-full border border-[#9f73c2]/35 bg-white/55 text-[#7e3f99] shadow-[0_6px_16px_rgba(126,63,153,0.16)] backdrop-blur-sm transition hover:scale-110 hover:bg-white/90"
          >
            <FiChevronDown size={19} />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

const SectionTitle = ({ kicker, title }) => (
  <motion.header variants={rise} className="relative z-20 mx-auto mb-9 max-w-3xl text-center">
    {kicker ? <p className="text-xs font-black uppercase tracking-[0.22em] text-[#7e3f99]">{kicker}</p> : null}
    <h2 className="mt-3 font-serif text-4xl leading-tight text-[#33273c] sm:text-5xl">{title}</h2>
    <span className="mx-auto mt-5 block h-px w-24 bg-[#9f73c2]/70" />
  </motion.header>
);

const FloralCountdown = ({ countdown, labels }) => {
  const target = new Date(countdown?.target_date);
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
    <motion.section initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[#fffdf8] px-4 py-14 sm:px-8 sm:py-20">
      <Butterflies count={5} />
      <SectionTitle kicker={countdown.kicker} title={countdown.title || labels.countdown} />
      <motion.div variants={rise} className="relative z-20 mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
        {units.map(([unit, value]) => (
          <div key={unit} className="rounded-[1.8rem] border border-[#cba7ee]/45 bg-white/86 p-5 text-center shadow-[0_18px_48px_rgba(126,63,153,0.11)]">
            <strong className="block font-serif text-4xl font-bold text-[#7e3f99] sm:text-5xl">{String(value).padStart(2, '0')}</strong>
            <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.18em] text-[#5f744a]">{unit}</span>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
};

const FloralRsvp = ({ invitation, invitationPath, labels }) => {
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
      confetti({ particleCount: 120, spread: 74, origin: { y: 0.72 }, colors: ['#cba7ee', '#7e3f99', '#fffdf8', '#5f744a'] });
    }

    localStorage.setItem('rsvp_submitted_' + pathKey, 'true');
    localStorage.setItem('rsvp_guest_name_' + pathKey, form.name);
    localStorage.setItem('rsvp_attending_' + pathKey, form.attending);
    setGuestNameForThanks(form.name);
    setAttendingForThanks(form.attending);
    setSubmitted(true);
  };

  return (
    <motion.section initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[#fbf7ff] px-4 py-16 sm:px-8 sm:py-24">
      <FloatingFlowers soft />
      <SectionTitle kicker={copy.kicker || 'RSVP'} title={copy.title || labels.attending} />
      <motion.div variants={rise} className="relative z-20 mx-auto max-w-2xl rounded-[2rem] border border-[#cba7ee]/26 bg-white/86 p-5 shadow-[0_24px_80px_rgba(126,63,153,0.14)] backdrop-blur sm:p-8">
        {submitted ? (
          <div className="text-center py-6">
            <h3 className="font-serif text-3xl text-[#7e3f99] mb-3">
              {(copy.thanks || 'Thank you, {{name}}!').replace('{{name}}', guestNameForThanks.split(' ')[0])}
            </h3>
            <p className="text-base text-[#33273c]/80">
              {attendingForThanks === 'yes' ? copy.yes_reply : copy.no_reply}
            </p>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={submit}>
            <CustomInput label={copy.name || labels.name} name="floral-name" required value={form.name} placeholder={copy.name_placeholder} onChange={(event) => setForm({ ...form, name: event.target.value })} labelClassName="text-[#33273c] font-black" inputClassName="rounded-[1.35rem] border-[#cba7ee]/35 bg-[#fffdf8] text-[#33273c] placeholder:text-[#33273c]/35 focus:border-[#7e3f99]" />
            <div>
              <p className="mb-2 font-black text-[#33273c]">{copy.attending || labels.attending}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {['yes', 'no'].map((option) => (
                  <label key={option} className="cursor-pointer">
                    <input type="radio" name="floral-attending" value={option} checked={form.attending === option} onChange={(event) => setForm({ ...form, attending: event.target.value })} className="peer sr-only" />
                    <span className="grid min-h-[3.25rem] place-items-center rounded-[1.35rem] border border-[#cba7ee]/35 bg-[#fffdf8] px-4 text-center font-black text-[#33273c] transition peer-checked:border-[#7e3f99] peer-checked:bg-[#7e3f99] peer-checked:text-white">{copy[option] || labels[option]}</span>
                  </label>
                ))}
              </div>
            </div>
            <CustomInput as="textarea" rows="4" label={copy.message || labels.message} name="floral-message" value={form.message} placeholder={copy.message_placeholder} onChange={(event) => setForm({ ...form, message: event.target.value })} labelClassName="text-[#33273c] font-black" inputClassName="rounded-[1.35rem] border-[#cba7ee]/35 bg-[#fffdf8] text-[#33273c] placeholder:text-[#33273c]/35 focus:border-[#7e3f99]" />
            {rsvpError ? <p className="rounded-[1.2rem] border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{rsvpError}</p> : null}
            <CustomBottom type="submit" text={copy.submit || labels.submit} loading={rsvpStatus === 'loading'} disabled={rsvpStatus === 'loading'} rightIcon={<FiSend />} buttonStyles="rounded-[1.4rem] bg-[#7e3f99] text-white shadow-[0_18px_38px_rgba(126,63,153,0.24)] hover:-translate-y-0.5 hover:bg-[#5f744a]" />
          </form>
        )}
      </motion.div>
    </motion.section>
  );
};

const FloralButterflyTemplate = ({ invitation, invitationPath }) => {
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
  const [audioInteractionPrimed, setAudioInteractionPrimed] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const lightboxImage = lightboxIndex == null ? null : images[lightboxIndex];
  const mapsUrl = buildMapsUrl(event);
  const milestones = story.events?.length ? story.events : [
    { title: 'First Meeting', desc: hero.body },
    { title: 'Engagement', desc: event.description },
    { title: 'Wedding Day', desc: event.date },
  ];
  const storySlides = milestones.slice(0, 3);
  const infiniteStorySlides = storySlides.length ? [...storySlides, ...storySlides] : [];
  const infiniteGalleryImages = images.length ? [...images, ...images] : [];

  const enter = () => {
    setOpened(true);
    setAudioStartSignal((signal) => signal + 1);
  };


  useEffect(() => {
    if (!opened || audioInteractionPrimed || !invitation?.audio?.src) return undefined;

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
  }, [audioInteractionPrimed, invitation?.audio?.src, opened]);

  useEffect(() => {
    if (!opened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = lightboxImage ? 'hidden' : '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [opened, lightboxImage]);

  return (
    <main className="relative min-h-screen bg-[#fffdf8] text-[#33273c]" dir={invitation?.locale === 'ar' ? 'rtl' : 'ltr'}>
      <TreeWatermark />
      <AnimatePresence>{!opened ? <FloralEntrance couple={couple} locale={invitation?.locale} onFinished={enter} /> : null}</AnimatePresence>
      <AudioPlayer invitation={invitation} playSignal={audioStartSignal} className="floral-audio-player" />

      {heroEnabled ? (
        <section className="relative isolate grid min-h-svh content-center overflow-hidden bg-[#fffdf8] px-4 py-16 sm:px-8">
          <Butterflies count={7} />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_80%_20%,#eadcf7_0%,transparent_30%),linear-gradient(135deg,#fffdf8,#f4effb_55%,#eee3f8)]" />
          <motion.div initial="hidden" animate="shown" variants={stagger} className="relative z-20 mx-auto w-full max-w-5xl">
            <motion.p variants={rise} className="text-xs font-black uppercase tracking-[0.24em] text-[#7e3f99]">{hero.kicker || labels.welcome}</motion.p>
            <motion.h1 variants={rise} className="mt-5 break-words font-serif text-5xl leading-[0.95] text-[#33273c] sm:text-7xl lg:text-8xl">
              <CoupleName value={couple} ampersandClassName="text-[#7e3f99]" />
            </motion.h1>
            <motion.div variants={rise} className="mt-6 max-w-2xl border-s-2 border-[#cba7ee] ps-5">
              {event.date ? <p className="text-lg font-black text-[#7e3f99]">{event.date}</p> : null}
              {hero.body ? <p className="mt-3 text-base font-semibold leading-8 text-[#4f4754] sm:text-xl">{hero.body}</p> : null}
            </motion.div>
            <motion.a variants={rise} href="#floral-details" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#7e3f99] px-6 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_44px_rgba(126,63,153,0.24)]">
              {hero.save_date || 'Save The Date'} <FiChevronDown />
            </motion.a>
          </motion.div>
        </section>
      ) : null}

      {countdownEnabled ? <FloralCountdown countdown={invitation?.countdown} labels={labels} /> : null}

      {storyEnabled ? (
      <motion.section initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[#fbf7ff] px-4 py-16 sm:px-8 sm:py-24">
        <FloatingFlowers soft />
        <SectionTitle kicker={story.kicker} title={story.title || labels.story} />
        <div className="relative z-20 -mx-4 overflow-hidden sm:hidden">
          <div className={`floral-marquee-track flex w-max gap-4 px-4 ${invitation?.locale === 'ar' ? 'floral-marquee-reverse' : ''}`}>
            {infiniteStorySlides.map((item, index) => {
              const originalIndex = index % storySlides.length;
              const storyImage = images[originalIndex + 1] || images[originalIndex] || images[0];

              return (
                <article key={`${item.title}-${index}`} className="w-[78vw] shrink-0 rounded-[2rem] border border-[#cba7ee]/35 bg-white/88 p-4 shadow-[0_16px_42px_rgba(126,63,153,0.10)] backdrop-blur">
                  <div className="relative mb-4 aspect-[4/3] rounded-[1.6rem] border-2 border-[#cba7ee] bg-[#f4effb] p-3 shadow-[0_0_0_5px_rgba(244,239,251,0.9),0_12px_28px_rgba(126,63,153,0.10)]">
                    {storyImage ? <img src={storyImage} alt="" className="h-full w-full rounded-[1.05rem] border-2 border-[#efe3fa] object-cover outline outline-1 outline-[#9f73c2]/45" /> : null}
                    <img src={flower1} alt="" className="pointer-events-none absolute -left-5 -top-5 w-16 opacity-80" />
                    <img src={flower3} alt="" className="pointer-events-none absolute -bottom-6 -right-6 w-20 opacity-75" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7e3f99]">{item.date || String(originalIndex + 1).padStart(2, '0')}</p>
                  <h3 className="mt-3 font-serif text-3xl text-[#33273c]">{item.title}</h3>
                  {item.desc ? <p className="mt-3 line-clamp-4 leading-7 text-[#4f4754]">{item.desc}</p> : null}
                </article>
              );
            })}
          </div>
        </div>
        <div className="relative z-20 mx-auto hidden max-w-6xl gap-5 sm:grid sm:grid-cols-3">
          {storySlides.map((item, index) => {
            const storyImage = images[index + 1] || images[index] || images[0];

            return (
              <motion.article key={`${item.title}-${index}`} variants={rise} className="rounded-[2rem] border border-[#cba7ee]/35 bg-white/88 p-5 shadow-[0_18px_55px_rgba(126,63,153,0.10)] backdrop-blur">
                <div className="relative mb-4 aspect-[4/3] rounded-[1.6rem] border-2 border-[#cba7ee] bg-[#f4effb] p-3 shadow-[0_0_0_5px_rgba(244,239,251,0.9),0_12px_28px_rgba(126,63,153,0.10)]">
                  {storyImage ? <img src={storyImage} alt="" className="h-full w-full rounded-[1.05rem] border-2 border-[#efe3fa] object-cover outline outline-1 outline-[#9f73c2]/45" /> : null}
                  <img src={flower1} alt="" className="pointer-events-none absolute -left-5 -top-5 w-16 opacity-80" />
                  <img src={flower3} alt="" className="pointer-events-none absolute -bottom-6 -right-6 w-20 opacity-75" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7e3f99]">{item.date || String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 font-serif text-3xl text-[#33273c]">{item.title}</h3>
                {item.desc ? <p className="mt-3 leading-7 text-[#4f4754]">{item.desc}</p> : null}
              </motion.article>
            );
          })}
        </div>
      </motion.section>
      ) : null}

      {galleryEnabled ? (
        <motion.section initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[#fffdf8] px-4 py-16 sm:px-8 sm:py-24">
          <Butterflies count={6} />
          <SectionTitle title={gallery.title || labels.gallery} />
          <div className="relative z-20 -mx-4 overflow-hidden sm:hidden">
            <div className={`floral-marquee-track floral-marquee-slow flex w-max gap-4 px-4 ${invitation?.locale === 'ar' ? 'floral-marquee-reverse' : ''}`}>
              {infiniteGalleryImages.map((image, index) => (
                <button key={`${image}-mobile-${index}`} type="button" onClick={() => setLightboxIndex(index % images.length)} className="floral-gallery-card w-[74vw] shrink-0 overflow-hidden rounded-[2rem] p-2">
                  <img src={image} alt={`${gallery.title || labels.gallery} ${(index % images.length) + 1}`} className="floral-gallery-image aspect-[4/5] w-full rounded-[1.55rem] object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="relative z-20 mx-auto hidden max-w-6xl gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <motion.button key={`${image}-${index}`} type="button" variants={rise} onClick={() => setLightboxIndex(index)} className={`floral-gallery-card group relative overflow-hidden rounded-[2rem] p-2 ${index % 2 ? 'sm:translate-y-8' : ''}`}>
                <img src={image} alt={`${gallery.title || labels.gallery} ${index + 1}`} className="floral-gallery-image aspect-[4/5] w-full rounded-[1.55rem] object-cover transition duration-500 group-hover:scale-[1.03]" />
                <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#7e3f99] opacity-0 shadow-lg transition group-hover:opacity-100"><FiMaximize2 /></span>
              </motion.button>
            ))}
          </div>
        </motion.section>
      ) : null}

      {eventEnabled ? (
      <motion.section id="floral-details" initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[#fbf7ff] px-4 py-16 sm:px-8 sm:py-24">
        <FloatingFlowers soft />
        <SectionTitle kicker={event.kicker} title={event.title || labels.details} />
        <motion.div variants={rise} className="relative z-20 mx-auto max-w-5xl rounded-[2.25rem] border border-[#cba7ee]/26 bg-white/86 p-5 shadow-[0_24px_80px_rgba(126,63,153,0.14)] backdrop-blur sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: FiCalendar, label: event.day_label || 'Wedding Date', value: event.date },
              { icon: FiClock, label: 'Time', value: event.time },
              { icon: FiMapPin, label: event.venue_label || 'Venue', value: event.venue },
              { icon: FiMapPin, label: event.address || 'Address', value: event.location },
            ].map(({ icon: Icon, label, value }) => value ? (
              <div key={`${label}-${value}`} className="rounded-[1.75rem] border border-[#cba7ee]/24 bg-[#fffdf8] p-5">
                <Icon className="mb-4 text-2xl text-[#7e3f99]" />
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7e3f99]">{label}</p>
                <strong className="mt-2 block text-lg leading-7 text-[#33273c]">{value}</strong>
              </div>
            ) : null)}
          </div>
          {mapsUrl ? <a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[1.5rem] bg-[#7e3f99] px-5 text-sm font-black uppercase tracking-[0.16em] text-white"><FiMapPin />{event.open_location || labels.location}</a> : null}
        </motion.div>
      </motion.section>
      ) : null}

      <motion.section initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[#fffdf8] px-4 py-16 sm:px-8 sm:py-24">
        <SectionTitle title={labels.letter} />
        <motion.div variants={rise} className="relative z-20 mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-[#fbf7ff] p-6 text-center shadow-[0_18px_55px_rgba(126,63,153,0.10)] sm:p-10">
          <img src={flower1} alt="" className="pointer-events-none absolute -left-8 -top-8 w-32 opacity-65" />
          <img src={flower3} alt="" className="pointer-events-none absolute -bottom-10 -right-10 w-36 opacity-55" />
          <div className="relative z-10">
            <TypewriterMessage text={event.description || hero.body || 'Your presence will make our day bloom with joy.'} />
          </div>
        </motion.div>
      </motion.section>

      <FloralRsvp invitation={invitation} invitationPath={invitationPath} labels={labels} />
      <PartyUpload invitation={invitation} invitationPath={invitationPath} />

      {footerEnabled ? (
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8,#eadcf7)] px-4 py-16 text-center sm:px-8 sm:py-24">
        <FloatingFlowers soft />
        <Butterflies count={5} />
        <div className="relative z-20 mx-auto max-w-3xl">
          <h2 className="font-serif text-4xl text-[#33273c] sm:text-5xl">{footer.title || labels.finalTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-8 text-[#4f4754]">{footer.text || labels.finalText}</p>
        </div>
      </section>
      ) : null}

      {lightboxImage ? (
        <div className="fixed inset-0 z-[140] grid place-items-center bg-[#33273c]/58 p-4 backdrop-blur-xl" role="dialog" aria-modal="true" onClick={() => setLightboxIndex(null)}>
          <button type="button" onClick={() => setLightboxIndex(null)} className="absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl text-[#7e3f99] shadow-xl" aria-label="Close image"><FiX /></button>
          <img src={lightboxImage} alt="" onClick={(event) => event.stopPropagation()} className="relative z-10 max-h-[86svh] max-w-full rounded-[2rem] border-[10px] border-white object-contain shadow-[0_30px_90px_rgba(51,39,60,0.38)]" />
        </div>
      ) : null}
    </main>
  );
};

export default FloralButterflyTemplate;

