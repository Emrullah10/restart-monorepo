import { cx } from './cx';

export function Switch({ checked, onChange, label, disabled }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)}
      className={cx('relative h-6 w-11 shrink-0 rounded-r12 border transition-colors disabled:opacity-50', checked ? 'border-accent bg-accent' : 'border-line bg-strong')}>
      <span className={cx('absolute top-0.5 h-4 w-4 rounded-r12 bg-raised transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
    </button>
  );
}
export default Switch;
