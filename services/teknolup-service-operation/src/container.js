import { makeDatasource } from '@teknolup/datasource';
import { makeDatasourceConfig } from '@teknolup/config';
import { wrapWithHttpTranslation } from '@teknolup/errors';
import { makeOperationRepository } from '@teknolup/core-operation/src/infrastructure/persistence/repositories/operation.repository.js';
import { makeLogisticsRepository } from '@teknolup/core-operation/src/infrastructure/persistence/repositories/logistics.repository.js';
import { makeGetServices } from '@teknolup/core-operation/src/application/use-cases/get-services.use-case.js';
import { makeGetNearbyServices } from '@teknolup/core-operation/src/application/use-cases/get-nearby-services.use-case.js';
import { makeGetActivities } from '@teknolup/core-operation/src/application/use-cases/get-activities.use-case.js';
import { makeLogRecycle } from '@teknolup/core-operation/src/application/use-cases/log-recycle.use-case.js';
import { makeCalculateImpact } from '@teknolup/core-operation/src/application/use-cases/calculate-impact.use-case.js';
import { makeFindNearbyCouriers } from '@teknolup/core-operation/src/application/use-cases/find-nearby-couriers.use-case.js';
import { makeOperationController } from '@teknolup/core-operation/src/interfaces/http/operation.controller.js';
import { createOperationRoutes } from '@teknolup/core-operation/src/interfaces/http/routes.js';
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
