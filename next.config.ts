import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Middleware/proxy buffers request bodies before route handlers.
    // Keep this above the 500MB video validation limit to avoid truncated multipart uploads.
    middlewareClientMaxBodySize: "550mb",
    // Keep recently visited public pages warm in the client router cache.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
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
  async headers() {
    const immutable = "public, max-age=31536000, immutable";
    const day = "public, max-age=86400, stale-while-revalidate=604800";
    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: immutable }],
      },
      {
        source: "/font/:path*",
        headers: [{ key: "Cache-Control", value: immutable }],
      },
      {
        source: "/logo/:path*",
        headers: [{ key: "Cache-Control", value: day }],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: day }],
      },
      {
        source: "/icons/:path*",
        headers: [{ key: "Cache-Control", value: day }],
      },
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: day }],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
