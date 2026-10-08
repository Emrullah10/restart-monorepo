import { makeAppConfig } from '@teknolup/config';

export const appConfig = makeAppConfig({ portEnvVar: 'GATEWAY_PORT', defaultPort: 3000 });

export const jwtSecret = process.env.JWT_SECRET || 'teknolup-secret-key';

export const serviceTargets = {
  iam: process.env.IAM_SERVICE_URL || 'http://localhost:3001',
  operation: process.env.OPERATION_SERVICE_URL || 'http://localhost:3002',
  marketplace: process.env.MARKETPLACE_SERVICE_URL || 'http://localhost:3003',
};

export const ACCESS_COOKIE = 'teknolup_access_token';
