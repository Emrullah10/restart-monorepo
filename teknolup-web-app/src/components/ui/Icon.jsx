import { ICON_NAMES } from '@shared/iconNames';

const KNOWN = new Set(ICON_NAMES);

/** Material Symbols Outlined. `fill` 0|1, `weight` 400|700. Colour follows currentColor. */
export function Icon({ name, fill = 0, weight = 400, size = 24, className = '', style, ...rest }) {
  if (import.meta.env.DEV && !KNOWN.has(name)) console.error(`[Icon] "${name}" is not in iconNames.js — add it and run npm run icons`);
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  );
}
export default Icon;
