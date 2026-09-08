import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiHeart,
  FiMapPin,
  FiMaximize2,
  FiX,
} from 'react-icons/fi';
import { CustomBottom, CustomInput } from '../../../../components';
import { submitInvitationRsvp } from '../../../../store/invitationSlice';
import AudioPlayer from '../../sections/AudioPlayer';
import CoupleName from '../../components/CoupleName';
import PartyUpload from '../../sections/PartyUpload';

const revealViewport = { once: true, amount: 0.18 };
const rise = { hidden: { opacity: 0, y: 34 }, shown: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, shown: { transition: { staggerChildren: 0.12 } } };

const getLocaleLabels = (locale) => (locale === 'ar'
  ? {
      enter: 'ادخل إلى حفلنا',
      welcome: 'أهلا بكم في احتفال زفافنا',
      story: 'قصة حبنا',
      gallery: 'معرض الذكريات',
      details: 'تفاصيل الحفل',
      letter: 'رسالة خاصة',
      phone: 'رقم الهاتف',
      guests: 'عدد الحضور',
      finalTitle: 'شكرا لكونكم جزءا من رحلتنا',
      finalText: 'ننتظر الاحتفال معكم بكل حب',
    }
  : {
      enter: 'Opening The Royal Entrance',
      welcome: 'Welcome To Our Wedding Celebration',
      story: 'Our Love Story',
      gallery: 'Gallery',
      details: 'Event Details',
      letter: 'Personal Message',
      phone: 'Phone Number',
      guests: 'Number of Attendees',
      finalTitle: 'Thank You For Being Part Of Our Journey',
      finalText: "We Can't Wait To Celebrate With You",
    });

const buildMapsUrl = (event = {}) => {
  if (event.map_url) return event.map_url;

  const query = [event.venue, event.location, event.address].filter(Boolean).join(', ');
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '';
};

