const CO2_PER_KG_WASTE = 2.5;

export const makeDefaultUserStats = () => ({
  totalPoints: 0,
  totalEarnings: 0,
  repairedCount: 0,
  preventedWasteKg: 0,
  co2Saved: 0,
});

export const makeUserStats = ({ totalPoints, totalEarnings, repairedCount, preventedWasteKg }) => ({
  totalPoints: totalPoints || 0,
  totalEarnings: parseFloat(totalEarnings) || 0,
  repairedCount: repairedCount || 0,
  preventedWasteKg: parseFloat(preventedWasteKg) || 0,
  co2Saved: (parseFloat(preventedWasteKg) || 0) * CO2_PER_KG_WASTE,
});
