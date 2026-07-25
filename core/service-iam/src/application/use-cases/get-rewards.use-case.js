const REWARDS = [
  { id: 'mediamarkt-50', title: 'MediaMarkt', subtitle: '50₺ Hediye Çeki', pointsCost: 500 },
  { id: 'migros-100', title: 'Migros', subtitle: '100₺ Hediye Çeki', pointsCost: 800 },
  { id: 'starbucks-75', title: 'Starbucks', subtitle: '75₺ Hediye Çeki', pointsCost: 1500 },
];

export const makeGetRewards = () => async () => REWARDS;
