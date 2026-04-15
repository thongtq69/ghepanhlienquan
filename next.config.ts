import type { NextConfig } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  async rewrites() {
    return [
      // Proxy signed skin images
      { source: '/img/s/:path*', destination: `${API_URL}/img/s/:path*` },
      // Proxy signed asset images
      { source: '/img/a/:path*', destination: `${API_URL}/img/a/:path*` },
      // Proxy static asset images
      { source: '/images/assets/:path*', destination: `${API_URL}/images/assets/:path*` },
    ];
  },
};

export default nextConfig;
