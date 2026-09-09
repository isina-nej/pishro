import type { MetadataRoute } from "next";
import { query } from "@/lib/db";

// ponytail: static routes + published DB slugs; hidden pages still 404 but harmless in sitemap until unhidden
const STATIC_ROUTES = [
  "/",
  "/courses",
  "/crypto-prices",
  "/news",
  "/library",
  "/investment-plans",
  "/business-consulting",
  "/about-us",
  "/contact",
  "/faq",
  "/skyroom-classes",
];

async function publishedNewsSlugs(): Promise<string[]> {
  try {
    const rows = await query<{ slug: string | null }>(
      "SELECT `slug` AS slug FROM `NewsArticle` WHERE published = true AND `slug` IS NOT NULL LIMIT 5000"
    );
    return rows.map((r) => r.slug).filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}

// ponytail: DigitalBook has no `published` column — visibility is bookStatus
async function publishedBookSlugs(): Promise<string[]> {
  try {
    const rows = await query<{ slug: string | null }>(
      "SELECT `slug` AS slug FROM `DigitalBook` WHERE bookStatus = 'PUBLISHED' AND `slug` IS NOT NULL LIMIT 5000"
    );
    return rows.map((r) => r.slug).filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}

async function publishedCoursePaths(): Promise<string[]> {
  try {
    const rows = await query<{ courseSlug: string | null; categorySlug: string | null }>(
      "SELECT c.`slug` AS courseSlug, cat.`slug` AS categorySlug FROM `Course` c LEFT JOIN `Category` cat ON c.`categoryId` = cat.`id` WHERE c.published = true AND c.`slug` IS NOT NULL AND cat.`slug` IS NOT NULL AND cat.`published` = true LIMIT 5000"
    );
    return rows
      .filter((r) => r.courseSlug && r.categorySlug)
      .map((r) => `/courses/${r.categorySlug}/${r.courseSlug}`);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://pishrosarmaye.com";
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route === "/" ? "" : route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const [coursePaths, newsSlugs, bookSlugs] = await Promise.all([
    publishedCoursePaths(),
    publishedNewsSlugs(),
    publishedBookSlugs(),
  ]);

  for (const path of coursePaths) {
    entries.push({ url: `${base}${path}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
  }
  for (const slug of newsSlugs) {
    entries.push({ url: `${base}/news/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
  }
  for (const slug of bookSlugs) {
    entries.push({ url: `${base}/library/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
  }

  return entries;
}
