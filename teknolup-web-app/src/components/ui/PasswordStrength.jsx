import { useTranslation } from 'react-i18next';
import { passwordStrength } from '@shared/passwordStrength';
import { cx } from './cx';

const COLORS = { 1: 'bg-danger', 2: 'bg-sell', 3: 'bg-brand-400', 4: 'bg-accent' };
const TEXT = { weak: 'text-danger', fair: 'text-sell', good: 'text-brand-400', strong: 'text-accent', idle: 'text-fg-3' };

export function PasswordStrength({ value, showHint = false }) {
  const { t } = useTranslation();
  const { score, key } = passwordStrength(value);
  return (
    <div className="mt-space-2">
      <div className="flex h-1.5 w-full gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={cx('h-full flex-1', i === 1 && 'rounded-l-r12', i === 4 && 'rounded-r-r12', i <= score ? COLORS[score] : 'bg-line')} />
        ))}
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className={cx('font-caption text-caption', TEXT[key])}>{t(`auth.strength.${key}`)}</span>
        {showHint && <span className="font-caption text-caption text-fg-3">{t('auth.minChars')}</span>}
      </div>
    </div>
  );
}
export default PasswordStrength;
