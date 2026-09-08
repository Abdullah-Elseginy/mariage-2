import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import CoupleName from '../../components/CoupleName';
import './index.css';

const Hero = ({ invitation, onInvitationOpen }) => {
  const { t } = useTranslation();
  const copy = invitation?.hero || {};
  const coupleName = invitation?.couple_display_name;
  const text = (key) => copy[key] || '';
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const openTimerRef = useRef(null);
  const returnTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const afterCloseTimerRef = useRef(null);
  const paperRainFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(openTimerRef.current);
      clearTimeout(returnTimerRef.current);
      clearTimeout(closeTimerRef.current);
      clearTimeout(afterCloseTimerRef.current);
      cancelAnimationFrame(paperRainFrameRef.current);
    };
  }, []);

  if (copy.is_enabled === false) return null;
  if (!coupleName || !copy.open || !copy.kicker) return null;

  const runPaperRain = () => {
    cancelAnimationFrame(paperRainFrameRef.current);

    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const end = Date.now() + (isMobile ? 3800 : 6500);
    const interval = isMobile ? 125 : 78;
    const particleCount = isMobile ? 2 : 4;
    const ticks = isMobile ? 120 : 180;
    const colors = ['#E9D8C0', '#9A77B8', '#6F557A', '#8E6A42', '#221A28'];
    let lastBurst = 0;

    const frame = (now) => {
      if (now - lastBurst >= interval) {
        lastBurst = now;
        confetti({
          particleCount,
          startVelocity: 0,
          spread: isMobile ? 50 : 62,
          ticks,
          gravity: isMobile ? 0.72 : 0.62,
          drift: (Math.random() - 0.5) * (isMobile ? 0.55 : 1),
          scalar: isMobile ? 0.65 + Math.random() * 0.2 : 0.78 + Math.random() * 0.32,
          shapes: ['square'],
          colors,
          origin: {
            x: Math.random(),
            y: -0.08,
          },
          resize: false,
        });
      }

      if (Date.now() < end) {
        paperRainFrameRef.current = requestAnimationFrame(frame);
      }
    };

    paperRainFrameRef.current = requestAnimationFrame(frame);
  };

  const closeInvitation = (afterClose) => {
    clearTimeout(returnTimerRef.current);
    clearTimeout(closeTimerRef.current);
    clearTimeout(afterCloseTimerRef.current);
    cancelAnimationFrame(paperRainFrameRef.current);

    setIsFullScreen(false);

    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      if (typeof afterClose === 'function') {
        afterCloseTimerRef.current = setTimeout(afterClose, 1500);
      }
    }, 1500);
  };

  const handleSaveTheDate = () => {
    closeInvitation(() => {
      document.getElementById('event-details')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const handleOpenInvitation = (event) => {
    if (isOpen || isFullScreen) {
      return;
    }

    const openedByKeyboard = event?.detail === 0;
    const clickedInvitation = event?.target?.closest?.(
      '.envelope-body, .envelope-seal'
    );

    if (event && !openedByKeyboard && !clickedInvitation) {
      return;
    }

    onInvitationOpen?.();

    clearTimeout(openTimerRef.current);
    clearTimeout(returnTimerRef.current);
    clearTimeout(closeTimerRef.current);
    setIsOpen(true);
    runPaperRain();

    openTimerRef.current = setTimeout(() => {
      setIsFullScreen(true);

      returnTimerRef.current = setTimeout(() => {
        closeInvitation();
      }, 15000);
    }, 1200);
  };

  return (
    <section id="hero" className="hero-section">
      <div className="hero-backdrop" />
      <div className="hero-floaters" aria-hidden="true">
        <span className="floating-piece floating-piece-1" />
        <span className="floating-piece floating-piece-2" />
        <span className="floating-piece floating-piece-3" />
        <span className="floating-piece floating-piece-4" />
        <span className="floating-piece floating-piece-5" />
        <span className="floating-piece floating-piece-6" />
        <span className="floating-ring floating-ring-1" />
        <span className="floating-ring floating-ring-2" />
        <span className="butterfly butterfly-1" />
        <span className="butterfly butterfly-2" />
        <span className="butterfly butterfly-3" />
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <motion.button
          type="button"
          className={`invitation-envelope ${isOpen ? 'is-open' : 'is-waiting'}`}
          onClick={handleOpenInvitation}
          aria-label={text('open_invitation')}
          initial={{ scale: 0.94, rotateX: 7, y: 10 }}
          animate={
            isOpen
              ? {
                  scale: [1, 1.14, 0.98, 1.04],
                  rotateX: [0, -5, 3, 0],
                  rotateZ: [0, -1.4, 1.1, 0],
                  y: [0, -22, -4, -8],
                }
              : { scale: 1, rotateX: 0, rotateZ: 0, y: 0 }
          }
          transition={
            isOpen
              ? { duration: 0.75, times: [0, 0.28, 0.58, 1], ease: [0.16, 1, 0.3, 1] }
              : { duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <AnimatePresence>
            {isOpen && !isFullScreen && (
              <motion.div
                className="envelope-boom"
                initial={{ opacity: 0, scale: 0.45 }}
                animate={{ opacity: [0, 0.42, 0], scale: [0.45, 1.25, 1.85] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.72, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          <motion.div
            layoutId="invitation-paper"
            className="invitation-paper"
            initial={false}
            animate={
              isFullScreen
                ? { y: '-56%', opacity: 0.01, rotateZ: -0.4 }
                : isOpen
                  ? { y: '-56%', opacity: 1, rotateZ: -0.4 }
                  : { y: '112%', opacity: 0, rotateZ: 0 }
            }
            transition={{ duration: 1.45, delay: isOpen && !isFullScreen ? 0.45 : 0, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="paper-kicker">{text('kicker')}</span>
            <h1>
              <CoupleName value={coupleName} ampersandClassName="text-gold" />
            </h1>
            <p>{text('body')}</p>
            <span className="paper-date">{text('save_date')}</span>
          </motion.div>

          <div className="envelope-body">
            <div className="envelope-inside" />
            <div className="envelope-pocket envelope-pocket-left" />
            <div className="envelope-pocket envelope-pocket-right" />
            <motion.div
              className="classic-envelope-flap"
              initial={false}
              animate={isOpen ? { rotateX: 182, zIndex: 0 } : { rotateX: 0, zIndex: 4 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            />
              <div className="envelope-seal">
                <span>{text('open')}</span>
              </div>
            </div>
          </motion.button>


      </motion.div>

      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            className="fullscreen-invitation-shell cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={() => closeInvitation()}
          >
            <motion.div
              layoutId="invitation-paper"
              className="fullscreen-invitation-paper cursor-default"
              initial={{ borderRadius: 0 }}
              animate={{ borderRadius: 0 }}
              exit={{ borderRadius: 0 }}
              transition={{ layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="paper-close-button"
                onClick={() => closeInvitation()}
                aria-label={t('common.close')}
              >
                {t('common.close')}
              </button>
              <span className="paper-kicker">{text('kicker')}</span>
              <h1>
                <CoupleName value={coupleName} ampersandClassName="text-gold" />
              </h1>
              <p>{text('body')}</p>
              <button
                type="button"
                className="paper-date paper-date-button"
                onClick={handleSaveTheDate}
              >
                {text('save_date')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
