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
  const currentLanguage = i18n.resolvedLanguage?.startsWith('ar') ? 'ar' : 'en';

  const handleChange = (language) => {
    localStorage.setItem('i18nextLng', language);
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          <motion.button
            type="button"
            aria-label={t('common.close')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.24 }}
            className="relative w-full max-w-sm rounded-xl border border-champagne bg-[#17101A] p-6 text-[#F7EBD2] shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">{t('language.label')}</p>
                <h2 className="mt-2 text-2xl font-serif">{t('language.modal_title')}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-champagne text-[#F7EBD2]/80 transition-colors hover:border-gold hover:text-gold"
                aria-label={t('common.close')}
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3">
              {LANGUAGES.map((language) => {
                const isSelected = currentLanguage === language.value;

                return (
                  <button
                    key={language.value}
                    type="button"
                    onClick={() => handleChange(language.value)}
                    className={`flex w-full items-center justify-between rounded-lg border p-4 text-start transition-colors ${isSelected ? 'border-gold bg-gold text-[#0B0A10]' : 'border-champagne bg-[#100E16] text-[#F7EBD2] hover:border-gold'}`}
                  >
                    <span>
                      <span className="block text-base font-bold">{t(language.labelKey)}</span>
                      <span className={`mt-1 block text-xs ${isSelected ? 'text-[#0B0A10]/65' : 'text-[#F7EBD2]/55'}`}>
                        {language.shortLabel} - {t('language.direction')}
                      </span>
                    </span>
                    <span className={`grid h-8 w-8 place-items-center rounded-full border ${isSelected ? 'border-[#0B0A10]/20' : 'border-champagne'}`}>
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
        className={`fixed left-6 top-6 z-50 inline-flex min-h-11 items-center gap-3 rounded-full border border-gold/40 bg-[#100E16]/80 px-4 py-2 text-[#F7EBD2] shadow-lg backdrop-blur-md transition-colors hover:border-gold hover:bg-[#17101A] ${className}`}
      >
        <FaGlobe className="text-gold" />
        <span className="text-sm font-bold uppercase tracking-[0.16em]">{currentLanguage}</span>
      </button>
      {typeof document !== 'undefined' ? createPortal(modal, document.body) : modal}
    </>
  );
};

export default LanguageSwitcher;
