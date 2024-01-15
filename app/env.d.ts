/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly LACUNA_ASSETS_URL: string;
  readonly LACUNA_SERVER_URL: string;
  readonly LACUNA_WS_SERVER_URL: string;
  readonly LACUNA_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
