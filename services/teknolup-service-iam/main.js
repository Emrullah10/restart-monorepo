import { boot } from './src/boot.js';
import { appConfig } from './configs/app-config.js';

const app = boot();

app.listen(appConfig.port, '0.0.0.0', () => {
  console.log(`IAM Service ${appConfig.port} portunda çalışıyor.`);
  console.log(`Test URL: http://localhost:${appConfig.port}/api/auth/login`);
});
