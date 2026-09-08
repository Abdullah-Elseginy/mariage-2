import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiKey } from 'react-icons/fi';
import CurtainPanels from './CurtainPanels';
import FloatingPetals from './FloatingPetals';
import GoldenParticles from './GoldenParticles';
import brideCurtain from '../../assets/images/loading/bride-curtain.png';
import groomCurtain from '../../assets/images/loading/groom-curtain.png';
import './loadingScreen.css';

const LoadingScreen = ({ duration = 5000, invitation, onCurtainsOpen, onFinished }) => {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [showOpenPrompt, setShowOpenPrompt] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const loadingCopy = invitation?.loading || {};

  useEffect(() => {
    const promptTimer = setTimeout(() => setShowOpenPrompt(true), Math.max(duration * 0.36, 1300));
    return () => clearTimeout(promptTimer);
  }, [duration]);

  const handleOpen = () => {
    if (curtainsOpen) return;
    setCurtainsOpen(true);
    onCurtainsOpen?.();
    window.setTimeout(() => setIsLeaving(true), 1550);
    window.setTimeout(() => onFinished?.(), 2350);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      className="loading-screen"
      role="status"
      aria-live="polite"
      initial={{ opacity: 1 }}
      animate={{
        opacity: isLeaving ? 0 : 1,
        scale: isLeaving ? 1.02 : 1,
        filter: isLeaving ? 'blur(10px)' : 'blur(0px)',
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="loading-luxury-bg" />
      <GoldenParticles />
      <FloatingPetals />
      <CurtainPanels isOpen={curtainsOpen} groomName={invitation.groom_name} brideName={invitation.bride_name} />

      <div className="loading-couple-stage" aria-hidden="true">
        <motion.div
          className="loading-character-zone loading-character-zone-groom"
          initial={{ opacity: 0, y: 18 }}
          animate={{
            opacity: isLeaving ? 0 : 1,
            x: curtainsOpen ? '-52vw' : 0,
            y: 0,
          }}
          transition={{
            duration: curtainsOpen ? 1.55 : 0.9,
            ease: curtainsOpen ? [0.76, 0, 0.24, 1] : [0.16, 1, 0.3, 1],
            delay: curtainsOpen ? 0 : 0.25,
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
          initial={{ opacity: 0, y: 18 }}
          animate={{
            opacity: isLeaving ? 0 : 1,
            x: curtainsOpen ? '52vw' : 0,
            y: 0,
          }}
          transition={{
            duration: curtainsOpen ? 1.55 : 0.9,
            ease: curtainsOpen ? [0.76, 0, 0.24, 1] : [0.16, 1, 0.3, 1],
            delay: curtainsOpen ? 0 : 0.25,
          }}
        >
          <figure className="loading-character loading-character-bride">
            <span className="loading-hand-pull loading-hand-pull-bride" />
            <span className="loading-grip-line loading-grip-line-bride" />
            <img src={brideCurtain} alt="" draggable="false" />
          </figure>
        </motion.div>
      </div>

      <motion.div
        className="loading-copy"
        initial={{ opacity: 0, y: 18, scale: 0.94, filter: 'blur(12px)' }}
        animate={{
          opacity: showOpenPrompt && !isLeaving ? 1 : 0,
          y: showOpenPrompt ? 0 : 18,
          scale: showOpenPrompt ? 1 : 0.94,
          filter: showOpenPrompt ? 'blur(0px)' : 'blur(12px)',
        }}
        transition={{
          duration: 0.85,
          ease: 'easeOut',
        }}
      >
        <span className="loading-kicker">{loadingCopy.prompt_kicker}</span>
        <button
          type="button"
          onClick={handleOpen}
          disabled={curtainsOpen}
          className="loading-open-button"
          aria-label={invitation?.locale === 'ar' ? '\u0627\u0641\u062a\u062d \u0627\u0644\u062f\u0639\u0648\u0629' : 'Open invitation'}
        >
          <FiKey size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
