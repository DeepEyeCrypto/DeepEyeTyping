import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
    })
  ],
  clearScreen: false,
  resolve: {
    alias: {
      'core': path.resolve(__dirname, '../../packages/core'),
      'ui': path.resolve(__dirname, '../../packages/ui'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      allow: ['..', '../../packages'],
    }
  },
  envPrefix: ['VITE_', 'TAURI_'],
  define: {
    'process.env': {}
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    reportCompressedSize: false, // Speed up build
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor Chunking Strategy
          if (id.includes('node_modules')) {
            // Core Framework
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            // Heavy Animation Libs
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // Backend Services
            if (id.includes('firebase') || id.includes('@firebase')) {
              return 'vendor-firebase';
            }
            // State Management & Utilities
            if (id.includes('zustand') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-utils';
            }
            // UI Icons (optional, lucide is tree-shakable so maybe keep in app or separate)
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        }
      }
    }
  }
})
