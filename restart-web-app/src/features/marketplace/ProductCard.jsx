import { Icon, cx } from '@components/ui';
import { resolveImageUrl } from '@shared/utils/resolveImageUrl';
import { formatCurrency, formatNumber } from '@shared/format';

const img = (p) => resolveImageUrl(p.images?.[0] ?? p.imageUrl);

/** Public marketplace card (W04). */
export function PublicProductCard({ product: p }) {
  return (
    <article className="group flex cursor-pointer flex-col overflow-hidden rounded-r4 border border-line bg-surface transition-colors hover:border-brand-400">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden border-b border-line bg-field p-space-4">
        <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-sell" />
        {img(p) ? <img src={img(p)} alt={p.title} className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal" /> : <Icon name="image" size={48} className="text-fg-3" />}
      </div>
      <div className="flex grow flex-col p-space-4">
        <h3 className="line-clamp-2 min-h-[3.25rem] font-heading-md text-heading-md text-fg">{p.title}</h3>
        <div className="mt-auto flex flex-col gap-space-2 pt-space-4">
          <span className="font-data-lg text-data-lg tracking-tight text-fg tabular-nums">{formatCurrency(p.price)}</span>
          <div className="mt-space-1 flex items-center justify-between border-t border-line pt-space-3 font-caption text-caption text-fg-3">
            <div className="flex items-center gap-1"><Icon name="star" fill={1} size={16} className="text-sell" /><span>{formatNumber(p.rating ?? 0, 1)}</span></div>
            {p.location && <div className="flex items-center gap-1"><Icon name="location_on" size={16} /><span>{p.location}</span></div>}
          </div>
        </div>
      </div>
    </article>
  );
}

/** In-app marketplace card (W05). */
export function MarketCard({ product: p }) {
  return (
    <div className="group flex cursor-pointer flex-col rounded-r4 border border-line bg-raised p-space-4 transition-colors hover:border-brand-400">
      <div className="mb-space-4 aspect-[4/3] overflow-hidden rounded-r6 bg-muted">
        {img(p) && <img src={img(p)} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />}
      </div>
      <div className="flex-1">
        <h4 className="mb-1 line-clamp-2 font-heading-md text-[14px] text-fg">{p.title}</h4>
        {p.description && <p className="font-caption text-caption text-fg-2">{p.description}</p>}
      </div>
      <div className="mt-space-4 flex items-center justify-between border-t border-line pt-space-2">
        <span className="font-data-lg text-[18px] text-fg tabular-nums">{formatCurrency(p.price)}</span>
        <Icon name="favorite" size={18} className="text-fg-faint" />
      </div>
    </div>
  );
}

/** "İlanlarım" card (W05). */
export function ListingCard({ listing: l, labels }) {
  const sold = l.status === 'sold';
  return (
    <div className={cx('group relative flex flex-col overflow-hidden rounded-r4 border border-line bg-raised p-space-4', sold && 'opacity-75')}>
      <div className={cx('absolute right-4 top-4 z-10 rounded-r4 px-2 py-1 font-label text-[10px]', sold ? 'bg-strong text-fg-2' : 'border border-accent bg-accent-subtle text-on-accent-subtle')}>
        {sold ? labels.sold : labels.active}
      </div>
      <div className="mb-space-4 h-32 overflow-hidden rounded-r6 bg-muted">
        {img(l) && <img src={img(l)} alt={l.title} className={cx('h-full w-full object-cover transition-transform duration-300 group-hover:scale-105', sold && 'grayscale')} />}
      </div>
      <div className="flex-1">
        <h4 className={cx('truncate font-heading-md text-[16px] text-fg', sold && 'line-through')}>{l.title}</h4>
        {l.description && <p className="mt-1 font-caption text-caption text-fg-2">{l.description}</p>}
      </div>
      <div className="mt-space-4 flex items-end justify-between">
        <span className={cx('font-data-lg text-[20px] tabular-nums', sold ? 'text-fg-2' : 'text-fg')}>{formatCurrency(l.price)}</span>
      </div>
    </div>
  );
}
