import { ValidationError } from '@restart/errors';

const POINTS_PER_UNIT = { plastic: 5, glass: 3, electronic: 20 };
const DEFAULT_POINTS_PER_UNIT = 1;
const ELECTRIC_TRANSPORT_MULTIPLIER = 1.5;

export const makeRecycle = ({ userId, centerId, wasteType, amount, pointsEarned, transportMode, createdAt }) => ({
  userId,
  centerId,
  wasteType,
  amount,
  pointsEarned: pointsEarned || 0,
  transportMode: transportMode || 'standard',
  createdAt: createdAt || new Date(),
});

export const validateRecycle = (recycle) => {
  if (!recycle.userId) throw new ValidationError('User ID is required');
  if (!recycle.wasteType) throw new ValidationError('Waste type is required');
  if (recycle.amount <= 0) throw new ValidationError('Amount must be positive');
};

export const calculateRecyclePoints = (recycle) => {
  const pointsPerUnit = POINTS_PER_UNIT[recycle.wasteType] ?? DEFAULT_POINTS_PER_UNIT;
  const transportMultiplier = recycle.transportMode === 'electric' ? ELECTRIC_TRANSPORT_MULTIPLIER : 1.0;
  return { ...recycle, pointsEarned: recycle.amount * pointsPerUnit * transportMultiplier };
};
