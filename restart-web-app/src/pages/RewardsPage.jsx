import React from 'react';
import { Award, Trophy, Gift, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import styles from './RewardsPage.module.scss';

export const RewardsPage = () => {
  const { t } = useTranslation();

  const leaderboard = [
    { rank: 1, name: 'Selin A.', points: '3.450 Puan', co2: '42.5 kg', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { rank: 2, name: 'Emre T.', points: '2.890 Puan', co2: '35.1 kg', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { rank: 3, name: 'Deniz Y.', points: '2.410 Puan', co2: '29.8 kg', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200' }
  ];

  const badges = [
    { title: 'Çevre Kahramanı', desc: '5 cihaz geri dönüştür', active: true, icon: '🌿' },
    { title: 'E-Atık Avcısı', desc: '10kg e-atık önle', active: true, icon: '⚡' },
    { title: 'İkinci El Ustası', desc: '3 ikinci el satış yap', active: false, icon: '🏆' }
  ];

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

          <div className={styles.leaderboardList}>
            {leaderboard.map((user) => (
              <div key={user.rank} className={styles.leaderRow}>
                <span className={styles.rankBadge}>#{user.rank}</span>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userSub}>{user.co2} CO₂ Engellendi</span>
                </div>
                <span className={styles.points}>{user.points}</span>
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

          <div className={styles.badgesGrid}>
            {badges.map((b, idx) => (
              <div key={idx} className={`${styles.badgeBox} ${b.active ? styles.activeBadge : ''}`}>
                <span className={styles.badgeEmoji}>{b.icon}</span>
                <h4 className={styles.badgeTitle}>{b.title}</h4>
                <p className={styles.badgeDesc}>{b.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default RewardsPage;
