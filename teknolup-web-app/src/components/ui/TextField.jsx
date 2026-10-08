import { useState, useId } from 'react';
import { Icon } from './Icon';
import { cx } from './cx';

const RADII = { r2: 'rounded-r2', r4: 'rounded-r4', r6: 'rounded-r6' };

/**
 * Labelled input. `height` is a tailwind class (h-12, h-[52px] …); omit for padding-based (py-3) inputs.
 * `password` adds the show/hide toggle. `icon` renders a leading Material Symbol.
 */
export function TextField({
  label, upperLabel = false, labelClass = 'text-fg-2', icon, password = false, error, hint,
  radius = 'r4', height, bg = 'bg-field-canvas', ring = 'halo', className, inputClassName, id, ...rest
}) {
  const auto = useId();
  const fid = id ?? auto;
  const [shown, setShown] = useState(false);
  const focus = ring === 'halo'
    ? 'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas'
    : 'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent';
  return (
    <div className={cx('flex flex-col gap-space-2', className)}>
      {label && <label htmlFor={fid} className={cx('font-label text-label', upperLabel && 'uppercase', labelClass)}>{label}</label>}
      <div className="relative flex items-center">
        {icon && <Icon name={icon} size={20} className="pointer-events-none absolute left-3 text-fg-3" />}
        <input
          id={fid}
          type={password ? (shown ? 'text' : 'password') : rest.type}
          className={cx(
            'block w-full appearance-none border font-body-md text-body-md text-fg placeholder:text-fg-3 transition-shadow',
            bg, RADII[radius], height ?? 'py-space-3', 'px-space-4', icon && 'pl-[44px]', password && 'pr-[44px]',
            error ? 'border-danger' : 'border-line', focus, inputClassName,
          )}
          {...rest}
        />
        {password && (
          <button type="button" aria-label="toggle password" onClick={() => setShown((v) => !v)} className="absolute right-3 text-fg-3 transition-colors hover:text-fg">
            <Icon name={shown ? 'visibility_off' : 'visibility'} size={20} />
          </button>
        )}
      </div>
      {error ? <p className="font-caption text-caption text-danger">{error}</p> : hint}
    </div>
  );
}
export default TextField;
