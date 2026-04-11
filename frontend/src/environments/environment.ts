import { getRuntimeConfig } from './runtime-config';

const runtimeConfig = getRuntimeConfig({
  apiBaseUrl: 'https://nursery-backend.onrender.com/api',
  assetBaseUrl: 'https://nursery-backend.onrender.com'
});

export const environment = {
  production: true,
  ...runtimeConfig
};
