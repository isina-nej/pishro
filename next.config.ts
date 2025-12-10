import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,   // ← این خط تمام وابستگی به sharp را قطع می‌کند
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
        protocol: "https",
        hostname: "teh-1.s3.poshtiban.com",
      },
    ],
 
  },
  output: "standalone",
};

export default nextConfig;
