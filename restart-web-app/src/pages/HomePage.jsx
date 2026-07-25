import React from 'react';
import { useTranslation } from 'react-i18next';
import ImpactSummaryCard from '@features/home/components/ImpactSummaryCard';
import ActionButtonsGrid from '@features/home/components/ActionButtonsGrid';
import EnvironmentalImpactGrid from '@features/home/components/EnvironmentalImpactGrid';
import RecentActivityList from '@features/home/components/RecentActivityList';
import NearbyServicesList from '@features/home/components/NearbyServicesList';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroBanner}>
        <div className={styles.titleGroup}>
          <h1 className={styles.mainTitle}>{t('homeTitle')}</h1>
          <p className={styles.mainSubtitle}>{t('homeSubtitle')}</p>
        </div>
        <ImpactSummaryCard co2Saved="14.8" />
      </div>

      <div className={styles.sectionGroup}>
        <h2 className={styles.groupTitle}>{t('whatToDo')}</h2>
        <ActionButtonsGrid />
      </div>

      <EnvironmentalImpactGrid
        repairedCount={4}
        preventedWasteKg={12.4}
        totalEarnings={2150}
        level={3}
      />

      <div className={styles.twoColumnGrid}>
        <RecentActivityList />
        <NearbyServicesList />
      </div>
    </div>
  );
};

export default HomePage;
