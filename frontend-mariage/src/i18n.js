import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.json';
import en from './locales/en.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const savedLanguage = localStorage.getItem('i18nextLng');
const initialLanguage = savedLanguage || 'ar';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

const applyDocumentLanguage = (language) => {
  const resolvedLanguage = language?.startsWith('ar') ? 'ar' : 'en';
  document.documentElement.lang = resolvedLanguage;
  document.documentElement.dir = resolvedLanguage === 'ar' ? 'rtl' : 'ltr';
};

applyDocumentLanguage(initialLanguage);
i18n.on('languageChanged', applyDocumentLanguage);

export default i18n;
