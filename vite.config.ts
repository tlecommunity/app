import { defineConfig } from 'vite';

export default defineConfig({
  base: '/app/',
  resolve: {
    alias: [
      { find: 'app', replacement: '/app' },
      { find: 'test', replacement: '/test' },
    ],
  },
  envPrefix: 'LACUNA_',
  server: {
    port: 3000,
  },
});
