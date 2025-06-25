import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore'], // ✅ help Vite pre-bundle dependencies
    exclude: ['lucide-react'],
  },
  build: {
    minify: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/analytics'],
          ui: ['lucide-react', '@radix-ui/react-tabs']
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000
  }
});