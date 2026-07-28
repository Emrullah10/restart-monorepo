export const makeGetPublicListings = ({ marketplaceRepo }) => async ({ category, q, limit } = {}) => {
  return marketplaceRepo.findAllListings({ category, q, limit });
};
