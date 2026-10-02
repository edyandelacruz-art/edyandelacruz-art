import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@appdeploy/sdk': fileURLToPath(new URL('./backend/appdeploy-sdk.test-stub.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
  },
});
