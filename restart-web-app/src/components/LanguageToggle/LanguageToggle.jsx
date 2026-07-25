import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageToggle.module.scss';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const nextLang = currentLang === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('restart_lang', nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={styles.langBtn}
      title="Değiştir / Switch Language"
    >
      {currentLang.toUpperCase()}
    </button>
  );
};

export default LanguageToggle;
