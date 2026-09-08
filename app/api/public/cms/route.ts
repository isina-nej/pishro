/**
 * Public CMS Content API
 * GET /api/public/cms - Fetch resolved CMS content (public, cached)
 * Query param: ?pageId=... (optional, returns single page dictionary)
 */

import { NextRequest } from "next/server";
import { getPublicContent } from "@/lib/services/settings-service";
import { successResponse } from "@/lib/api-response";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get("pageId");

  const fullContent = await getPublicContent();

  const data = pageId ? fullContent[pageId] || {} : fullContent;

  const res = successResponse(data, "محتوای عمومی با موفقیت دریافت شد");

  // Cache for 60 seconds on CDN, serve stale while revalidating up to 5 minutes
  res.headers.set(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );

  return res;
}
