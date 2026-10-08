// Mirror of core/service-operation `logRecycle`: base = round(kg*10); electric transport => total = round(base*1.5).
export const CO2_PER_KG = 2.5;

export const estimateRecyclePoints = ({ weightKg = 0, isElectric = false }) => {
  const base = Math.round((Number(weightKg) || 0) * 10);
  const total = isElectric ? Math.round(base * 1.5) : base;
  return { base, bonus: isElectric ? Math.round(base * 0.5) : 0, total };
};

export const co2ForWeight = (weightKg = 0) => (Number(weightKg) || 0) * CO2_PER_KG;
