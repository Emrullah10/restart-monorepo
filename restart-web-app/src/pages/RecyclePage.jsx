import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon, Card, cx } from '@components/ui';
import { useAuthStore } from '@store/authStore';
import { useServices } from '@hooks/queries/useServices';
import { useLogRecycle } from '@hooks/queries/useRecycle';
import { estimateRecyclePoints, co2ForWeight } from '@shared/recyclePoints';
import { formatNumber } from '@shared/format';

const DEVICES = [
  { id: 'phone', icon: 'smartphone' }, { id: 'laptop', icon: 'laptop_mac' },
  { id: 'tablet', icon: 'tablet_mac' }, { id: 'other', icon: 'devices_other' },
];
const CONDITIONS = [
  { id: 'working', icon: 'check_circle', color: 'text-accent' },
  { id: 'damaged', icon: 'build', color: 'text-sell' },
  { id: 'broken', icon: 'block', color: 'text-danger' },
];
const field = 'w-full rounded-r6 border border-line bg-field px-4 py-3 font-body-md text-body-md text-fg placeholder:text-fg-3 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface';
const lab = 'font-label text-label uppercase text-fg-2';

function Steps({ step }) {
  const { t } = useTranslation();
  const items = ['device', 'detail', 'confirm'];
  return (
    <div className="relative mb-space-4 flex w-full items-center justify-between">
      <div className="absolute left-0 top-1/2 z-0 h-px w-full -translate-y-1/2 bg-line" />
      {items.map((k, i) => {
        const n = i + 1; const done = n < step; const now = n === step;
        return (
          <div key={k} className="relative z-10 flex flex-col items-center gap-space-2 bg-canvas px-space-2">
            {done ? <div className="flex h-6 w-6 items-center justify-center rounded-r12 border-2 border-fg bg-fg text-canvas"><Icon name="check" size={14} weight={700} /></div>
              : now ? <div className="flex h-6 w-6 items-center justify-center rounded-r12 border-2 border-accent bg-canvas"><div className="h-2 w-2 rounded-r12 bg-accent" /></div>
              : <div className="flex h-6 w-6 items-center justify-center rounded-r12 border-2 border-line bg-canvas"><span className="font-label text-[10px] text-fg-2">{n}</span></div>}
            <span className={cx('font-label text-label uppercase', now ? 'font-bold text-accent' : done ? 'text-fg' : 'text-fg-2')}>{t(`recycle.steps.${k}`)}</span>
          </div>
        );
      })}
    </div>
  );
}

