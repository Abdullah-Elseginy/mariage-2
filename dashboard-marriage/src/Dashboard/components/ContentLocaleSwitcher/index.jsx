import React from 'react';
import { useTranslation } from 'react-i18next';

const ContentLocaleSwitcher = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8a6d2f] dark:text-gold">
          {t('dashboard.content_locale.label')}
        </p>
        <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">
          {t('dashboard.content_locale.hint')}
        </p>
      </div>
      <div
        role="tablist"
        aria-label={t('dashboard.content_locale.label')}
        className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-[#344458] dark:bg-[#101923]"
      >
        {['en', 'ar'].map((locale) => {
          const isActive = value === locale;

          return (
            <button
              key={locale}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(locale)}
              className={`min-w-[5.5rem] rounded-lg px-4 py-2 text-sm font-black transition ${
                isActive
                  ? 'bg-[#111820] text-white shadow-sm dark:bg-gold dark:text-[#111820]'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {t(locale === 'ar' ? 'dashboard.content_locale.arabic' : 'dashboard.content_locale.english')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContentLocaleSwitcher;
