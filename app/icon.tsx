import { readFile } from "fs/promises";
import path from "path";
import { getPublicSiteChrome } from "@/lib/services/settings-service";
import { getInternalBaseUrl } from "@/lib/get-base-url";
import { DEFAULT_FAVICON_URL } from "@/lib/site/branding";

/**
 * Dynamic favicon for browser tabs and Google Search results.
 * Serves the admin-configured favicon/logo, with a local fallback.
 */
export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

function imageResponse(bytes: Buffer, type: string): Response {
  // Node Buffer is valid BodyInit at runtime; TS DOM typings disagree in this repo.
  return new Response(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

async function loadLocalFallback(): Promise<Buffer> {
  const filePath = path.join(process.cwd(), "public", "logo", "logo-square.png");
  return readFile(filePath);
}

export default async function Icon() {
  try {
    const chrome = await getPublicSiteChrome();
    const favicon = chrome.faviconUrl || DEFAULT_FAVICON_URL;

    if (favicon.startsWith("/logo/") || favicon.startsWith("/images/")) {
      const relative = favicon.replace(/^\//, "");
      const filePath = path.join(process.cwd(), "public", relative);
      return imageResponse(await readFile(filePath), "image/png");
    }

    const fetchUrl = favicon.startsWith("http")
      ? favicon
      : `${getInternalBaseUrl()}${favicon.startsWith("/") ? favicon : `/${favicon}`}`;

    const res = await fetch(fetchUrl, { cache: "force-cache" });
    if (!res.ok) throw new Error(`favicon fetch failed: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const type = res.headers.get("content-type") || "image/png";
    return imageResponse(buf, type);
  } catch {
    return imageResponse(await loadLocalFallback(), "image/png");
  }
}
