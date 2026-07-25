import React from 'react';
import { Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import styles from './ImpactSummaryCard.module.scss';

export const ImpactSummaryCard = ({ co2Saved = '12.4' }) => {
  const { t } = useTranslation();

  return (
    <GlassCard className={styles.card}>
      <div className={styles.content}>
        <div className={styles.info}>
          <span className={styles.label}>{t('impactSummaryTitle')}</span>
          <div className={styles.valueRow}>
            <span className={styles.number}>{co2Saved} kg</span>
            <span className={styles.unit}>CO₂</span>
          </div>
        </div>
        <div className={styles.iconCircle}>
          <Leaf size={32} />
        </div>
      </div>
    </GlassCard>
  );
};

export default ImpactSummaryCard;
