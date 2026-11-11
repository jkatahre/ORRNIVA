import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => (/node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/.test(id) ? 'vendor' : undefined),
      },
    },
  },
});
