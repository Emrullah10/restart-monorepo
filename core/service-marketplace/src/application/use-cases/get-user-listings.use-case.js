export const makeGetUserListings = ({ marketplaceRepo }) => async ({ userId }) => {
  return marketplaceRepo.findListingsByUserId(userId);
};
