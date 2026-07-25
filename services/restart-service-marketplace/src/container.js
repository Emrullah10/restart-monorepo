import { makeDatasource } from '@restart/datasource';
import { makeDatasourceConfig } from '@restart/config';
import { wrapWithHttpTranslation } from '@restart/errors';
import { makeMarketplaceRepository } from '@restart/core-marketplace/src/infrastructure/persistence/repositories/marketplace.repository.js';
import { makeGetProducts } from '@restart/core-marketplace/src/application/use-cases/get-products.use-case.js';
import { makeGetUserListings } from '@restart/core-marketplace/src/application/use-cases/get-user-listings.use-case.js';
import { makeMarketplaceController } from '@restart/core-marketplace/src/interfaces/http/marketplace.controller.js';
import { createMarketplaceRoutes } from '@restart/core-marketplace/src/interfaces/http/routes.js';

export const buildContainer = ({ datasourceConfig = makeDatasourceConfig(), translateHttpErrors = true } = {}) => {
  const { query } = makeDatasource(datasourceConfig);
  const wrap = translateHttpErrors ? wrapWithHttpTranslation : (fn) => fn;

  const marketplaceRepo = makeMarketplaceRepository({ query });
  const getProducts = makeGetProducts({ marketplaceRepo });
  const getUserListings = makeGetUserListings({ marketplaceRepo });
  const marketplaceController = makeMarketplaceController({ getProducts, getUserListings });

  const wrappedController = {
    getProducts: wrap(marketplaceController.getProducts),
    getUserListings: wrap(marketplaceController.getUserListings),
  };

  return {
    marketplaceRoutes: createMarketplaceRoutes({ marketplaceController: wrappedController }),
  };
};
