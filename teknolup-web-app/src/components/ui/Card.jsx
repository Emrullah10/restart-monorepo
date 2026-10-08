import { cx } from './cx';

const TONES = { surface: 'bg-surface', raised: 'bg-raised', subtle: 'bg-subtle', muted: 'bg-muted', field: 'bg-field', accent: 'bg-accent-subtle' };
const STRIPES = {
  accent: 'border-l-[3px] border-l-accent', repair: 'border-l-[3px] border-l-repair', sell: 'border-l-[3px] border-l-sell',
  brand: 'border-l-[3px] border-l-brand-400', line: 'border-l-[3px] border-l-line-strong', copper: 'border-l-[3px] border-l-copper-500', tangerine: 'border-l-[3px] border-l-tangerine',
};
const RADII = { r2: 'rounded-r2', r4: 'rounded-r4', r8: 'rounded-r8' };

/** Border-first card with optional 3px identity stripe (module colour). */
export function Card({ as: Tag = 'div', tone = 'surface', radius = 'r4', stripe, interactive = false, className, ...rest }) {
  return (
    <Tag
      className={cx('border border-line', TONES[tone], RADII[radius], stripe && STRIPES[stripe], interactive && 'transition-colors hover:bg-hover', className)}
      {...rest}
    />
  );
}
export default Card;
