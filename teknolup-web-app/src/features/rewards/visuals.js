// Backend `badge.icon` keys → Material Symbols. Colour always comes from the theme (never the backend hex).
const BADGE_ICONS = { star: 'star', recycle: 'recycling', wrench: 'build', flame: 'local_fire_department', leaf: 'energy_savings_leaf', trophy: 'emoji_events' };
export const badgeIcon = (key) => BADGE_ICONS[key] ?? 'military_tech';

// Reward catalogue has no icon/category on the backend (plan §1.5): resolve from the title keywords.
const RULES = [
  [/kargo|ship|delivery/i, { icon: 'local_shipping', label: 'transit' }],
  [/tamir|repair|onar/i, { icon: 'handyman', label: 'service' }],
  [/ağaç|tree|fidan|forest/i, { icon: 'forest', label: 'eco' }],
  [/kahve|coffee|kupon|voucher|indirim/i, { icon: 'redeem', label: 'digital' }],
];
export const rewardVisual = (r) => {
  const text = `${r.title ?? ''} ${r.subtitle ?? ''}`;
  const hit = RULES.find(([re]) => re.test(text));
  return hit ? hit[1] : { icon: 'redeem', label: null };
};
