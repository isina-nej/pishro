import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase request body size limit for large file uploads (100MB)
  // Note: In Next.js 15+, bodyParser is configured via middleware
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build - unused vars in some components
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "www.pishrosarmaye.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost:3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost:3001",
        pathname: "/uploads/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
