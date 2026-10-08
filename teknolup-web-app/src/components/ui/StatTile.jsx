import { Card } from './Card';
import { cx } from './cx';

export function StatTile({ label, value, unit, accent = false, className }) {
  return (
    <Card className={cx('flex flex-col gap-space-2 p-space-4', className)}>
      <span className="font-label text-label uppercase text-fg-2">{label}</span>
      <span className={cx('font-data-lg text-data-lg tabular-nums', accent ? 'text-accent' : 'text-fg')}>
        {value}
        {unit && <span className="font-caption text-caption font-normal text-fg-2 ml-1">{unit}</span>}
      </span>
    </Card>
  );
}
export default StatTile;
