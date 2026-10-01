import { Icon } from './Icon';
import { cx } from './cx';

const TONES = { muted: 'bg-muted', strong: 'bg-strong', subtle: 'bg-subtle', field: 'bg-field', accent: 'bg-accent-subtle', sell: 'bg-sell-tint', repair: 'bg-repair-tint', container: 'bg-accent-container' };
const COLORS = { fg: 'text-fg', fg2: 'text-fg-2', fg3: 'text-fg-3', accent: 'text-accent', repair: 'text-repair', sell: 'text-sell', danger: 'text-danger' };
const RADII = { r2: 'rounded-r2', r4: 'rounded-r4', r12: 'rounded-r12' };

export function IconBox({ name, size = 40, iconSize = 24, tone = 'muted', color = 'fg2', radius = 'r2', fill = 0, border = false, className }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cx('flex shrink-0 items-center justify-center', TONES[tone], COLORS[color], RADII[radius], border && 'border border-line', className)}
    >
      <Icon name={name} size={iconSize} fill={fill} />
    </div>
  );
}
export default IconBox;
