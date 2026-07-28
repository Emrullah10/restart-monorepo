import React from 'react';
import { Leaf, RefreshCw } from 'lucide-react';
import styles from './MarketplaceHero.module.scss';

export const MarketplaceHero = ({ title, subtitle, ctaLabel, onCtaClick }) => {
  return (
    <div className={styles.hero}>
      <div className={`${styles.glassShape} ${styles.shape1}`} />
      <div className={`${styles.glassShape} ${styles.shape2}`} />

      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        {ctaLabel && (
          <button className={styles.ctaButton} onClick={onCtaClick}>
            {ctaLabel}
          </button>
        )}
      </div>

      <div className={styles.badges}>
        <div className={styles.badge}>
          <Leaf size={16} /> <span>Sürdürülebilir Tüketim</span>
        </div>
        <div className={styles.badge}>
          <RefreshCw size={16} /> <span>İkinci Hayat Şansı</span>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
