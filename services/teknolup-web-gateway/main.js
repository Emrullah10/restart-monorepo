import { boot } from './src/boot.js';
import { appConfig } from './configs/app-config.js';

const app = boot();

app.listen(appConfig.port, () => {
  console.log(`Web Gateway ${appConfig.port} portunda çalışıyor.`);
});
