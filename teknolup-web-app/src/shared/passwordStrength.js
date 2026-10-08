// 0 → idle; 1 weak; 2 fair; 3 good; 4 strong (length based, as in the Stitch prototype).
export const passwordStrength = (value = '') => {
  const len = value.length;
  if (len === 0) return { score: 0, key: 'idle' };
  if (len < 6) return { score: 1, key: 'weak' };
  if (len < 8) return { score: 2, key: 'fair' };
  if (len < 12) return { score: 3, key: 'good' };
  return { score: 4, key: 'strong' };
};
