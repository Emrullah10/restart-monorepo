import { makeDatasource } from '@teknolup/datasource';
import { makeDatasourceConfig } from '@teknolup/config';
import { wrapWithHttpTranslation } from '@teknolup/errors';
import { makeMarketplaceRepository } from '@teknolup/core-marketplace/src/infrastructure/persistence/repositories/marketplace.repository.js';
import { makeGetPublicListings } from '@teknolup/core-marketplace/src/application/use-cases/get-public-listings.use-case.js';
import { makeGetUserListings } from '@teknolup/core-marketplace/src/application/use-cases/get-user-listings.use-case.js';
import { makeCreateListing } from '@teknolup/core-marketplace/src/application/use-cases/create-listing.use-case.js';
import { makeMarketplaceController } from '@teknolup/core-marketplace/src/interfaces/http/marketplace.controller.js';
import { createMarketplaceRoutes } from '@teknolup/core-marketplace/src/interfaces/http/routes.js';
import { uploadMiddleware, buildImageUrls } from './upload.js';

export const buildContainer = ({ datasourceConfig = makeDatasourceConfig(), translateHttpErrors = true } = {}) => {
  const { query } = makeDatasource(datasourceConfig);
  const wrap = translateHttpErrors ? wrapWithHttpTranslation : (fn) => fn;

  const marketplaceRepo = makeMarketplaceRepository({ query });
  const getPublicListings = makeGetPublicListings({ marketplaceRepo });
  const getUserListings = makeGetUserListings({ marketplaceRepo });
  const createListing = makeCreateListing({ marketplaceRepo });
  const marketplaceController = makeMarketplaceController({
    getPublicListings,
    getUserListings,
    createListing,
    uploadImages: buildImageUrls,
  });

  const wrappedController = {
    getProducts: wrap(marketplaceController.getProducts),
    getUserListings: wrap(marketplaceController.getUserListings),
    createListing: wrap(marketplaceController.createListing),
    uploadImages: wrap(marketplaceController.uploadImages),
  };

  return {
    marketplaceRoutes: createMarketplaceRoutes({ marketplaceController: wrappedController, uploadMiddleware }),
  };
};
