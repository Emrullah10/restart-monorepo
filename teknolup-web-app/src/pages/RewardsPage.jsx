import { useTranslation } from 'react-i18next';
import { Icon, Card, EmptyState, cx } from '@components/ui';
import { useAuthStore } from '@store/authStore';
import { useProfile } from '@hooks/queries/useProfile';
import { useLeaderboard, useBadges, useRewards, useRedeemReward } from '@hooks/queries/useGamification';
import { badgeIcon, rewardVisual } from '@features/rewards/visuals';
import { formatNumber } from '@shared/format';

const head = 'flex items-center justify-between border-b border-line bg-field px-space-5 py-space-4';

export const RewardsPage = () => {
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);
  const { data: profile } = useProfile(userId);
  const { data: board } = useLeaderboard(userId, 3);
  const { data: badges } = useBadges(userId);
  const { data: rewards, isLoading: rewardsLoading } = useRewards();
  const redeem = useRedeemReward(userId);
  const points = profile?.stats?.totalPoints ?? 0;
  const top = board?.topUsers ?? [];
  const me = board?.currentUser;
  const list = badges ?? [];
  const unlocked = list.filter((b) => b.isUnlocked).length;

  return (
    <main className="mx-auto flex max-w-[1180px] flex-col gap-space-8 p-6 lg:p-10">
      <section className="flex w-full flex-col items-center justify-center rounded-r4 border border-line bg-subtle p-space-6 text-center md:p-space-10">
        <h3 className="mb-space-2 font-label text-label uppercase tracking-widest text-fg-2">{t('rewards.balance')}</h3>
        <div className="flex items-baseline gap-space-2">
          <span className="font-data-xl text-data-xl tabular-nums text-accent">{formatNumber(points)}</span>
          <span className="font-heading-md text-heading-md text-accent">{t('units.points').toUpperCase()}</span>
        </div>
        <div className="mx-auto mt-space-4 h-1 w-24 rounded-r12 bg-strong" />
      </section>

      <div className="grid grid-cols-1 gap-space-8 lg:grid-cols-12">
        <section className="flex flex-col overflow-hidden rounded-r4 border border-line bg-surface lg:col-span-5">
          <div className={head}><h3 className="font-label text-label uppercase tracking-wider text-fg">{t('rewards.leaderboard')}</h3><Icon name="format_list_numbered" size={18} className="text-fg-2" /></div>
          <div className="flex flex-1 flex-col">
            {top.length === 0 && <p className="p-space-5 font-caption text-caption text-fg-2">{t('rewards.noBoard')}</p>}
            {top.map((u) => (
              <div key={u.rank} className="flex items-center justify-between border-b border-line px-space-5 py-space-3">
                <div className="flex items-center gap-space-3"><span className="w-4 font-label text-label tabular-nums text-fg-3">#{u.rank}</span><span className="font-body-md text-body-md text-fg">{u.fullName}</span></div>
                <span className="font-label text-label tabular-nums text-fg-2">{formatNumber(u.totalPoints)} {t('units.pointsShort')}</span>
              </div>
            ))}
            {me && <><div className="p-space-3 text-center text-fg-3"><Icon name="more_vert" size={16} /></div>
              <div className="mt-auto flex items-center justify-between border-l-[3px] border-t border-l-accent border-t-line bg-muted px-space-5 py-space-4">
                <div className="flex items-center gap-space-3"><span className="w-4 font-label text-label font-bold tabular-nums text-accent">#{me.rank}</span><span className="font-body-md text-body-md font-semibold text-fg">{t('rewards.you')}</span></div>
                <span className="font-label text-label font-bold tabular-nums text-accent">{formatNumber(me.totalPoints)} {t('units.pointsShort')}</span>
              </div></>}
          </div>
        </section>

        <section className="overflow-hidden rounded-r4 border border-line bg-surface lg:col-span-7">
          <div className={head}><h3 className="font-label text-label uppercase tracking-wider text-fg">{t('rewards.badges')}</h3><span className="font-label text-label tabular-nums text-accent">{unlocked}/{list.length}</span></div>
          <div className="grid grid-cols-2 gap-space-4 p-space-6 sm:grid-cols-3">
            {list.map((b) => b.isUnlocked ? (
              <div key={b.name} className="flex aspect-square flex-col items-center justify-center gap-space-2 rounded-r2 border border-line bg-field p-space-4">
                <Icon name={badgeIcon(b.icon)} size={32} fill={1} className="text-accent" /><span className="text-center font-label text-label text-fg">{b.name}</span>
              </div>
            ) : (
              <div key={b.name} className="group relative flex aspect-square flex-col items-center justify-center gap-space-2 rounded-r2 border border-line bg-strong p-space-4 opacity-40">
                <div className="absolute inset-0 z-10 flex items-center justify-center"><Icon name="lock" className="text-fg" /></div>
                <Icon name={badgeIcon(b.icon)} size={32} className="text-fg-3 transition-all group-hover:blur-xs" /><span className="text-center font-label text-label text-fg-2">{b.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-space-4">
        <h3 className="mb-space-4 font-heading-md text-heading-md text-fg">{t('rewards.catalog')}</h3>
        {!rewardsLoading && (rewards ?? []).length === 0 && <EmptyState title={t('rewards.noRewards')} subtitle={t('rewards.noRewardsSub')} />}
        <div className="grid grid-cols-1 gap-space-6 md:grid-cols-3">
          {(rewards ?? []).map((r) => {
            const v = rewardVisual(r);
            const can = points >= r.pointsCost && r.isActive !== false;
            return (
              <Card key={r.id} stripe={can ? 'accent' : 'line'} interactive={can} className={cx('flex h-full flex-col p-space-5', !can && 'opacity-80 grayscale-[20%]')}>
                <div className="mb-space-4 flex items-start justify-between">
                  <div className={cx('rounded-r2 p-space-2', can ? 'bg-accent-subtle text-accent' : 'bg-strong text-fg-3')}><Icon name={v.icon} /></div>
                  <span className={cx('rounded-r2 px-2 py-1 font-label text-label tabular-nums', can ? 'bg-strong text-fg-2' : 'bg-danger-subtle text-danger')}>{formatNumber(r.pointsCost)} {t('units.pointsShort')}</span>
                </div>
                <h4 className="mb-space-2 font-heading-md text-heading-md text-fg">{r.title}</h4>
                <p className="mb-space-6 flex-1 font-body-md text-body-md text-fg-2">{r.subtitle}</p>
                {can ? (
                  <button type="button" disabled={redeem.isPending} onClick={() => redeem.mutate(r.id)} className="flex w-full items-center justify-center gap-space-2 rounded-r2 bg-accent py-space-3 font-label text-label text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50">{t('rewards.use')}</button>
                ) : (
                  <button type="button" disabled className="flex w-full cursor-not-allowed items-center justify-center gap-space-2 rounded-r2 border border-line-strong bg-transparent py-space-3 font-label text-label text-fg-3"><Icon name="lock" size={16} />{t('rewards.insufficient')}</button>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
};
export default RewardsPage;
