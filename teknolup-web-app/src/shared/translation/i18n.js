import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr from './locales/tr.json';
import en from './locales/en.json';

const read = () => { try { return localStorage.getItem('teknolup_lang'); } catch { return null; } };
const savedLang = read() || 'tr';

i18n
  .use(initReactI18next)
  .init({
    resources: { tr: { translation: tr }, en: { translation: en } },
    lng: savedLang,
    fallbackLng: 'tr',
    interpolation: { escapeValue: false },
  });

// CSS `uppercase` is locale-aware (İ/ı) only when <html lang> is right.
const syncLang = (lng) => { document.documentElement.lang = lng; };
syncLang(savedLang);
i18n.on('languageChanged', (lng) => {
  syncLang(lng);
  try { localStorage.setItem('teknolup_lang', lng); } catch { /* ignore */ }
});

export default i18n;
