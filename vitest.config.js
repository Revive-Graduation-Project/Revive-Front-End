// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // jsdom for testing components that interact with the DOM
    setupFiles: ['./src/tests/setup.js'],
  }
});
