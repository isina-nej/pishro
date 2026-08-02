import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Middleware/proxy buffers request bodies before route handlers.
    // Keep this above the 500MB video validation limit to avoid truncated multipart uploads.
    middlewareClientMaxBodySize: "550mb",
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build - unused vars in some components
  },
  images: {
    qualities: [75, 85, 90, 100],
    remotePatterns: [
      {
        // فضای ابری پارس‌پک (هر ساب‌دامین باکت، مثل c773651.parspack.net)
        protocol: "https",
        hostname: "**.parspack.net",
      },
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
