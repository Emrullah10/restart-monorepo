import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon, Button, Skeleton, EmptyState, cx } from '@components/ui';
import { MarketCard, ListingCard } from '@features/marketplace/ProductCard';
import { MARKETPLACE_CATEGORIES } from '@features/marketplace/constants';
import { useAuthStore } from '@store/authStore';
import { useProducts, useUserListings } from '@hooks/queries/useMarketplace';
import { useDebouncedValue } from '@hooks/useDebouncedValue';

export const SellPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.user?.id);
  const [active, setActive] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('new');
  const debounced = useDebouncedValue(q, 300);
  const { data: products, isLoading } = useProducts({ category: active === 'all' ? undefined : active, q: debounced || undefined });
  const { data: mine } = useUserListings(userId);

  const sorted = [...(products ?? [])].sort((a, b) => (sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : new Date(b.createdAt) - new Date(a.createdAt)));

  return (
    <div className="bg-canvas p-space-6 md:p-space-10">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-space-10">
        <div className="flex flex-col items-start justify-between gap-space-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display-lg text-display-lg text-fg">{t('market.title')}</h2>
            <p className="mt-2 max-w-2xl font-body-md text-body-md text-fg-2">{t('market.subtitle')}</p>
          </div>
          <Button icon="add" radius="r4" className="px-space-6 py-space-3" onClick={() => navigate('/create-listing')}>{t('market.createListing')}</Button>
        </div>

        <div className="flex items-start gap-space-4 rounded-r8 border border-l-[3px] border-line border-l-accent bg-muted p-space-6">
          <Icon name="shield" size={32} fill={1} className="mt-1 text-accent" />
          <div>
            <h3 className="mb-1 font-heading-md text-heading-md text-fg">{t('market.guaranteeTitle')}</h3>
            <p className="font-body-md text-body-md text-fg-2">{t('market.guaranteeBody')}</p>
          </div>
        </div>

        <div className="flex flex-col gap-space-4">
          <div className="relative w-full">
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('market.listingSearch')} className="h-[44px] w-full rounded-r4 border border-line bg-field-canvas pl-12 pr-4 font-body-md text-body-md text-fg placeholder:text-fg-3 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas" />
          </div>
          <div className="flex flex-wrap gap-space-2">
            {MARKETPLACE_CATEGORIES.map((c) => (
              <button key={c} type="button" onClick={() => setActive(c)} className={cx('rounded-r4 px-space-4 py-space-2 font-label text-label transition-colors', active === c ? 'border border-accent bg-accent-subtle text-on-accent-subtle' : 'border border-line bg-surface text-fg-2 hover:bg-muted')}>{t(`market.categories.${c}`)}</button>
            ))}
          </div>
        </div>

        {mine && mine.length > 0 && (
          <section>
            <div className="mb-space-6 flex items-end justify-between border-b border-line pb-space-2">
              <h3 className="font-heading-md text-heading-md text-fg">{t('market.myListings')}</h3>
              <Link to="/sell" className="font-label text-label text-accent hover:underline">{t('market.seeAll')}</Link>
            </div>
            <div className="grid grid-cols-1 gap-space-4 md:grid-cols-3">
              {mine.map((l) => <ListingCard key={l.id} listing={l} labels={{ active: t('market.statusActive'), sold: t('market.statusSold') }} />)}
            </div>
          </section>
        )}

        <section>
          <div className="mb-space-6 flex items-end justify-between border-b border-line pb-space-2">
            <h3 className="font-heading-md text-heading-md text-fg">{t('market.allListings')}</h3>
            <div className="flex items-center gap-2">
              <span className="font-label text-label text-fg-2">{t('market.sortBy')}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="cursor-pointer border-none bg-transparent font-label text-label text-fg focus:outline-none">
                <option value="new">{t('market.sortNew')}</option>
                <option value="asc">{t('market.sortAsc')}</option>
                <option value="desc">{t('market.sortDesc')}</option>
              </select>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-space-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64" />)}</div>
          ) : sorted.length === 0 ? (
            <EmptyState title={t('market.emptyTitle')} subtitle={t('market.emptyApp')} />
          ) : (
            <div className="grid grid-cols-1 gap-space-4 sm:grid-cols-2 lg:grid-cols-4">{sorted.map((p) => <MarketCard key={p.id} product={p} />)}</div>
          )}
        </section>
      </div>
    </div>
  );
};
export default SellPage;
