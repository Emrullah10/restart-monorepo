export const makeGetServices = ({ operationRepo }) => async ({ type } = {}) => {
  return operationRepo.findAllServices({ type });
};
