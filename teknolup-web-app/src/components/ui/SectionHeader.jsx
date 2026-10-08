import { Link } from 'react-router-dom';
import { cx } from './cx';

/** Mono uppercase section title with optional right-hand link; `ruled` adds the bottom hairline. */
export function SectionHeader({ title, to, linkLabel, ruled = true, className }) {
  return (
    <div className={cx('flex items-baseline justify-between', ruled && 'border-b border-line pb-space-2', className)}>
      <h3 className="font-label text-label uppercase tracking-widest text-fg">{title}</h3>
      {to && linkLabel && <Link to={to} className="font-label text-label text-accent hover:underline">{linkLabel}</Link>}
    </div>
  );
}
export default SectionHeader;
