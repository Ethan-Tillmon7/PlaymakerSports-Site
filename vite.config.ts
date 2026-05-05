import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    outDir: isSsrBuild ? 'dist/server' : 'dist',
  },
  ssr: {
    // react-helmet-async ships CJS; bundle it so Node gets the ESM-inlined version
    noExternal: ['react-helmet-async'],
  },
}));
