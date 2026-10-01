// Backend badge.entity.js sends an `icon` string key and a `color` hex.
// The color is ignored here on purpose — it's from the old palette and
// doesn't work in dark mode. Color always comes from the client theme
// (DESIGN_SYSTEM.md §2.3).
import { Star, Recycle, Wrench, Fire, Leaf, Trophy, Medal } from '@shared/icons';

export const BADGE_ICONS = {
  star: Star,
  recycle: Recycle,
  wrench: Wrench,
  flame: Fire, // backend sends "flame" -> Phosphor icon is "Fire"
  leaf: Leaf,
  trophy: Trophy,
};

export const BADGE_COLORS = {
  star: 'var(--module-reward)',
  recycle: 'var(--module-recycle)',
  wrench: 'var(--module-repair)',
  flame: 'var(--warning)',
  leaf: 'var(--module-recycle)',
  trophy: 'var(--module-reward)',
};

export const getBadgeIcon = (key) => BADGE_ICONS[key] ?? Medal;
export const getBadgeColor = (key) => BADGE_COLORS[key] ?? 'var(--fg-secondary)';
