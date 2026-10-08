import { makeAppConfig } from '@teknolup/config';

export const appConfig = makeAppConfig({ portEnvVar: 'IAM_PORT', defaultPort: 3001 });

export const jwtSecret = process.env.JWT_SECRET || 'teknolup-secret-key';
