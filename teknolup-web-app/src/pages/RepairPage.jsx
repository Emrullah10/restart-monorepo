import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon, Card, SectionHeader, cx } from '@components/ui';
import { useServices } from '@hooks/queries/useServices';
import { useUserLocation } from '@hooks/useUserLocation';
import { distanceKm } from '@shared/geo';
import { formatNumber } from '@shared/format';

const SERVICES = [
  { key: 'screen', icon: 'build' },
  { key: 'battery', icon: 'battery_charging_full' },
  { key: 'board', icon: 'memory' },
];

export const RepairPage = () => {
  const { t } = useTranslation();
  const here = useUserLocation();
  const [selected, setSelected] = useState(null);
  const { data } = useServices('repair');
  const list = data ?? [];
  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-space-8 p-space-6">
      <div className="flex flex-col items-start justify-between gap-space-6 md:flex-row md:items-end">
        <div>
          <h2 className="mb-2 font-display-lg text-display-lg text-fg">{t('repair.title')}</h2>
          <p className="font-body-md text-body-md text-fg-2">{t('repair.subtitle')}</p>
        </div>
        <Card tone="accent" stripe="accent" className="flex min-w-[260px] items-center gap-space-4 border-brand-400/30 p-space-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-r12 bg-muted text-accent"><Icon name="eco" fill={1} /></div>
          <div>
            <p className="font-label text-label uppercase text-on-accent-subtle">{t('repair.impact')}</p>
            <p className="font-data-lg text-data-lg tabular-nums text-accent">~55 {t('units.kg')} <span className="font-heading-md text-heading-md opacity-70">{t('repair.co2Saved')}</span></p>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="mb-space-4 font-label text-label uppercase tracking-wider text-fg-2">{t('repair.primary')}</h3>
        <div className="grid grid-cols-1 gap-space-4 md:grid-cols-3">
          {SERVICES.map((s) => (
            <Card key={s.key} as="button" type="button" tone="raised" stripe="repair" onClick={() => setSelected(selected === s.key ? null : s.key)} className={cx('flex cursor-pointer flex-col items-start p-space-6 text-left transition-colors hover:border-repair/50', selected === s.key && 'border-repair')}>
              <div className="mb-space-4 flex h-12 w-12 items-center justify-center rounded-r2 border border-line bg-field text-repair"><Icon name={s.icon} fill={1} /></div>
              <h4 className="mb-1 font-heading-lg text-heading-md text-fg">{t(`repair.services.${s.key}.title`)}</h4>
              <p className="mb-space-4 font-body-md text-body-md text-fg-2">{t(`repair.services.${s.key}.desc`)}</p>
              <span className="mt-auto font-label text-label text-repair">{t('repair.select')} →</span>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title={t('repair.nearby')} to="/map?filter=repair" linkLabel={t('repair.viewOnMap')} className="mb-space-4" />
        <div className="flex flex-col gap-3">
          {list.map((s) => {
            const km = distanceKm(here, s);
            return (
              <Card key={s.id} tone="raised" className="flex flex-col items-start justify-between gap-space-4 p-space-4 md:flex-row md:items-center">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading-lg text-heading-md text-fg">{s.name}</h4>
                    {s.rating > 0 && <span className="flex items-center gap-1 rounded-r2 border border-line bg-field px-2 py-0.5 font-label text-[10px] text-fg-2"><Icon name="star" fill={1} size={12} className="text-sell" />{formatNumber(s.rating, 1)}</span>}
                  </div>
                  <p className="font-caption text-caption tabular-nums text-fg-2">{[km != null && `${formatNumber(km, 1)} ${t('units.km')}`, s.address].filter(Boolean).join(' • ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  {(s.tags ?? []).map((tag) => <span key={tag} className="rounded-r2 border border-line bg-field px-2 py-1 font-label text-[10px] text-fg-2">{tag}</span>)}
                  <Link to="/map?filter=repair" className="ml-2 rounded-r2 border border-line bg-surface px-4 py-2 font-label text-label text-fg transition-colors hover:bg-field">{t('repair.details')}</Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default RepairPage;
