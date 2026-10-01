// Level thresholds are a product decision (plan §3.7); change here only.
const LEVELS = [
  { level: 1, key: 'new', min: 0 },
  { level: 2, key: 'curious', min: 100 },
  { level: 3, key: 'aware', min: 500 },
  { level: 4, key: 'conscious', min: 1000 },
  { level: 5, key: 'pioneer', min: 2500 },
  { level: 6, key: 'champion', min: 5000 },
];

export const computeLevel = (points = 0) => {
  const p = Number(points) || 0;
  let i = LEVELS.findIndex((l, idx) => p >= l.min && (idx === LEVELS.length - 1 || p < LEVELS[idx + 1].min));
  if (i < 0) i = 0;
  const cur = LEVELS[i];
  const next = LEVELS[i + 1];
  const progress = next ? (p - cur.min) / (next.min - cur.min) : 1;
  const tier = cur.level <= 2 ? 'bronze' : cur.level <= 4 ? 'silver' : 'gold';
  return { level: cur.level, key: cur.key, tier, progress, nextMin: next?.min ?? null };
};
