import { initials } from '@shared/format';
import { cx } from './cx';

export function Avatar({ name, src, size = 32, tone = 'strong', className }) {
  const tones = { strong: 'bg-strong text-fg-2', accent: 'bg-accent text-on-accent' };
  return (
    <div style={{ width: size, height: size }} className={cx('flex shrink-0 items-center justify-center overflow-hidden rounded-r12 font-label text-label', tones[tone], className)}>
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <span style={{ fontSize: Math.max(10, size / 3) }}>{initials(name)}</span>}
    </div>
  );
}
export default Avatar;
