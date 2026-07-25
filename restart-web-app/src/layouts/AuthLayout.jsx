import React from 'react';
import { Outlet } from 'react-router-dom';
import { RefreshCw, Leaf } from 'lucide-react';
import ThemeToggle from '@components/ThemeToggle/ThemeToggle';
import LanguageToggle from '@components/LanguageToggle/LanguageToggle';
import styles from './AuthLayout.module.scss';

export const AuthLayout = () => {
  return (
    <div className={styles.wrapper}>
      {/* Top Bar for Toggles */}
      <div className={styles.topControls}>
        <ThemeToggle />
        <LanguageToggle />
      </div>

      <div className={styles.container}>
        {/* Hero Banner (Left Side on Desktop) */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.logoBadge}>
              <RefreshCw size={44} className={styles.logoIcon} />
            </div>
            <h1 className={styles.brandTitle}>ReStart</h1>
            <p className={styles.brandSubtitle}>Sürdürülebilir yaşama adım at</p>
            <div className={styles.heroBadges}>
              <div className={styles.heroChip}>
                <Leaf size={16} /> <span>Daha Temiz Gelecek</span>
              </div>
              <div className={styles.heroChip}>
                <RefreshCw size={16} /> <span>%100 E-Atık Dönüşümü</span>
              </div>
            </div>
          </div>
          {/* Glass floating shapes */}
          <div className={`${styles.glassCard} ${styles.shape1}`} />
          <div className={`${styles.glassCard} ${styles.shape2}`} />
        </div>

        {/* Form Container (Right Side) */}
        <div className={styles.formSection}>
          <div className={styles.formWrapper}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
