import { makeListing, validateListing } from '../../domain/entities/listing.entity.js';

export const makeCreateListing = ({ marketplaceRepo }) => async (input) => {
  const listing = makeListing(input);
  validateListing(listing);
  return marketplaceRepo.createListing({ ...listing, images: input.images || [] });
};
