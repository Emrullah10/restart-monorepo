import { makeDatasource } from '@restart/datasource';
import { makeDatasourceConfig } from '@restart/config';
import { wrapWithHttpTranslation } from '@restart/errors';
import { makeOperationRepository } from '@restart/core-operation/src/infrastructure/persistence/repositories/operation.repository.js';
import { makeLogisticsRepository } from '@restart/core-operation/src/infrastructure/persistence/repositories/logistics.repository.js';
import { makeGetServices } from '@restart/core-operation/src/application/use-cases/get-services.use-case.js';
import { makeGetNearbyServices } from '@restart/core-operation/src/application/use-cases/get-nearby-services.use-case.js';
import { makeGetActivities } from '@restart/core-operation/src/application/use-cases/get-activities.use-case.js';
import { makeLogRecycle } from '@restart/core-operation/src/application/use-cases/log-recycle.use-case.js';
import { makeCalculateImpact } from '@restart/core-operation/src/application/use-cases/calculate-impact.use-case.js';
import { makeFindNearbyCouriers } from '@restart/core-operation/src/application/use-cases/find-nearby-couriers.use-case.js';
import { makeOperationController } from '@restart/core-operation/src/interfaces/http/operation.controller.js';
import { createOperationRoutes } from '@restart/core-operation/src/interfaces/http/routes.js';
import { geminiApiKey } from '../configs/app-config.js';

export const buildContainer = ({ datasourceConfig = makeDatasourceConfig(), translateHttpErrors = true } = {}) => {
  const { query } = makeDatasource(datasourceConfig);
  const wrap = translateHttpErrors ? wrapWithHttpTranslation : (fn) => fn;

  const operationRepo = makeOperationRepository({ query });
  const logisticsRepo = makeLogisticsRepository({ query });

  const getServices = makeGetServices({ operationRepo });
  const getNearbyServices = makeGetNearbyServices({ operationRepo });
  const getActivities = makeGetActivities({ operationRepo });
  const logRecycle = makeLogRecycle({ operationRepo });
  const calculateImpact = makeCalculateImpact({ geminiApiKey });
  const findNearbyCouriers = makeFindNearbyCouriers({ logisticsRepo });

  const operationController = makeOperationController({
    getServices,
    getNearbyServices,
    getActivities,
    logRecycle,
    calculateImpact,
    findNearbyCouriers,
    operationRepo,
  });

  const wrappedController = Object.fromEntries(
    Object.entries(operationController).map(([key, handler]) => [key, wrap(handler)])
  );

  return {
    operationRoutes: createOperationRoutes({ operationController: wrappedController }),
  };
};
