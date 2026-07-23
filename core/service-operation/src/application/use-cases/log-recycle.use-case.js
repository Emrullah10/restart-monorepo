export const makeLogRecycle = ({ operationRepo }) => async ({ userId, serviceCenterId, wasteType, weightKg, isElectricTransport }) => {
  return operationRepo.logRecycle({ userId, serviceCenterId, wasteType, weightKg, isElectricTransport });
};
