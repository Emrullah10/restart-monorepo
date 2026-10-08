import { cx } from './cx';
export function Skeleton({ className }) {
  return <span aria-hidden="true" className={cx('block animate-pulse rounded-r4 bg-strong', className)} />;
}
export default Skeleton;
