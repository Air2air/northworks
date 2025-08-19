import type { NextConfig } from "next";
import path from 'path';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Temporarily disable ESLint for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Force webpack instead of turbopack to avoid conflicts
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Build optimizations
  webpack: (config, { dev, isServer }) => {
    // Configure path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    
    if (!dev && !isServer) {
      // Tree shaking optimization
      config.optimization.usedExports = true;
    }
    
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
