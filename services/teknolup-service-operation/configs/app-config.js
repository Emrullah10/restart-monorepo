import { makeAppConfig } from '@teknolup/config';

export const appConfig = makeAppConfig({ portEnvVar: 'OPERATION_PORT', defaultPort: 3002 });

export const geminiApiKey = process.env.GEMINI_API_KEY;
