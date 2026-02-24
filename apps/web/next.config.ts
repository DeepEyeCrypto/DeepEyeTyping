import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PERFORMANCE: Enable experimental optimizations
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // React Strict Mode for detecting side effects
  reactStrictMode: true,

  // PERFORMANCE: Optimize production builds
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // PERFORMANCE: Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // PERFORMANCE: Enable compression
  compress: true,


};

export default nextConfig;
