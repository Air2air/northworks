import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Temporarily disable ESLint for bundle analysis
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['react-icons']
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Build optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Tree shaking optimization
      config.optimization.usedExports = true;
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
