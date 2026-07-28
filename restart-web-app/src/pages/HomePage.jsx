import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@store/authStore';
import { useProfile } from '@hooks/queries/useProfile';
import { useActivities } from '@hooks/queries/useActivities';
import { useServices } from '@hooks/queries/useServices';
import ImpactSummaryCard from '@features/home/components/ImpactSummaryCard';
import ActionButtonsGrid from '@features/home/components/ActionButtonsGrid';
import EnvironmentalImpactGrid from '@features/home/components/EnvironmentalImpactGrid';
import RecentActivityList from '@features/home/components/RecentActivityList';
import NearbyServicesList from '@features/home/components/NearbyServicesList';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id);

  const { data: profile } = useProfile(userId);
  const { data: activities } = useActivities(userId, 5);
  const { data: services } = useServices();

  const stats = profile?.stats;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroBanner}>
        <div className={styles.titleGroup}>
          <h1 className={styles.mainTitle}>{t('homeTitle')}</h1>
          <p className={styles.mainSubtitle}>{t('homeSubtitle')}</p>
        </div>
        <ImpactSummaryCard co2Saved={stats?.co2Saved ?? '0'} />
      </div>

      <div className={styles.sectionGroup}>
        <h2 className={styles.groupTitle}>{t('whatToDo')}</h2>
        <ActionButtonsGrid />
      </div>

      <EnvironmentalImpactGrid
        repairedCount={stats?.repairedCount ?? 0}
        preventedWasteKg={stats?.preventedWasteKg ?? 0}
        totalEarnings={stats?.totalEarnings ?? 0}
        level={stats?.level ?? 1}
      />

      <div className={styles.twoColumnGrid}>
        <RecentActivityList activities={activities ?? []} />
        <NearbyServicesList services={services?.slice(0, 3) ?? []} />
      </div>
    </div>
  );
};

export default HomePage;
