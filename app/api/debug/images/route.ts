import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";

// Debug API to inspect local and remote image availability.
// Protected by debug secret (env DEBUG_SECRET) unless not set in non-production env.

async function checkLocalFile(relativePath: string) {
  try {
    const filePath = path.join(process.cwd(), "public", relativePath.replace(/^\//, ""));
    const s = await stat(filePath);
    return { exists: s.isFile(), size: s.size };
  } catch (e) {
    return { exists: false };
  }
}

async function remoteHead(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return { ok: res.ok, status: res.status, headers: Object.fromEntries(res.headers) };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const DEBUG_SECRET = process.env.DEBUG_SECRET;

  if (process.env.NODE_ENV === "production" && DEBUG_SECRET && secret !== DEBUG_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Sample images to verify (local & remote). Add more if needed.
  const samples = [
    { type: "local", path: "/images/utiles/decor1.svg" },
    { type: "local", path: "/images/news/header.jpg" },
  ];

  // If public/uploads exists, include a sampling of uploads
  try {
    const uploadsFolder = path.join(process.cwd(), "public", "uploads");
    const files = await readdir(uploadsFolder).catch(() => []);
    for (const f of files) {
      // only test a few
      samples.push({ type: "local", path: `/uploads/${f}` });
      if (samples.length > 12) break;
    }
  } catch (e) {}

  // Add some remote checks derived from env (S3_PUBLIC_ENDPOINT and UPLOAD_BASE_URL)
  const s3 = process.env.S3_PUBLIC_ENDPOINT;
  const uploadBase = process.env.UPLOAD_BASE_URL;
  if (s3) {
    samples.push({ type: "remote", url: `${s3}/images/landing.webp` });
  }
  if (uploadBase) {
    samples.push({ type: "remote", url: `${uploadBase}/images/news/header.jpg` });
    samples.push({ type: "remote", url: `${uploadBase}/avatars/example.jpg` });
  }

  // If user passed a custom resource query param, check it
  const custom = url.searchParams.get("resource");
  if (custom) {
    if (custom.startsWith("http")) samples.push({ type: "remote", url: custom });
    else samples.push({ type: "local", path: custom });
  }

  // Perform checks
  const results = [] as any[];
  for (const s of samples) {
    if (s.type === "local") {
      const r = await checkLocalFile(s.path);
      results.push({ ...s, ...r });
    } else {
      const r = await remoteHead(s.url);
      results.push({ ...s, ...r });
    }
  }

  return NextResponse.json({ ok: true, results });
}

export const runtime = "edge";
