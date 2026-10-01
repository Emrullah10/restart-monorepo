// Module identity (icon + colour) shared by activities, services, map pins.
export const MODULES = {
  repair: { icon: 'build', color: 'repair', textClass: 'text-repair', bgClass: 'bg-repair' },
  sell: { icon: 'sell', color: 'sell', textClass: 'text-sell', bgClass: 'bg-sell' },
  recycle: { icon: 'recycling', color: 'accent', textClass: 'text-accent', bgClass: 'bg-accent' },
  reward: { icon: 'workspace_premium', color: 'accent', textClass: 'text-accent', bgClass: 'bg-accent' },
  default: { icon: 'eco', color: 'accent', textClass: 'text-accent', bgClass: 'bg-accent' },
};
export const moduleOf = (type) => MODULES[type] ?? MODULES.default;