const RoyalParticles = ({ count = 26 }) => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
    {Array.from({ length: count }, (_, index) => (
      <motion.span
        key={index}
        animate={{
          y: ['-12vh', '112vh'],
          x: [0, index % 2 === 0 ? 28 : -28, 0],
          opacity: [0, 0.85, 0.42, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 9 + (index % 6) * 1.2,
          delay: index * 0.24,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute h-2.5 w-2.5 rotate-45 border border-[#ffe4a3]/40 bg-[#d7a93f]/55 shadow-[0_0_18px_rgba(215,169,63,0.34)]"
        style={{ left: `${4 + ((index * 17) % 92)}%` }}
      />
    ))}
  </div>
);

const FlowerPetals = ({ count = 18 }) => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
    {Array.from({ length: count }, (_, index) => (
      <motion.span
        key={index}
        animate={{ y: ['-10vh', '110vh'], x: [0, index % 2 ? -38 : 38, 0], rotate: [14, 170, 310], opacity: [0, 0.72, 0.55, 0] }}
        transition={{ duration: 10 + (index % 5), delay: index * 0.42, repeat: Infinity, ease: 'linear' }}
        className="absolute h-5 w-3 rounded-[80%_18%_76%_20%] border border-white/20 bg-[linear-gradient(135deg,#fff7e8,#d6a943)] shadow-[0_0_22px_rgba(246,218,152,0.22)]"
        style={{ left: `${2 + ((index * 23) % 96)}%` }}
      />
    ))}
  </div>
);

const SectionHeading = ({ kicker, title, light = false }) => (
  <motion.header variants={rise} className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
    {kicker ? <p className={`text-xs font-black uppercase tracking-[0.22em] sm:text-sm ${light ? 'text-[#d7a93f]' : 'text-[#9f7627]'}`}>{kicker}</p> : null}
    <h2 className={`mt-3 font-serif text-4xl leading-tight sm:text-5xl ${light ? 'text-[#fff8e7]' : 'text-[#26190f]'}`}>{title}</h2>
    <span className={`mx-auto mt-5 block h-px w-24 ${light ? 'bg-[#d7a93f]/70' : 'bg-[#9f7627]/45'}`} />
  </motion.header>
);

const RoyalEntrance = ({ onEnter, groomName, brideName, locale }) => {
  const shellRef = useRef(null);
  const cameraRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const handleRefs = useRef([]);
  const lightRef = useRef(null);
  const maskRef = useRef(null);
  const [opening, setOpening] = useState(false);

  const openDoors = useCallback(() => {
    if (opening) return;
    setOpening(true);

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut', force3D: true },
      onComplete: () => {
        gsap.set(shellRef.current, { autoAlpha: 0 });
        window.setTimeout(onEnter, 80);
      },
    });
    timeline
      .to(handleRefs.current, {
        rotateZ: (index) => (index === 0 ? -42 : 42),
        rotateY: (index) => (index === 0 ? 24 : -24),
        scale: 1.08,
        duration: 0.9,
        ease: 'power2.inOut',
      }, 0.1)
      .to(lightRef.current, { opacity: 0.62, scale: 1.42, duration: 2.2 }, 0.25)
      .to(leftDoorRef.current, { rotateY: 78, duration: 4.6, transformOrigin: 'left center', transformPerspective: 1400 }, 0.75)
      .to(rightDoorRef.current, { rotateY: -78, duration: 4.6, transformOrigin: 'right center', transformPerspective: 1400 }, 0.75)
      .to(cameraRef.current, { scale: 1.05, yPercent: -1, duration: 4.35 }, 0.85)
      .to([leftDoorRef.current, rightDoorRef.current], { opacity: 0, duration: 1.05, ease: 'power1.inOut' }, 4.55)
      .to(maskRef.current, { opacity: 0, duration: 1.15, ease: 'power1.inOut' }, 4.85)
      .to(cameraRef.current, { scale: 1.13, yPercent: -1.25, duration: 1.45, ease: 'power1.inOut' }, 4.75)
      .set(shellRef.current, { autoAlpha: 0 }, 5.65);
  }, [onEnter, opening]);


  return (
    <motion.section ref={shellRef} className="pointer-events-none fixed inset-0 z-[130] grid min-h-svh place-items-center overflow-hidden text-[#fff8e7]">
      <RoyalParticles count={3} />
      <div ref={lightRef} className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5c65c]/22 opacity-0 blur-2xl" />

      <div ref={cameraRef} className="relative z-30 grid min-h-svh w-full place-items-center will-change-transform">
        <div className="relative grid h-svh w-full place-items-center [perspective:1200px] sm:h-[min(92svh,48rem)] sm:w-[min(92vw,40rem)]">
          <div ref={maskRef} aria-hidden="true" className="absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-8 bg-[#020101]/95 sm:h-10" />
            <div className="absolute inset-x-0 bottom-0 h-5 bg-[#020101]/95 sm:h-6" />
            <div className="absolute bottom-5 left-0 top-8 w-[8%] bg-[#020101]/95 sm:bottom-6 sm:top-10" />
            <div className="absolute bottom-5 right-0 top-8 w-[8%] bg-[#020101]/95 sm:bottom-6 sm:top-10" />
          </div>
          <div className="absolute inset-x-0 top-0 h-8 border-b border-[#d7a93f]/45 bg-[linear-gradient(90deg,#120805,#4c2e0c,#120805)] shadow-[0_0_22px_rgba(215,169,63,0.2)] sm:-inset-x-2 sm:h-10 sm:rounded-t-full sm:border" />
          <div className="absolute inset-y-0 left-0 right-0 border-x border-[#d7a93f]/38 sm:inset-y-5 sm:left-2 sm:right-2 sm:rounded-t-[2.8rem] sm:border sm:shadow-[0_0_46px_rgba(215,169,63,0.14)]" />
          <div className="absolute inset-x-[8%] top-8 bottom-5 overflow-hidden rounded-t-[2.2rem] border border-[#f5c65c]/16 bg-transparent sm:top-10 sm:bottom-6 sm:rounded-t-[2.35rem]" />
          <div className="absolute -bottom-2 h-8 w-[92%] rounded-full bg-black/32 blur-md" />
          {[leftDoorRef, rightDoorRef].map((ref, index) => (
            <div
              key={index}
              ref={ref}
              className={`absolute top-8 h-[calc(100%-3.5rem)] w-[45%] overflow-hidden border border-[#d7a93f]/60 bg-[linear-gradient(90deg,#1a0b04_0%,#5b3512_18%,#2b1407_44%,#7a4a17_64%,#1a0b04_100%)] shadow-[inset_0_0_26px_rgba(0,0,0,0.46),0_12px_34px_rgba(0,0,0,0.34)] will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d] ${index === 0 ? 'left-[5%] rounded-l-[2.2rem]' : 'right-[5%] rounded-r-[2.2rem]'}`}
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,232,172,0.08)_0_1px,transparent_1px_18px),linear-gradient(180deg,rgba(255,232,172,0.16),transparent_18%,rgba(0,0,0,0.22)_100%)]" />
              <div className="absolute inset-4 rounded-t-[1.8rem] border border-[#f5c65c]/32 shadow-[inset_0_0_28px_rgba(0,0,0,0.28)]" />
              <div className="absolute inset-x-8 top-16 h-[32%] rounded-t-[1.35rem] border border-[#f5c65c]/28 bg-black/10 shadow-[inset_0_12px_28px_rgba(0,0,0,0.24)]" />
              <div className="absolute inset-x-8 bottom-16 h-[32%] rounded-b-[1.2rem] border border-[#f5c65c]/28 bg-black/10 shadow-[inset_0_12px_28px_rgba(0,0,0,0.24)]" />
              <div className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-[#f5c65c]/18" />
              <div
                ref={(node) => {
                  if (node) handleRefs.current[index] = node;
                }}
                className={`absolute top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-[#ffe6a4]/75 bg-[radial-gradient(circle_at_32%_28%,#fff2bc_0%,#d7a93f_38%,#8d5718_68%,#2b1407_100%)] text-[#160c05] shadow-[0_0_24px_rgba(245,198,92,0.58),12px_12px_24px_rgba(0,0,0,0.36),inset_4px_5px_9px_rgba(255,255,255,0.34),inset_-7px_-8px_14px_rgba(39,18,6,0.58)] will-change-transform [transform-style:preserve-3d] ${index === 0 ? 'right-5' : 'left-5'}`}
              >
                <span className="relative h-7 w-7 rounded-full border border-[#160c05]/45 bg-[radial-gradient(circle_at_35%_28%,#f8df98,#6d3f12_70%)] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.32),inset_-4px_-5px_8px_rgba(0,0,0,0.45)]">
                  <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-[70%_20%_70%_20%] bg-[#160c05]/78 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.18)]" />
                </span>
                <span className={`absolute top-1/2 h-2 w-9 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#fff0b5,#9f7627,#3a210d)] shadow-[0_5px_12px_rgba(0,0,0,0.42)] ${index === 0 ? '-right-8' : '-left-8 rotate-180'}`} />
              </div>
              <div className={`absolute inset-y-0 w-4 bg-[linear-gradient(90deg,rgba(255,231,164,0.26),rgba(0,0,0,0.42))] ${index === 0 ? 'left-0' : 'right-0 rotate-180'}`} />
              {(index === 0 ? brideName : groomName) ? (
                <span className="absolute inset-x-2 top-10 z-20 text-center font-serif text-lg tracking-wide text-[#fff0bd] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] sm:top-12 sm:text-2xl">
                  {index === 0 ? brideName : groomName}
                </span>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            onClick={openDoors}
            disabled={opening}
            className="pointer-events-auto absolute bottom-9 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#ffe6a4]/65 bg-[linear-gradient(135deg,#6f4217,#d7a93f,#6f4217)] px-6 py-3 font-serif text-sm font-bold tracking-wide text-[#1a0b04] shadow-[0_12px_30px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.6)] transition hover:scale-105 hover:brightness-110 disabled:cursor-wait disabled:opacity-70 sm:bottom-12 sm:px-8 sm:py-3.5 sm:text-base"
          >
            <FiHeart className="fill-current" />
            {opening ? (locale === 'ar' ? '\u064a\u062a\u0645 \u0641\u062a\u062d \u0627\u0644\u0628\u0648\u0627\u0628\u0629...' : 'Opening the gate...') : (locale === 'ar' ? '\u0627\u0641\u062a\u062d \u0627\u0644\u0628\u0648\u0627\u0628\u0629' : 'Open the gate')}
          </button>
        </div>
      </div>
    </motion.section>
  );
};

const RoyalCountdown = ({ countdown }) => {
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
    <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {units.map(([unit, value]) => (
        <div key={unit} className="rounded-lg border border-[#f5c65c]/25 bg-black/25 p-3 text-center backdrop-blur-md">
          <strong className="block font-serif text-3xl font-normal text-[#f5c65c]">{String(value).padStart(2, '0')}</strong>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#fff8e7]/70">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const RoyalRsvp = ({ invitation, invitationPath, labels }) => {
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
      confetti({ particleCount: 120, spread: 72, origin: { y: 0.72 }, colors: ['#f5c65c', '#fff8e7', '#9f7627'] });
    }

    localStorage.setItem('rsvp_submitted_' + pathKey, 'true');
    localStorage.setItem('rsvp_guest_name_' + pathKey, form.name);
    localStorage.setItem('rsvp_attending_' + pathKey, form.attending);
    setGuestNameForThanks(form.name);
    setAttendingForThanks(form.attending);
    setSubmitted(true);
  };

  return (
    <motion.section id="rsvp" initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[#100a06] px-4 py-16 text-[#fff8e7] sm:px-8 sm:py-24">
      <RoyalParticles />
      <div className="relative z-30 mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-start">
        <SectionHeading kicker={copy.kicker || 'RSVP'} title={copy.title || 'Are you attending?'} light />
        <motion.div variants={rise} className="rounded-xl border border-[#f5c65c]/28 bg-white/[0.07] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-8">
          {submitted ? (
            <div className="grid min-h-72 content-center text-center">
              <FiHeart className="mx-auto mb-5 text-4xl text-[#f5c65c]" />
              <h3 className="font-serif text-4xl">{(copy.thanks || 'Thank you, {{name}}!').replace('{{name}}', guestNameForThanks.split(' ')[0])}</h3>
              <p className="mx-auto mt-4 max-w-lg leading-8 text-[#fff8e7]/72">{attendingForThanks === 'yes' ? copy.yes_reply : copy.no_reply}</p>
            </div>
          ) : (
            <form className="grid gap-4" onSubmit={submit}>
              <CustomInput label={copy.name || 'Guest Name'} name="royal-name" required value={form.name} placeholder={copy.name_placeholder} onChange={(event) => setForm({ ...form, name: event.target.value })} labelClassName="text-[#fff8e7] font-black" inputClassName="border-[#f5c65c]/35 bg-[#070504]/75 text-[#fff8e7] placeholder:text-[#fff8e7]/35 focus:border-[#f5c65c]" />
              <div>
                <p className="mb-2 font-black">{copy.attending}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {['yes', 'no'].map((option) => (
                    <label key={option} className="cursor-pointer">
                      <input type="radio" name="royal-attending" value={option} checked={form.attending === option} onChange={(event) => setForm({ ...form, attending: event.target.value })} className="peer sr-only" />
                      <span className="grid min-h-[3.25rem] place-items-center rounded-lg border border-[#f5c65c]/35 bg-[#070504]/65 px-4 text-center font-black text-[#fff8e7]/75 transition peer-checked:border-[#f5c65c] peer-checked:bg-[#f5c65c] peer-checked:text-[#160c05]">{copy[option]}</span>
                    </label>
                  ))}
                </div>
              </div>
              <CustomInput as="textarea" rows="4" label={copy.message} name="royal-message" value={form.message} placeholder={copy.message_placeholder} onChange={(event) => setForm({ ...form, message: event.target.value })} labelClassName="text-[#fff8e7] font-black" inputClassName="border-[#f5c65c]/35 bg-[#070504]/75 text-[#fff8e7] placeholder:text-[#fff8e7]/35 focus:border-[#f5c65c]" />
              {rsvpError ? <p className="rounded-lg border border-rose-300/30 bg-rose-950/40 p-3 text-sm font-bold text-rose-100">{rsvpError}</p> : null}
              <CustomBottom type="submit" text={copy.submit || 'Send RSVP'} loading={rsvpStatus === 'loading'} disabled={rsvpStatus === 'loading'} buttonStyles="rounded-lg bg-[#f5c65c] text-[#160c05] hover:bg-[#fff8e7] shadow-[0_18px_44px_rgba(245,198,92,0.22)]" />
            </form>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

const TelegraphMessage = ({ text, title }) => (
  <motion.section initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[#d7bf86] px-4 py-16 sm:px-8 sm:py-24">
    <div aria-hidden="true" className="absolute inset-0 opacity-45 [background-image:linear-gradient(90deg,rgba(72,45,18,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(72,45,18,0.07)_1px,transparent_1px)] [background-size:22px_22px]" />
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-10 bg-[linear-gradient(90deg,#6c4219,#e8cf8f,#6c4219)] opacity-40" />
    <SectionHeading title={title} />
    <motion.div variants={rise} className="relative mx-auto max-w-3xl [perspective:1200px]">
      <motion.div
        animate={{ rotateX: [-78, 0, 0, -78], y: [16, 0, 0, 16] }}
        transition={{ duration: 6.8, times: [0, 0.34, 0.64, 1], repeat: Infinity, ease: 'easeInOut' }}
        className="relative origin-top rounded-sm border border-[#7b5420]/45 bg-[#f2dfad] p-5 shadow-[0_28px_70px_rgba(65,39,12,0.2)] [transform-style:preserve-3d] sm:p-8"
      >
        <div className="absolute inset-0 rounded-sm bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.32),transparent_28%),linear-gradient(135deg,rgba(123,84,32,0.14),transparent_42%,rgba(123,84,32,0.12))]" />
        <div className="relative border-2 border-dashed border-[#7b5420]/45 p-5 text-center sm:p-8">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-[#7b5420]/45 text-[10px] font-black uppercase tracking-[0.16em] text-[#6c4219]">
            Egypt
          </div>
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.24em] text-[#7b5420]">Old Telegraph</p>
          <p className="font-serif text-3xl leading-snug text-[#26190f] sm:text-4xl">{text}</p>
          <div className="mt-7 flex items-center justify-between gap-4 border-t border-[#7b5420]/35 pt-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#7b5420]">
            <span>Cairo Office</span>
            <span>Wedding Notice</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </motion.section>
);

const RoyalEntranceTemplate = ({ invitation, invitationPath }) => {
  const hero = invitation?.hero || {};
  const event = invitation?.event || {};
  const story = invitation?.love_story || {};
  const gallery = invitation?.gallery || {};
  const images = gallery.image_urls || [];
  const couple = invitation?.couple_display_name || `${invitation?.groom_name || ''} & ${invitation?.bride_name || ''}`;
  const labels = getLocaleLabels(invitation?.locale);
  const heroEnabled = hero.is_enabled !== false;
  const storyEnabled = story.is_enabled !== false;
  const galleryEnabled = gallery.is_enabled !== false && images.length > 0;
  const eventEnabled = event.is_enabled !== false;
  const countdownEnabled = invitation?.countdown?.is_enabled !== false;
  const footerEnabled = invitation?.footer?.is_enabled !== false;
  const [entered, setEntered] = useState(false);
  const [audioStartSignal, setAudioStartSignal] = useState(0);
  const [audioInteractionPrimed, setAudioInteractionPrimed] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const lightboxImage = lightboxIndex == null ? null : images[lightboxIndex];


  useEffect(() => {
    if (!entered || audioInteractionPrimed || !invitation?.audio?.src) return undefined;

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
  }, [audioInteractionPrimed, entered, invitation?.audio?.src]);

  useEffect(() => {
    if (!entered) return undefined;

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame = 0;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [entered]);

  useEffect(() => {
    if (!entered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = lightboxImage ? 'hidden' : '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [entered, lightboxImage]);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const showPreviousImage = (event) => {
    event.stopPropagation();
    setLightboxIndex((current) => (current == null ? current : (current - 1 + images.length) % images.length));
  };
  const showNextImage = (event) => {
    event.stopPropagation();
    setLightboxIndex((current) => (current == null ? current : (current + 1) % images.length));
  };

  const enter = useCallback(() => {
    setEntered(true);
    setAudioStartSignal((signal) => signal + 1);
  }, []);

  const milestones = story.events?.length ? story.events : [
    { title: 'First Meeting', desc: hero.body },
    { title: 'Engagement', desc: event.description },
    { title: 'Wedding Day', desc: event.date },
  ];

  return (
    <main className="min-h-screen bg-[#070504] text-[#26190f]">
      {!entered ? <RoyalEntrance groomName={invitation?.groom_name} brideName={invitation?.bride_name} locale={invitation?.locale} onEnter={enter} /> : null}
      <AudioPlayer invitation={invitation} playSignal={audioStartSignal} />

      {heroEnabled ? (
      <section className="relative isolate grid min-h-svh content-center overflow-hidden bg-[#100a06] px-4 py-10 text-[#fff8e7] sm:px-8 lg:px-12">
        {images[0] ? <img src={images[0]} alt={couple} className="absolute inset-0 -z-20 h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_18%,rgba(245,198,92,0.2),transparent_34%),linear-gradient(180deg,rgba(8,5,3,0.68),rgba(8,5,3,0.94))]" />
        <div aria-hidden="true" className="absolute left-1/2 top-7 z-0 h-[84svh] w-[min(92vw,42rem)] -translate-x-1/2 rounded-t-full border border-[#f5c65c]/24 bg-black/10" />
        <div aria-hidden="true" className="absolute inset-x-4 top-5 z-0 h-px bg-[#f5c65c]/20 sm:inset-x-8" />
        <RoyalParticles />
        <FlowerPetals />
        <motion.div initial="hidden" animate="shown" variants={stagger} className="relative z-30 mx-auto grid w-full max-w-6xl gap-7 lg:grid-cols-[1fr_21rem] lg:items-end">
          <div className="max-w-4xl">
            <motion.p variants={rise} className="text-xs font-black uppercase tracking-[0.24em] text-[#f5c65c] sm:text-sm">{hero.kicker || event.kicker}</motion.p>
            <motion.h1 variants={rise} className="mt-4 max-w-4xl break-words font-serif text-5xl leading-[0.94] sm:text-7xl lg:text-8xl">
              <CoupleName value={couple} ampersandClassName="text-[#f5c65c]" />
            </motion.h1>
            <motion.div variants={rise} className="mt-5 grid max-w-2xl gap-4 border-s border-[#f5c65c]/45 ps-4">
              <p className="text-lg font-black leading-7 text-[#f5c65c] sm:text-2xl">{labels.welcome}</p>
              {hero.body ? <p className="text-base font-bold leading-8 text-[#fff8e7]/78 sm:text-xl">{hero.body}</p> : null}
            </motion.div>
            {countdownEnabled ? <RoyalCountdown countdown={invitation?.countdown} /> : null}
          <motion.a variants={rise} href="#royal-details" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#f5c65c]/45 bg-black/28 px-5 text-sm font-black uppercase tracking-[0.16em] text-[#f5c65c] backdrop-blur">
            {hero.save_date || 'Save the Date'}<FiChevronDown />
          </motion.a>
          </div>

          {eventEnabled ? (
          <motion.aside variants={rise} className="rounded-t-[4rem] border border-[#f5c65c]/28 bg-black/42 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl">
            <div className="rounded-t-[3.3rem] border border-[#fff8e7]/12 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f5c65c]">Royal Invitation</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight">{event.title || labels.details}</h2>
              <div className="mt-5 grid gap-3 text-sm font-bold text-[#fff8e7]/76">
                {event.date ? <p className="flex gap-3"><FiCalendar className="mt-1 shrink-0 text-[#f5c65c]" />{event.date}</p> : null}
                {event.time ? <p className="flex gap-3"><FiClock className="mt-1 shrink-0 text-[#f5c65c]" />{event.time}</p> : null}
                {event.venue ? <p className="flex gap-3"><FiMapPin className="mt-1 shrink-0 text-[#f5c65c]" />{event.venue}</p> : null}
              </div>
            </div>
          </motion.aside>
          ) : null}
        </motion.div>
      </section>
      ) : null}

      {storyEnabled ? (
      <motion.section id="royal-story" initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#231408_0%,#080504_58%,#030202_100%)] px-4 py-16 text-[#fff8e7] sm:px-8 sm:py-24">
        <FlowerPetals />
        <SectionHeading kicker={story.kicker} title={story.title || labels.story} light />
        <div className="relative z-30 mx-auto grid max-w-6xl gap-6 before:absolute before:left-4 before:top-0 before:hidden before:h-full before:w-px before:bg-[#f5c65c]/28 md:before:block">
          {milestones.slice(0, 6).map((item, index) => (
            <motion.article key={`${item.title}-${index}`} variants={rise} className={`relative grid gap-4 rounded-t-[4rem] border border-[#f5c65c]/28 bg-[#120b06]/86 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur sm:p-5 md:grid-cols-[12rem_1fr] md:ps-8 ${index % 2 ? 'md:ms-16' : 'md:me-16'}`}>
              <span className="absolute -left-[0.1rem] top-12 hidden h-3 w-3 rounded-full bg-[#f5c65c] shadow-[0_0_20px_rgba(245,198,92,0.8)] md:block" />
              {images.length ? <img src={images[(index + 1) % images.length]} alt="" className="h-48 w-full rounded-t-[3rem] border border-[#f5c65c]/22 object-cover md:h-full" /> : <div className="h-48 rounded-t-[3rem] border border-[#f5c65c]/22 bg-[linear-gradient(135deg,#26190f,#d7a93f)] md:h-full" />}
              <div className="grid content-center">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#f5c65c]">{item.date || String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-serif text-3xl text-[#fff8e7]">{item.title}</h3>
                {item.desc ? <p className="mt-3 leading-8 text-[#fff8e7]/66">{item.desc}</p> : null}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>
      ) : null}

      {galleryEnabled ? (
        <motion.section initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[#0b0705] px-4 py-16 text-[#fff8e7] sm:px-8 sm:py-24">
          <SectionHeading title={gallery.title || labels.gallery} light />
          <div className="relative z-30 mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.button type="button" variants={rise} onClick={() => openLightbox(0)} className="group relative min-h-[26rem] overflow-hidden rounded-t-[6rem] border border-[#f5c65c]/28 bg-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.36)]">
              <img src={images[0]} alt={`${gallery.title || labels.gallery} 1`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-4 rounded-t-[5rem] border border-[#fff8e7]/20" />
              <span className="absolute left-5 top-5 rounded-full bg-[#f5c65c] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#160c05]">Featured</span>
              <span className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-[#f5c65c] text-[#160c05]"><FiMaximize2 /></span>
            </motion.button>

            <div className="grid gap-4 sm:grid-cols-2">
              {images.slice(1).map((image, index) => (
                <motion.button key={`${image}-${index}`} type="button" variants={rise} onClick={() => openLightbox(index + 1)} className={`group relative min-h-48 overflow-hidden border border-[#f5c65c]/24 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] ${index % 3 === 0 ? 'rounded-t-[3.5rem]' : 'rounded-lg'} ${index === 2 ? 'sm:col-span-2 min-h-56' : ''}`}>
                  <img src={image} alt={`${gallery.title || labels.gallery} ${index + 2}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className={`absolute inset-3 border border-[#fff8e7]/16 ${index % 3 === 0 ? 'rounded-t-[2.8rem]' : 'rounded-md'}`} />
                  <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-[#f5c65c] text-[#160c05] opacity-0 transition group-hover:opacity-100"><FiMaximize2 /></span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>
      ) : null}

      {eventEnabled ? (
      <motion.section id="royal-details" initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative overflow-hidden bg-[linear-gradient(180deg,#080504,#1a1008)] px-4 py-16 text-[#fff8e7] sm:px-8 sm:py-24">
        <RoyalParticles />
        <SectionHeading kicker={event.kicker} title={event.title || labels.details} light />
        <motion.div variants={rise} className="relative z-30 mx-auto grid max-w-5xl gap-4 rounded-t-[5rem] border border-[#f5c65c]/30 bg-[#100a06]/84 p-5 shadow-[0_36px_110px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8 md:grid-cols-2">
          <div aria-hidden="true" className="absolute inset-3 rounded-t-[4.3rem] border border-[#f5c65c]/16" />
          {[
            { icon: FiCalendar, label: event.day_label, value: event.date },
            { icon: FiClock, label: 'Time', value: event.time },
            { icon: FiMapPin, label: event.venue_label, value: event.venue },
            { icon: FiMapPin, label: event.address, value: event.location },
          ].map(({ icon: Icon, label, value }) => value ? (
            <div key={`${label}-${value}`} className="relative rounded-t-[2.5rem] border border-[#f5c65c]/22 bg-black/28 p-5">
              <Icon className="mb-3 text-2xl text-[#f5c65c]" />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f5c65c]">{label}</p>
              <strong className="mt-2 block text-lg leading-7 text-[#fff8e7]">{value}</strong>
            </div>
          ) : null)}
          {buildMapsUrl(event) ? (
            <a href={buildMapsUrl(event)} target="_blank" rel="noreferrer" className="relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f5c65c] px-5 text-center text-sm font-black uppercase tracking-[0.16em] text-[#160c05] shadow-[0_18px_44px_rgba(245,198,92,0.22)] transition hover:bg-[#fff8e7] md:col-span-2">
              <FiMapPin />
              {event.open_location || 'Open Location'}
            </a>
          ) : null}
        </motion.div>
      </motion.section>
      ) : null}

      <TelegraphMessage title={labels.letter} text={hero.body || event.description || 'Your presence will make our special day even more memorable. We look forward to celebrating together.'} />

      <RoyalRsvp invitation={invitation} invitationPath={invitationPath} labels={labels} />
      <PartyUpload invitation={invitation} invitationPath={invitationPath} />

      {footerEnabled ? (
      <motion.footer initial="hidden" whileInView="shown" viewport={revealViewport} variants={stagger} className="relative isolate overflow-hidden bg-[#170d08] px-4 py-20 text-center text-[#fff8e7] sm:px-8 sm:py-28">
        {images[images.length - 1] ? <img src={images[images.length - 1]} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(23,13,8,0.7),rgba(23,13,8,0.95))]" />
        <FlowerPetals />
        <motion.div variants={rise} className="relative z-30 mx-auto max-w-4xl">
          <h2 className="font-serif text-4xl leading-tight sm:text-6xl">{labels.finalTitle}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-bold leading-8 text-[#fff8e7]/72">{labels.finalText}</p>
          <FiHeart className="mx-auto mt-8 text-5xl text-[#f5c65c] drop-shadow-[0_0_20px_rgba(245,198,92,0.45)]" />
        </motion.div>
      </motion.footer>
      ) : null}

      {lightboxImage ? (
        <div
          className="fixed inset-0 z-[140] grid place-items-center bg-black/82 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          <button type="button" onClick={closeLightbox} className="absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center rounded-full border border-[#f5c65c]/55 bg-[#f5c65c] text-2xl text-[#160c05] shadow-[0_0_28px_rgba(245,198,92,0.45)]" aria-label="Close image"><FiX /></button>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.45)_70%)]" />
          {images.length > 1 ? (
            <>
              <button type="button" onClick={showPreviousImage} className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-[#f5c65c]/55 bg-[#100a06]/90 text-2xl text-[#f5c65c] shadow-[0_0_28px_rgba(0,0,0,0.4)] sm:left-6" aria-label="Previous image"><FiChevronLeft /></button>
              <button type="button" onClick={showNextImage} className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-[#f5c65c]/55 bg-[#100a06]/90 text-2xl text-[#f5c65c] shadow-[0_0_28px_rgba(0,0,0,0.4)] sm:right-6" aria-label="Next image"><FiChevronRight /></button>
              <span className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#f5c65c]/35 bg-[#100a06]/86 px-4 py-2 text-xs font-black text-[#f5c65c]">
                {lightboxIndex + 1} / {images.length}
              </span>
            </>
          ) : null}
          <img
            src={lightboxImage}
            alt=""
            onClick={(event) => event.stopPropagation()}
            className="relative z-10 max-h-[86svh] max-w-full rounded-t-[3rem] border border-[#f5c65c]/35 object-contain shadow-[0_30px_90px_rgba(0,0,0,0.58)]"
          />
        </div>
      ) : null}
    </main>
  );
};

export default RoyalEntranceTemplate;
