// i18n configuration for Muslim Life OS
// Supports: English (en), Somali (so), Arabic (ar)

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import so from './locales/so.json';
import ar from './locales/ar.json';

const savedLang = localStorage.getItem('ml-lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, so: { translation: so }, ar: { translation: ar } },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
