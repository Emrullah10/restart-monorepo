import React from 'react';
import { User, Mail, Shield, Award, Leaf, Calendar } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import GlassCard from '@components/GlassCard/GlassCard';
import styles from './ProfilePage.module.scss';

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className={styles.container}>
      <GlassCard className={styles.headerCard}>
        <div className={styles.profileHeader}>
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'}
            alt="Avatar"
            className={styles.avatar}
          />
          <div className={styles.info}>
            <h1 className={styles.name}>{user?.fullName || 'Kullanıcı'}</h1>
            <p className={styles.email}>{user?.email || 'kullanici@restart.com'}</p>
            <div className={styles.badgeRow}>
              <span className={styles.tag}><Shield size={14} /> Doğrulanmış Hesap</span>
              <span className={styles.tag}><Award size={14} /> Seviye 3 Eco Warrior</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className={styles.statsGrid}>
        <GlassCard className={styles.statBox}>
          <Leaf size={24} className={styles.leafIcon} />
          <span className={styles.statNum}>14.8 kg</span>
          <span className={styles.statLabel}>Kurtarılan CO₂</span>
        </GlassCard>

        <GlassCard className={styles.statBox}>
          <Award size={24} className={styles.awardIcon} />
          <span className={styles.statNum}>1.850</span>
          <span className={styles.statLabel}>Toplanan Puan</span>
        </GlassCard>

        <GlassCard className={styles.statBox}>
          <Calendar size={24} className={styles.calIcon} />
          <span className={styles.statNum}>8</span>
          <span className={styles.statLabel}>Toplam İşlem</span>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProfilePage;
