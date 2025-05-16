import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost','source.unsplash.com',
      'photos.hotelbeds.com','backend.fantasticfare.com' ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
    
  },
  // images: {
  //    domains: [
  //     'source.unsplash.com',
  //     'photos.hotelbeds.com' // if you’re also using this
  //   ],
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'photos.hotelbeds.com',
  //       port: '',
  //       pathname: '/**',
        
  //     },
  //   ],
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
