export const makeFindNearbyCouriers = ({ logisticsRepo }) => async ({ lat, lng, weightCategory }) => {
  const vehicleType = weightCategory === 'heavy' ? 'cargo_vehicle' : 'green_courier';
  return logisticsRepo.findNearbyCouriers({ lat, lng, radius: 2000, vehicleType });
};
