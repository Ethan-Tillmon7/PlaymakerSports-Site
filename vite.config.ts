import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), imagetools()],
  build: {
    outDir: isSsrBuild ? 'dist/server' : 'dist',
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            // Split the stable framework code into its own long-cached chunk so
            // app-code changes don't bust the vendor bundle.
            manualChunks: (id: string) =>
              /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)
                ? 'react'
                : undefined,
          },
        },
  },
  ssr: {
    // react-helmet-async ships CJS; bundle it so Node gets the ESM-inlined version
    noExternal: ['react-helmet-async'],
  },
}));
