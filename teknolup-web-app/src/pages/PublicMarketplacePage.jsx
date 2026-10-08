import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon, Skeleton, EmptyState, cx } from '@components/ui';
import { PublicProductCard } from '@features/marketplace/ProductCard';
import { MARKETPLACE_CATEGORIES } from '@features/marketplace/constants';
import { useProducts } from '@hooks/queries/useMarketplace';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { formatNumber } from '@shared/format';
import { PLATFORM_STATS } from '@shared/config';

export const PublicMarketplacePage = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('all');
  const [q, setQ] = useState('');
  const debounced = useDebouncedValue(q, 300);
  const { data: products, isLoading } = useProducts({ category: active === 'all' ? undefined : active, q: debounced || undefined });
  const list = products ?? [];

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1180px] grow flex-col gap-space-12 px-space-5 py-space-12 md:px-space-6">
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-space-6 text-center">
          <h1 className="font-display-lg-mobile text-display-lg-mobile leading-tight tracking-tight text-fg md:font-display-lg md:text-display-lg">{t('market.heroTitle')}</h1>
          <p className="font-heading-md text-heading-md text-fg-3">{t('market.heroSub')}</p>
          <div className="mt-space-4 flex w-full max-w-2xl flex-col items-center gap-space-2">
            <div className="relative flex h-[52px] w-full">
              <Icon name="search" className="pointer-events-none absolute inset-y-0 left-space-4 my-auto text-fg-3" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('market.searchPlaceholder')} className="h-full w-full rounded-l-r6 border border-line bg-field-canvas pl-12 pr-4 font-body-md text-body-md text-fg placeholder:text-fg-3 transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
              <button type="button" className="flex h-full items-center justify-center rounded-r-r6 bg-accent px-space-6 font-label text-label text-on-accent transition-colors hover:bg-accent-hover">{t('market.searchButton')}</button>
            </div>
            <div className="mt-space-2 flex items-center gap-space-2 font-caption text-caption text-fg-3">
              <Icon name="query_stats" size={14} />
              <span>{t('market.stats', { listings: formatNumber(list.length), kg: formatNumber(PLATFORM_STATS.recycledKg) })}</span>
            </div>
          </div>
        </section>

        <section className="relative w-full">
          <div className="no-scrollbar flex gap-space-3 overflow-x-auto border-b border-line pb-space-2">
            {MARKETPLACE_CATEGORIES.map((c) => (
              <button key={c} type="button" onClick={() => setActive(c)} className={cx('whitespace-nowrap rounded-r2 px-space-5 py-space-2 font-label text-label transition-colors', active === c ? 'border-2 border-accent bg-accent-subtle text-accent' : 'border border-line bg-surface text-fg-2 hover:bg-field')}>
                {t(`market.categories.${c}`)}
              </button>
            ))}
          </div>
        </section>

        {isLoading ? (
          <section className="grid grid-cols-1 gap-space-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72" />)}</section>
        ) : list.length === 0 ? (
          <EmptyState title={t('market.emptyTitle')} subtitle={t('market.emptyPublic')} />
        ) : (
          <section className="grid grid-cols-1 gap-space-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => <PublicProductCard key={p.id} product={p} />)}
          </section>
        )}
      </div>

      <section className="mt-space-12 w-full border-t border-brand-line bg-brand-900">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-space-8 px-space-6 py-space-16 md:flex-row">
          <div className="flex max-w-xl flex-col gap-space-4">
            <h2 className="font-display-lg-mobile text-display-lg-mobile tracking-tight text-on-brand md:font-display-lg md:text-display-lg">{t('market.ctaTitle')}</h2>
            <p className="font-body-md text-body-md text-brand-400">{t('market.ctaBody')}</p>
          </div>
          <Link to="/register" className="group flex shrink-0 items-center gap-space-2 rounded-r2 border border-transparent bg-brand-600 px-space-8 py-space-4 font-label text-label text-on-brand transition-colors hover:border-on-brand hover:bg-brand-400">
            {t('auth.registerLink')}
            <Icon name="arrow_right_alt" size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
};
export default PublicMarketplacePage;
