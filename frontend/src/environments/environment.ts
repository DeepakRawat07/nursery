import { getRuntimeConfig } from './runtime-config';

const runtimeConfig = getRuntimeConfig({
  apiBaseUrl: 'https://nursery-fpgp.onrender.com/api',
  assetBaseUrl: 'https://nursery-fpgp.onrender.com'
});

export const environment = {
  production: true,
  ...runtimeConfig
};
