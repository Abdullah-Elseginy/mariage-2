import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCheck, FaGlobe, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { value: 'en', labelKey: 'language.english', shortLabel: 'EN' },
  { value: 'ar', labelKey: 'language.arabic', shortLabel: 'AR' },
];

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = (i18n.language || i18n.resolvedLanguage)?.startsWith('ar') ? 'ar' : 'en';

  const handleChange = (language) => {
    localStorage.setItem('i18nextLng', language);
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="lang-switcher-modal-wrapper wil-portfolio"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            boxSizing: 'border-box',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lang-switcher-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 7, 15, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              cursor: 'pointer',
            }}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.24 }}
            className="lang-switcher-modal"
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* Modal Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <p className="lang-switcher-modal-label">
                  {t('language.label')}
                </p>
                <h2 className="lang-switcher-modal-title">{t('language.modal_title')}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="lang-switcher-close"
                aria-label={t('common.close')}
              >
                <FaTimes />
              </button>
            </div>

            {/* Language Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {LANGUAGES.map((language) => {
                const isSelected = currentLanguage === language.value;

                return (
                  <button
                    key={language.value}
                    type="button"
                    onClick={() => handleChange(language.value)}
                    className={`lang-switcher-option ${isSelected ? 'lang-switcher-option-active' : ''}`}
                  >
                    <span>
                      <span style={{ display: 'block', fontSize: '1rem', fontWeight: '700' }}>
                        {t(language.labelKey)}
                      </span>
                      <span style={{ display: 'block', marginTop: '4px', fontSize: '0.75rem', opacity: 0.65 }}>
                        {language.shortLabel} — {language.value === 'ar' ? 'RTL' : 'LTR'}
                      </span>
                    </span>
                    <span className="lang-switcher-check-circle">
                      {isSelected ? <FaCheck /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        aria-label={t('language.label')}
        onClick={() => setIsOpen(true)}
        className={`fixed left-6 top-6 z-50 inline-flex min-h-11 items-center gap-3 rounded-full border border-gold/40 bg-[#100E16]/80 px-4 py-2 text-[#F7EBD2] shadow-lg backdrop-blur-md transition-colors hover:border-gold hover:bg-[#17101A] lang-switcher-trigger ${className}`}
      >
        <FaGlobe className="text-gold" />
        <span className="text-sm font-bold uppercase tracking-[0.16em]">{currentLanguage}</span>
      </button>

      {typeof document !== 'undefined'
        ? createPortal(modalContent, document.body)
        : modalContent}
    </>
  );
};

export default LanguageSwitcher;
