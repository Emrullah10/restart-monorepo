import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@store/authStore';
import { useProfile } from '@hooks/queries/useProfile';
import { useActivities } from '@hooks/queries/useActivities';
import { useServices } from '@hooks/queries/useServices';
import { Icon, Card, IconBox, StatTile, SectionHeader, cx } from '@components/ui';
import { moduleOf } from '@shared/modules';
import { computeLevel } from '@shared/level';
import { formatNumber, formatCurrency, formatRelative } from '@shared/format';

const ACTIONS = [
  { to: '/repair', module: 'repair', key: 'repair' },
  { to: '/sell', module: 'sell', key: 'sell' },
  { to: '/recycle', module: 'recycle', key: 'recycle' },
];

function activityRight(a, t) {
  if (a.pointsEarned > 0) return { text: t('activity.pointsGain', { points: formatNumber(a.pointsEarned) }), accent: true };
  if (a.amountEarned > 0) return { text: t('activity.amountGain', { amount: formatCurrency(a.amountEarned) }), accent: false };
  return { text: a.description || t('activity.completed'), accent: false };
}

export const HomePage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile(user?.id);
  const { data: activities } = useActivities(user?.id, 3);
  const { data: services } = useServices();

  const stats = profile?.stats;
  const lvl = computeLevel(stats?.totalPoints);
  const firstName = (user?.fullName || '').split(' ')[0] || t('shell.user');

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-space-10 px-space-6 py-space-8 md:pb-space-12">
      <section className="flex flex-col gap-space-2">
        <h2 className="font-heading-lg text-heading-lg text-fg">{t('home.greeting', { name: firstName })}</h2>
        <p className="font-body-md text-body-md text-fg-2">{t('home.subtitle')}</p>
      </section>

      <section className="flex w-full flex-col items-start justify-between gap-space-6 rounded-r4 border border-brand-400 bg-accent-subtle p-space-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-space-2 text-on-accent-subtle">
          <span className="font-label text-label uppercase tracking-widest">{t('home.impactLabel')}</span>
          <div className="flex items-baseline gap-space-2">
            <span className="font-data-xl text-data-xl tabular-nums">{formatNumber(stats?.co2Saved ?? 0, 1)}</span>
            <span className="font-heading-md text-heading-md">{t('units.kg')}</span>
          </div>
          <span className="font-label text-label uppercase tracking-widest">{t('home.impactSub')}</span>
        </div>
        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-r2 bg-strong opacity-80 md:h-24 md:w-48">
          <svg className="absolute inset-0 h-full w-full text-line-strong opacity-20" aria-hidden="true">
            <defs><pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="1" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <Icon name="eco" size={48} className="text-fg-3" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-space-4 md:grid-cols-3">
        {ACTIONS.map(({ to, module, key }) => {
          const m = moduleOf(module);
          return (
            <Card key={to} as={Link} to={to} stripe={module === 'recycle' ? 'brand' : module} interactive className="group flex flex-col gap-space-4 p-space-5">
              <IconBox name={m.icon} tone="muted" color={m.color} className="transition-transform group-hover:scale-110" />
              <div className="flex flex-col gap-space-1">
                <h3 className="font-heading-md text-heading-md text-fg">{t(`home.${key}`)}</h3>
                <p className="font-caption text-caption text-fg-2">{t(`home.${key}Sub`)}</p>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-2 gap-space-4 md:grid-cols-4">
        <StatTile label={t('home.statRepaired')} value={formatNumber(stats?.repairedCount ?? 0)} unit={t('units.count')} />
        <StatTile label={t('home.statWaste')} value={formatNumber(stats?.preventedWasteKg ?? 0)} unit={t('units.kg')} />
        <StatTile label={t('home.statEarnings')} value={formatNumber(stats?.totalEarnings ?? 0)} unit="₺" />
        <StatTile label={t('home.statLevel')} value={lvl.level} unit={t(`levels.${lvl.key}`)} accent />
      </section>

      <section className="grid grid-cols-1 gap-space-8 md:grid-cols-2">
        <div className="flex flex-col gap-space-4">
          <SectionHeader title={t('home.recentTitle')} to="/profile" linkLabel={t('home.all')} />
          <ul className="flex flex-col gap-space-2">
            {(activities ?? []).length === 0 && <li className="font-caption text-caption text-fg-2">{t('home.noActivity')}</li>}
            {(activities ?? []).map((a, i) => {
              const m = moduleOf(a.activityType);
              const right = activityRight(a, t);
              return (
                <li key={a.id ?? i} className="flex items-center justify-between rounded-r2 border border-line bg-surface p-space-3">
                  <div className="flex items-center gap-space-3">
                    <IconBox name={m.icon} size={32} iconSize={18} color={m.color} />
                    <div className="flex flex-col">
                      <span className="font-body-md text-body-md font-medium text-fg">{a.title}</span>
                      <span className="font-caption text-caption text-fg-2">{formatRelative(a.createdAt)}</span>
                    </div>
                  </div>
                  <span className={cx('font-label text-label tabular-nums', right.accent ? 'text-accent' : 'text-fg')}>{right.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-space-4">
          <SectionHeader title={t('home.nearbyTitle')} to="/map" linkLabel={t('home.toMap')} />
          <ul className="flex flex-col gap-space-2">
            {(services ?? []).length === 0 && <li className="font-caption text-caption text-fg-2">{t('home.noServices')}</li>}
            {(services ?? []).slice(0, 2).map((s) => {
              const m = moduleOf(s.type);
              return (
                <li key={s.id} className="flex items-start gap-space-3 rounded-r2 border border-line bg-surface p-space-3">
                  <IconBox name="location_on" size={32} iconSize={16} radius="r12" color={m.color} className="mt-1" />
                  <div className="flex flex-1 flex-col">
                    <span className="font-body-md text-body-md font-medium text-fg">{s.name}</span>
                    <span className="font-caption text-caption text-fg-2">{s.address}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
