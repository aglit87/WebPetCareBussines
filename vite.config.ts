import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const src = path.resolve(__dirname, 'src');
const nodeModules = path.resolve(__dirname, 'node_modules');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': src },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        // Design tokens (colors, radii, fonts, shadows, mixins) live in the
        // petcare-storybook-ui package — this app no longer keeps its own copy.
        loadPaths: [src, nodeModules],
        additionalData: `@use "petcare-storybook-ui/src/styles/variables" as *;\n@use "petcare-storybook-ui/src/styles/mixins" as *;\n`,
      },
    },
  },
  server: { port: 5173, open: true },
});
