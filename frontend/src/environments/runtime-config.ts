type RuntimeConfig = {
  apiBaseUrl?: string;
  assetBaseUrl?: string;
};

declare global {
  interface Window {
    __NURSERY_RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

const readRuntimeConfig = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  return window.__NURSERY_RUNTIME_CONFIG__ ?? {};
};

export const getRuntimeConfig = (defaults: Required<RuntimeConfig>) => {
  const runtimeConfig = readRuntimeConfig();

  return {
    apiBaseUrl: runtimeConfig.apiBaseUrl?.trim() || defaults.apiBaseUrl,
    assetBaseUrl: runtimeConfig.assetBaseUrl?.trim() || defaults.assetBaseUrl
  };
};
