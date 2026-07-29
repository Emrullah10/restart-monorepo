import { makeAppConfig } from '@restart/config';

export const appConfig = makeAppConfig({ portEnvVar: 'MAPI_GATEWAY_PORT', defaultPort: 3004 });

export const jwtSecret = process.env.JWT_SECRET || 'restart-secret-key';

export const serviceTargets = {
  iam: process.env.IAM_SERVICE_URL || 'http://localhost:3001',
  operation: process.env.OPERATION_SERVICE_URL || 'http://localhost:3002',
  marketplace: process.env.MARKETPLACE_SERVICE_URL || 'http://localhost:3003',
};
