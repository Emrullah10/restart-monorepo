import { Icon } from './Icon';
import { cx } from './cx';

const VARIANTS = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'bg-strong text-fg hover:bg-hover',
  outline: 'bg-surface border border-line text-fg hover:bg-subtle',
  inverse: 'bg-inverse text-on-inverse hover:opacity-90',
  danger: 'bg-danger text-white hover:opacity-90',
  brand: 'bg-brand-600 text-on-brand hover:bg-brand-400',
};
const RADII = { r2: 'rounded-r2', r4: 'rounded-r4', r6: 'rounded-r6' };

export function Button({ as: Tag = 'button', variant = 'primary', radius = 'r4', icon, iconRight, upper = false, full = false, className, children, ...rest }) {
  return (
    <Tag
      className={cx(
        'inline-flex items-center justify-center gap-space-2 font-label text-label transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant], RADII[radius], upper && 'uppercase', full && 'w-full', className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={18} />}
    </Tag>
  );
}
export default Button;
