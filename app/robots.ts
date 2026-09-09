import type { MetadataRoute } from "next";

// ponytail: canonical apex only; www must 301 at nginx, not here
export default function robots(): MetadataRoute.Robots {
  const base = "https://pishrosarmaye.com";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/profile", "/checkout"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
