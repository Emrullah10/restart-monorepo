import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon, Card, Avatar } from '@components/ui';
import { useAuthStore } from '@store/authStore';
import { useProfile } from '@hooks/queries/useProfile';
import { useActivities } from '@hooks/queries/useActivities';
import { moduleOf } from '@shared/modules';
import { formatNumber, formatCurrency, formatDate, formatMonthYear, formatPercent } from '@shared/format';

const tile = { recycle: 'bg-accent-container-dim text-[#002115] dark:bg-accent-subtle dark:text-accent', sell: 'bg-[#FFB68C] text-[#321200] dark:bg-sell-tint dark:text-sell', repair: 'bg-repair-tint text-repair', reward: 'bg-strong text-fg-2' };

export const ProfilePage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile(user?.id);
  const { data: acts } = useActivities(user?.id, 100);
  const stats = profile?.stats;
  const all = acts ?? [];
  const count = (type) => all.filter((a) => a.activityType === type).length;
  const total = Math.max(1, count('recycle') + count('sell') + count('repair'));
  const bars = [['recycle', 'bg-accent-strong'], ['sell', 'bg-sell'], ['repair', 'bg-repair']];
  const created = profile?.user?.createdAt;

  return (
    <main className="mx-auto max-w-[1180px] p-space-6 pb-32 md:p-space-8 md:pb-space-8">
      <Card tone="subtle" stripe="accent" radius="r8" className="mb-space-12 flex flex-col items-center gap-space-6 p-space-6 md:flex-row md:items-start">
        <Avatar name={user?.fullName} src={user?.avatarUrl} size={72} tone="accent" className="font-display-lg text-display-lg" />
        <div className="flex-1 text-center md:text-left">
          <div className="mb-1 flex flex-col items-center gap-space-3 md:flex-row">
            <h2 className="font-display-lg-mobile text-display-lg-mobile text-fg md:font-display-lg md:text-display-lg">{user?.fullName}</h2>
            <span className="mt-2 inline-flex items-center rounded-r2 border border-line-strong bg-strong px-2 py-1 font-label text-label text-fg-2 md:mt-0"><Icon name="verified" size={14} className="mr-1" />{t('profile.verified')}</span>
          </div>
          <p className="font-caption text-caption text-fg-2">{[created && `${t('profile.joined')}: ${formatMonthYear(created)}`, user?.id && `ID: ${String(user.id).slice(0, 6).toUpperCase()}`].filter(Boolean).join(' • ')}</p>
        </div>
      </Card>

      <section className="mb-space-12 grid grid-cols-2 gap-space-4 md:grid-cols-4">
        {[
          ['accent', t('profile.saving'), formatNumber(stats?.co2Saved ?? 0, 1), `${t('units.kg')} CO₂`],
          ['tangerine', t('profile.points'), formatNumber(stats?.totalPoints ?? 0)],
          ['accent', t('profile.actions'), formatNumber(all.length)],
          ['copper', t('profile.earnings'), formatCurrency(stats?.totalEarnings ?? 0)],
        ].map(([stripe, label, value, unit], i) => (
          <Card key={i} tone="raised" stripe={stripe} radius="r8" className="flex h-[120px] flex-col justify-between p-space-6">
            <p className="font-label text-label uppercase text-fg-2">{label}</p>
            <div className="font-data-lg text-data-lg tabular-nums text-fg md:font-data-xl md:text-data-xl">{value}{unit && <span className="ml-1 font-heading-md text-heading-md text-fg-3">{unit}</span>}</div>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-space-6 lg:grid-cols-2">
        <Card tone="subtle" radius="r8" className="p-space-6">
          <h3 className="mb-space-6 font-heading-md text-heading-md uppercase text-fg">{t('profile.impactCard')}</h3>
          <div className="space-y-space-5">
            {bars.map(([k, color]) => {
              const pct = Math.round((count(k) / total) * 100);
              return (
                <div key={k}>
                  <div className="mb-2 flex justify-between"><span className="font-label text-label uppercase text-fg-2">{t(`profile.modules.${k}`)}</span><span className="font-label text-label tabular-nums text-fg">{formatPercent(pct)}</span></div>
                  <div className="h-2 w-full overflow-hidden rounded-r2 bg-strong"><div className={`h-full rounded-r2 ${color}`} style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card tone="raised" radius="r8" className="p-space-6">
          <h3 className="mb-space-6 font-heading-md text-heading-md uppercase text-fg">{t('profile.history')}</h3>
          <div className="flex flex-col border-t border-line">
            {all.length === 0 && <p className="py-space-4 font-caption text-caption text-fg-2">{t('home.noActivity')}</p>}
            {all.slice(0, 6).map((a, i) => {
              const m = moduleOf(a.activityType);
              const right = a.pointsEarned > 0 ? [`+${formatNumber(a.pointsEarned)} ${t('units.points')}`, 'text-accent-strong'] : a.amountEarned > 0 ? [`+${formatCurrency(a.amountEarned)}`, 'text-sell'] : [a.description || '', 'text-fg-2'];
              return (
                <div key={a.id ?? i} className="flex items-center justify-between border-b border-line py-space-4">
                  <div className="flex items-center gap-space-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-r2 ${tile[a.activityType] ?? tile.reward}`}><Icon name={m.icon} size={16} /></div>
                    <div><p className="font-label text-label uppercase text-fg">{a.title}</p><p className="font-caption text-caption text-fg-2">{formatDate(a.createdAt)}</p></div>
                  </div>
                  <span className={`font-label text-label tabular-nums ${right[1]}`}>{right[0]}</span>
                </div>
              );
            })}
          </div>
          {all.length > 6 && <Link to="/notifications" className="mt-space-4 inline-block font-label text-label text-accent hover:underline">{t('home.all')}</Link>}
        </Card>
      </div>
    </main>
  );
};
export default ProfilePage;
