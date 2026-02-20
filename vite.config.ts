
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Ensures relative paths
  plugins: [react()],
  server: {
    allowedHosts: true, // Allow all hosts
    host: '0.0.0.0', // Listen on all IP addresses
    cors: true,      // Enable CORS for external access
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }
});
