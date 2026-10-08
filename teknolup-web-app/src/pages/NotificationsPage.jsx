import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Skeleton, EmptyState, cx } from '@components/ui';
import { useAuthStore } from '@store/authStore';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@hooks/queries/useNotifications';
import { formatRelative } from '@shared/format';

const TYPE = { recycle: ['recycling', 'text-accent'], sell: ['sell', 'text-sell'], reward: ['redeem', 'text-accent'], repair: ['build', 'text-repair'] };

const dayGroup = (value, now = new Date()) => {
  const d = new Date(value);
  const diff = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
  return diff <= 0 ? 'today' : diff === 1 ? 'yesterday' : 'older';
};

export const NotificationsPage = () => {
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const { data, isLoading } = useNotifications(userId);
  const markRead = useMarkNotificationRead(userId);
  const markAll = useMarkAllNotificationsRead(userId);
  const all = data ?? [];
  const unread = all.filter((n) => !n.isRead).length;
  const shown = onlyUnread ? all.filter((n) => !n.isRead) : all;
  const groups = ['today', 'yesterday', 'older'].map((g) => [g, shown.filter((n) => dayGroup(n.createdAt) === g)]).filter(([, l]) => l.length);

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-space-6 px-space-6 py-space-8">
      <div className="flex flex-col gap-space-4 border-b border-line pb-space-6">
        <div className="flex items-center justify-between gap-space-4">
          <h2 className="font-heading-lg text-heading-lg text-fg">{t('nav.notifications')}</h2>
          {unread > 0 && <button type="button" onClick={() => markAll.mutate()} className="font-label text-label uppercase tracking-widest text-accent hover:text-accent-hover">{t('notifications.markAll')}</button>}
        </div>
        <div className="flex items-center gap-space-3">
          <button type="button" onClick={() => setOnlyUnread(false)} className={cx('rounded-r12 px-space-4 py-space-1 font-label text-label transition-colors', !onlyUnread ? 'bg-accent text-on-accent' : 'border border-line-strong bg-muted text-fg-2 hover:bg-strong')}>{t('notifications.all', { count: all.length })}</button>
          <button type="button" onClick={() => setOnlyUnread(true)} className={cx('rounded-r12 px-space-4 py-space-1 font-label text-label transition-colors', onlyUnread ? 'bg-accent text-on-accent' : 'border border-line-strong bg-muted text-fg-2 hover:bg-strong')}>{t('notifications.unread', { count: unread })}</button>
        </div>
      </div>

      {isLoading && <div className="flex flex-col gap-space-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>}
      {!isLoading && shown.length === 0 && <EmptyState icon="notifications" title={t('notifications.emptyTitle')} subtitle={t('notifications.emptySub')} />}

      <div className="flex flex-col gap-space-8">
        {groups.map(([g, list]) => (
          <section key={g} className="flex flex-col gap-space-3">
            <h3 className="pl-1 font-label text-label uppercase tracking-wider text-fg-2">{t(`notifications.groups.${g}`)}</h3>
            <div className="flex flex-col gap-space-2">
              {list.map((n) => {
                const [icon, color] = TYPE[n.type] ?? ['notifications', 'text-fg-2'];
                return (
                  <div key={n.id} role="button" tabIndex={0} onClick={() => !n.isRead && markRead.mutate(n.id)} onKeyDown={(e) => e.key === 'Enter' && !n.isRead && markRead.mutate(n.id)} className={cx('group relative flex cursor-pointer items-start gap-space-4 rounded-r4 border border-line p-space-4 transition-colors hover:bg-hover', n.isRead ? 'bg-surface' : 'bg-accent-subtle')}>
                    <div className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-r12 transition-transform', n.isRead ? 'bg-muted text-fg-2 group-hover:bg-strong' : cx('border border-line bg-surface group-hover:scale-105', color))}>
                      <Icon name={icon} fill={n.isRead ? 0 : 1} />
                    </div>
                    <div className={cx('flex flex-1 flex-col gap-1', n.isRead ? 'pr-space-4' : 'pr-space-6')}>
                      <p className={cx('font-body-md text-body-md text-fg', !n.isRead && 'font-semibold')}>{n.title}</p>
                      <p className="font-body-md text-body-md text-fg-2">{n.body}</p>
                      <span className="mt-1 font-caption text-caption text-fg-3">{formatRelative(n.createdAt)}</span>
                    </div>
                    {!n.isRead && <div className="absolute right-4 top-6 h-[8px] w-[8px] rounded-r12 bg-accent" />}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};
export default NotificationsPage;
