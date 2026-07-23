import { makeAppConfig } from '@restart/config';

export const appConfig = makeAppConfig({ portEnvVar: 'IAM_PORT', defaultPort: 3001 });

export const jwtSecret = process.env.JWT_SECRET || 'restart-secret-key';
