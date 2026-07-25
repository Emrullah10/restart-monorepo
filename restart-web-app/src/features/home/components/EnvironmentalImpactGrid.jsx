import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import styles from './EnvironmentalImpactGrid.module.scss';

export const EnvironmentalImpactGrid = ({
  repairedCount = 3,
  preventedWasteKg = 8.5,
  totalEarnings = 1450,
  level = 2
}) => {
  const { t } = useTranslation();

  const stats = [
    { value: repairedCount.toString(), label: t('statRepairedDevices') },
    { value: `${preventedWasteKg}kg`, label: t('statPreventedWaste') },
    { value: `₺${totalEarnings}`, label: t('statTotalEarnings') },
    { value: t('statLevel', { level }), label: t('statEcoWarrior') }
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{t('environmentalImpactTitle')}</h3>
      <div className={styles.grid}>
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className={styles.card} hoverEffect={false}>
            <span className={styles.value}>{stat.value}</span>
            <span className={styles.label}>{stat.label}</span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentalImpactGrid;