export const RecyclePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.user?.id);
  const [device, setDevice] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ model: '', condition: 'working', weightKg: '', serviceCenterId: '', delivery: 'courier' });
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const { data: centers } = useServices('recycle');
  const log = useLogRecycle();
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isElectric = form.delivery === 'courier';
  const weight = Number(form.weightKg) || 0;
  const est = estimateRecyclePoints({ weightKg: weight, isElectric });

  const submit = async (e) => {
    e.preventDefault(); setError(null);
    if (!userId) { setError(t('recycle.needLogin')); return; }
    if (!form.serviceCenterId) { setError(t('recycle.pickCenter')); return; }
    try {
      const res = await log.mutateAsync({ userId, serviceCenterId: form.serviceCenterId, wasteType: device, weightKg: weight || 1, isElectricTransport: isElectric });
      setResult(res); setStep(3);
    } catch (err) { setError(err.response?.data?.message ?? t('recycle.failed')); }
  };

  return (
    <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-space-8 p-space-6 md:p-space-8">
      <Steps step={step} />
      {step === 1 && (
        <section>
          <h2 className="mb-space-2 font-heading-lg text-heading-lg text-fg md:font-display-lg md:text-display-lg">{t('recycle.question')}</h2>
          <p className="mb-space-8 font-body-md text-body-md text-fg-2">{t('recycle.questionSub')}</p>
          <div className="grid grid-cols-2 gap-space-4 lg:grid-cols-4">
            {DEVICES.map((d) => (
              <Card key={d.id} as="button" type="button" tone="raised" onClick={() => { setDevice(d.id); setStep(2); }} className="group flex h-48 flex-col items-center justify-center p-space-6 text-center transition-colors hover:border-accent hover:bg-accent-subtle">
                <Icon name={d.icon} size={36} className="mb-space-4 text-fg-2 transition-transform group-hover:scale-110 group-hover:text-accent" />
                <h3 className="mb-space-1 font-heading-md text-heading-md text-fg">{t(`recycle.devices.${d.id}.title`)}</h3>
                <p className="font-caption text-caption text-fg-2">{t(`recycle.devices.${d.id}.sub`)}</p>
              </Card>
            ))}
          </div>
        </section>
      )}
      {step === 2 && (
        <form onSubmit={submit} className="grid grid-cols-1 items-start gap-space-6 lg:grid-cols-3">
          <div className="flex flex-col gap-space-6 lg:col-span-2">
            <Card tone="raised" stripe="accent" className="p-space-6">
              <h3 className="mb-space-6 font-heading-md text-heading-md text-fg">{t('recycle.detailsTitle')}</h3>
              <div className="flex flex-col gap-space-6">
                <div className="flex flex-col gap-space-2"><label htmlFor="model" className={lab}>{t('recycle.brandModel')}</label><input id="model" value={form.model} onChange={set('model')} placeholder={t('recycle.brandModelPh')} className={field} /></div>
                <div className="flex flex-col gap-space-2">
                  <span className={cx(lab, 'mb-1')}>{t('recycle.condition')}</span>
                  <div className="grid grid-cols-1 gap-space-3 md:grid-cols-3">
                    {CONDITIONS.map((c) => (
                      <label key={c.id} className="cursor-pointer">
                        <input type="radio" name="condition" value={c.id} checked={form.condition === c.id} onChange={set('condition')} className="peer sr-only" />
                        <div className="flex h-full flex-col gap-2 rounded-r4 border border-line p-4 transition-colors hover:border-brand-400 peer-checked:border-accent peer-checked:bg-accent-subtle peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                          <Icon name={c.icon} className={c.color} /><span className="font-label text-label uppercase text-fg">{t(`recycle.conditions.${c.id}`)}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-space-4 md:grid-cols-2">
                  <div className="flex flex-col gap-space-2"><label htmlFor="weight" className={lab}>{t('recycle.weight')}</label><input id="weight" type="number" min="0" step="0.1" value={form.weightKg} onChange={set('weightKg')} placeholder="0,0" className={field} /></div>
                  <div className="flex flex-col gap-space-2"><label htmlFor="center" className={lab}>{t('recycle.center')}</label>
                    <div className="relative"><select id="center" value={form.serviceCenterId} onChange={set('serviceCenterId')} className={cx(field, 'appearance-none pr-10')}><option value="">{t('recycle.centerPh')}</option>{(centers ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><Icon name="expand_more" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg-2" /></div>
                  </div>
                </div>
              </div>
            </Card>
            <Card tone="raised" stripe="accent" className="p-space-6">
              <h3 className="mb-space-4 font-heading-md text-heading-md text-fg">{t('recycle.delivery')}</h3>
              <div className="grid grid-cols-1 gap-space-4 md:grid-cols-2">
                {[['courier', 'local_shipping', 'bg-accent-container text-on-accent-container'], ['dropoff', 'location_on', 'bg-strong text-fg-2']].map(([id, ic, tone]) => (
                  <label key={id} className="cursor-pointer">
                    <input type="radio" name="delivery" value={id} checked={form.delivery === id} onChange={set('delivery')} className="peer sr-only" />
                    <div className="flex h-full items-start gap-4 rounded-r4 border border-line p-5 transition-colors hover:border-brand-400 peer-checked:border-accent peer-checked:bg-accent-subtle peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                      <div className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-r12', tone)}><Icon name={ic} /></div>
                      <div className="flex flex-col"><span className="mb-1 font-label text-label uppercase text-fg">{t(`recycle.deliveries.${id}.title`)}</span><span className="font-caption text-caption text-fg-2">{t(`recycle.deliveries.${id}.desc`)}</span></div>
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          </div>
          <div className="flex flex-col gap-space-6">
            <div className="relative flex flex-col gap-space-4 overflow-hidden rounded-r4 border border-[#1E2724] bg-brand-900 p-space-6 text-white">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-r12 border border-brand-600/30" />
              <div className="relative z-10 mb-2 flex items-center gap-2"><Icon name="eco" className="text-brand-400" /><span className="font-label text-label uppercase tracking-wider text-brand-400">{t('recycle.estimate')}</span></div>
              <div className="relative z-10 flex flex-col"><span className="font-data-xl text-data-xl text-[#B2F0D2]">+{formatNumber(est.total)} {t('units.points').toUpperCase()}</span><span className="mt-2 font-caption text-caption text-[#BFC9C2]">{t('recycle.formula')}</span></div>
              <div className="relative z-10 my-2 h-px w-full bg-brand-600/30" />
              <ul className="relative z-10 flex flex-col gap-2 font-caption text-caption text-[#BFC9C2]">
                <li className="flex justify-between"><span>{t('recycle.base')}</span><span className="text-white">{formatNumber(est.base)}</span></li>
                {isElectric && <li className="flex justify-between"><span>{t('recycle.bonus')}</span><span className="text-white">+{formatNumber(est.bonus)}</span></li>}
                <li className="flex justify-between"><span>{t('recycle.co2')}</span><span className="text-white">{formatNumber(co2ForWeight(weight), 2)} {t('units.kg')}</span></li>
              </ul>
            </div>
            {error && <p role="alert" className="font-caption text-caption text-danger">{error}</p>}
            <button type="submit" disabled={log.isPending} className="flex w-full items-center justify-center gap-2 rounded-r6 border border-transparent bg-accent py-4 font-label text-label uppercase text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50"><span>{log.isPending ? t('common.loading') : t('recycle.submit')}</span><Icon name="arrow_forward" size={18} /></button>
            <p className="px-4 text-center font-caption text-caption text-fg-2">{t('recycle.terms')}</p>
          </div>
        </form>
      )}
      {step === 3 && (
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-space-8 py-space-8 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-r12 border border-accent bg-accent-container"><Icon name="check_circle" size={48} fill={1} className="text-accent" /></div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-fg">{t('recycle.successTitle')}</h1>
          <Card tone="raised" stripe="accent" className="flex w-full flex-col items-center gap-space-3 p-space-6">
            <span className="font-label text-label uppercase tracking-wider text-fg-2">{t('recycle.earned')}</span>
            <div className="flex items-baseline gap-space-2"><span className="font-data-xl text-data-xl text-accent">+{formatNumber(result?.totalPoints ?? est.total)}</span><span className="font-label text-label text-accent">{t('units.points').toUpperCase()}</span></div>
            <hr className="my-space-2 w-full border-t border-line" />
            <div className="flex items-center gap-space-2 text-fg-2"><Icon name="co2" size={20} /><span className="font-body-md text-body-md">{t('recycle.co2Saved', { kg: formatNumber(co2ForWeight(weight || 1), 2) })}</span></div>
          </Card>
          <button type="button" onClick={() => navigate('/')} className="flex h-12 w-full items-center justify-center rounded-r4 bg-accent font-label text-label uppercase tracking-widest text-on-accent transition-colors hover:bg-accent-hover">{t('recycle.backHome')}</button>
        </div>
      )}
    </main>
  );
};
export default RecyclePage;
