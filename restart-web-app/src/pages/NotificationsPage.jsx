import React from 'react';
import { CheckCircle2, Tag, Gift, Bell as BellIcon } from 'lucide-react';
import GlassCard from '@components/GlassCard/GlassCard';
import { SkeletonCard } from '@components/Skeleton/Skeleton';
import EmptyState from '@components/EmptyState/EmptyState';
import { useAuthStore } from '@store/authStore';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@hooks/queries/useNotifications';
import styles from './NotificationsPage.module.scss';

const ICONS_BY_TYPE = {
  recycle: CheckCircle2,
  sell: Tag,
  reward: Gift
};

const COLORS_BY_TYPE = {
  recycle: '#22C55E',
  sell: '#F59E0B',
  reward: '#EAB308'
};

export const NotificationsPage = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const { data: notifications, isLoading } = useNotifications(userId);
  const markRead = useMarkNotificationRead(userId);
  const markAllRead = useMarkAllNotificationsRead(userId);

  const list = notifications ?? [];
  const hasUnread = list.some((n) => !n.isRead);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bildirimler</h1>
        {hasUnread && (
          <button className={styles.markAllBtn} onClick={() => markAllRead.mutate()}>
            Tümünü Okundu İşaretle
          </button>
        )}
      </div>

      {isLoading && (
        <div className={styles.list}>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      )}
      {!isLoading && list.length === 0 && (
        <EmptyState icon={BellIcon} title="Henüz bildiriminiz yok" subtitle="Yeni etkinlikler burada görünecek." />
      )}

      <div className={styles.list}>
        {list.map((n) => {
          const Icon = ICONS_BY_TYPE[n.type] ?? BellIcon;
          const color = COLORS_BY_TYPE[n.type] ?? '#64748B';
          return (
            <GlassCard
              key={n.id}
              className={`${styles.card} ${!n.isRead ? styles.unreadCard : ''}`}
              hoverEffect={false}
              onClick={() => !n.isRead && markRead.mutate(n.id)}
            >
              <div className={styles.iconCircle} style={{ backgroundColor: `${color}1A`, color }}>
                <Icon size={20} />
              </div>
              <div className={styles.info}>
                <strong className={styles.notifTitle}>{n.title}</strong>
                <p className={styles.notifDesc}>{n.body}</p>
                <span className={styles.notifTime}>{n.createdAt}</span>
              </div>
              {!n.isRead && <span className={styles.unreadDot} />}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
