import { Icon } from './Icon';

export function EmptyState({ icon = 'inbox', title, subtitle, children }) {
  return (
    <div className="flex flex-col items-center gap-space-3 rounded-r4 border border-dashed border-line-strong bg-subtle px-space-6 py-space-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-r4 bg-muted text-fg-2"><Icon name={icon} size={32} weight={300} /></div>
      <p className="font-heading-md text-heading-md text-fg">{title}</p>
      {subtitle && <p className="max-w-[40ch] font-body-md text-body-md text-fg-2">{subtitle}</p>}
      {children}
    </div>
  );
}
export default EmptyState;
