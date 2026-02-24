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
    // PERFORMANCE: CSS optimization
    cssCodeSplit: true,
    // PERFORMANCE: Sourcemap only for development
    sourcemap: process.env.NODE_ENV === 'development',
    // PERFORMANCE: Chunk size limits
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // PERFORMANCE: Optimize chunk naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
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
            // Charts Library
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
          }
          // PERFORMANCE: Separate core package into its own chunk
          if (id.includes('packages/core/src')) {
            return 'core';
          }
        }
      }
    }
  },
  // PERFORMANCE: Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'zustand'],
    exclude: [],
  },
})
