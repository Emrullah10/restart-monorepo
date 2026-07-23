export const makeGetProducts = ({ marketplaceRepo }) => async () => {
  return marketplaceRepo.findAll();
};
