import * as util from 'app/util';

const environment = {
  getApiKey() {
    return import.meta.env.LACUNA_API_KEY;
  },

  getAssetsUrl() {
    return util.ensureTrailingSlash(import.meta.env.LACUNA_ASSETS_URL);
  },

  getServerUrl() {
    return util.ensureTrailingSlash(import.meta.env.LACUNA_SERVER_URL);
  },

  isDevelopment() {
    return window.location.hostname === 'localhost';
  },
};

export default environment;
