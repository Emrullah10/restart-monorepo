import { ValidationError } from '@restart/errors';

export const makeGetNearbyServices = ({ operationRepo }) => async ({ lat, lng, radiusMeters = 5000, type } = {}) => {
  if (!lat || !lng) {
    throw new ValidationError('Konum bilgisi (lat, lng) zorunludur');
  }

  return operationRepo.findNearbyServices({
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    radiusMeters: parseInt(radiusMeters, 10),
    type,
  });
};
