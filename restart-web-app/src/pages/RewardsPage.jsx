import React from 'react';
import { Award, Trophy, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import GradientButton from '@components/GradientButton/GradientButton';
import EmptyState from '@components/EmptyState/EmptyState';
import { useAuthStore } from '@store/authStore';
import { useLeaderboard, useBadges, useRewards, useRedeemReward } from '@hooks/queries/useGamification';
import styles from './RewardsPage.module.scss';

export const RewardsPage = () => {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id);

  const { data: leaderboardData, isLoading: leaderboardLoading } = useLeaderboard(userId, 3);
  const { data: badges, isLoading: badgesLoading } = useBadges(userId);
  const { data: rewards, isLoading: rewardsLoading } = useRewards();
  const redeemReward = useRedeemReward(userId);

  const topUsers = leaderboardData?.topUsers ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('navRewards')} & Gamification</h1>
        <p className={styles.subtitle}>E-atık geri dönüştürdükçe puan topla, sıralamada yüksel ve sürdürülebilirlik hediyeleri kazan!</p>
      </div>

      <div className={styles.topSection}>
        {/* Leaderboard Card */}
        <GlassCard className={styles.leaderboardCard}>
          <div className={styles.cardHeader}>
            <Trophy size={24} className={styles.trophyIcon} />
            <h2 className={styles.cardTitle}>{t('leaderboardTitle')}</h2>
          </div>

          {leaderboardLoading && <p className={styles.subtitle}>Yükleniyor...</p>}
          {!leaderboardLoading && topUsers.length === 0 && (
            <EmptyState title="Henüz sıralama verisi yok" subtitle="İlk işlemini yaparak liderlik tablosuna gir." />
          )}

          <div className={styles.leaderboardList}>
            {topUsers.map((user) => (
              <div key={user.rank} className={styles.leaderRow}>
                <span className={styles.rankBadge}>#{user.rank}</span>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.fullName}</span>
                </div>
                <span className={styles.points}>{user.totalPoints} Puan</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Badges Card */}
        <GlassCard className={styles.badgesCard}>
          <div className={styles.cardHeader}>
            <Award size={24} className={styles.awardIcon} />
            <h2 className={styles.cardTitle}>{t('badgesTitle')}</h2>
          </div>

          {badgesLoading && <p className={styles.subtitle}>Yükleniyor...</p>}
          {!badgesLoading && (badges ?? []).length === 0 && (
            <EmptyState title="Henüz rozet kazanılmadı" subtitle="Geri dönüşüm ve satışlarla rozet kazanmaya başla." />
          )}

          <div className={styles.badgesGrid}>
            {(badges ?? []).map((b) => (
              <div key={b.name} className={`${styles.badgeBox} ${b.isUnlocked ? styles.activeBadge : ''}`}>
                <span className={styles.badgeEmoji} style={b.color ? { color: b.color } : undefined}>{b.icon}</span>
                <h4 className={styles.badgeTitle}>{b.name}</h4>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Rewards Store */}
      <div className={styles.rewardsSection}>
        <div className={styles.cardHeader}>
          <Gift size={24} className={styles.trophyIcon} />
          <h2 className={styles.cardTitle}>{t('rewardsTitle')}</h2>
        </div>

        {rewardsLoading && <p className={styles.subtitle}>Yükleniyor...</p>}
        {!rewardsLoading && (rewards ?? []).length === 0 && (
          <EmptyState title="Şu anda kullanılabilir ödül yok" subtitle="Yakında yeni ödüller eklenecek." />
        )}

        <div className={styles.rewardsGrid}>
          {(rewards ?? []).map((reward) => (
            <GlassCard key={reward.id} className={styles.rewardCard} hoverEffect={false}>
              <h4 className={styles.badgeTitle}>{reward.title}</h4>
              {reward.subtitle && <p className={styles.badgeDesc}>{reward.subtitle}</p>}
              <div className={styles.rewardFooter}>
                <span className={styles.points}>{reward.pointsCost} Puan</span>
                <GradientButton
                  isLoading={redeemReward.isPending}
                  disabled={!reward.isActive}
                  onClick={() => redeemReward.mutate(reward.id)}
                >
                  Kullan
                </GradientButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
