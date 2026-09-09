import { readFile } from "fs/promises";
import path from "path";

// ponytail: serve configured logo as favicon.ico so /favicon.ico never 404s; icon.tsx handles /icon
export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const filePath = path.join(process.cwd(), "public", "logo", "logo-square.png");
  const bytes = await readFile(filePath);
  return new Response(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=2592000, stale-while-revalidate=604800",
    },
  });
}
