const BADGE_RULES = [
  {
    name: 'İlk Adım',
    icon: 'star',
    color: '#10B981',
    isUnlocked: (stats) => stats.totalPoints >= 1,
  },
  {
    name: 'Geri Dönüşüm Kahramanı',
    icon: 'recycle',
    color: '#22C55E',
    isUnlocked: (stats) => stats.preventedWasteKg >= 10,
  },
  {
    name: 'Tamirci',
    icon: 'wrench',
    color: '#3B82F6',
    isUnlocked: (stats) => stats.repairedCount >= 5,
  },
  {
    name: 'Puan Avcısı',
    icon: 'flame',
    color: '#F59E0B',
    isUnlocked: (stats) => stats.totalPoints >= 1000,
  },
  {
    name: 'Çevre Dostu',
    icon: 'leaf',
    color: '#10B981',
    isUnlocked: (stats) => stats.co2Saved >= 50,
  },
  {
    name: 'Şampiyon',
    icon: 'trophy',
    color: '#EAB308',
    isUnlocked: (stats) => stats.totalPoints >= 5000,
  },
];

export const deriveBadgesFromStats = (stats) =>
  BADGE_RULES.map(({ name, icon, color, isUnlocked }) => ({
    name,
    icon,
    color,
    isUnlocked: isUnlocked(stats),
  }));
