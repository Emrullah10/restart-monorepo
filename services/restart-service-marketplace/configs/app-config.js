import { makeAppConfig } from '@restart/config';

export const appConfig = makeAppConfig({ portEnvVar: 'MARKETPLACE_PORT', defaultPort: 3003 });
