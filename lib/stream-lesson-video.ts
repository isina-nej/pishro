import { NextResponse } from "next/server";
import {
  generateSignedDownloadUrl,
  downloadFileFromStorage,
} from "@/lib/services/object-storage-service";
import { getAbsoluteStoragePath } from "@/lib/services/storage-adapter";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

const STREAM_EXPIRES = 60;

/**
 * Server-side proxied MP4 stream for a lesson video (storage path never exposed).
 */
export async function streamLessonVideoByRelativePath(
  relativePath: string
): Promise<NextResponse> {
  let fileContent: Buffer;
  const useS3 = !!process.env.S3_BUCKET_NAME;

  if (useS3) {
    const signedUrl = await generateSignedDownloadUrl(relativePath, STREAM_EXPIRES);
    const fetchRes = await fetch(signedUrl);
    if (!fetchRes.ok) {
      throw new Error(`Signed fetch failed: ${fetchRes.status}`);
    }
    fileContent = Buffer.from(await fetchRes.arrayBuffer());
  } else {
    const absolutePath = getAbsoluteStoragePath(relativePath);
    if (existsSync(absolutePath)) {
      fileContent = await readFile(absolutePath);
    } else {
      fileContent = await downloadFileFromStorage(relativePath);
    }
  }

  const response = new NextResponse(new Uint8Array(fileContent));
  response.headers.set("Content-Type", "video/mp4");
  response.headers.set("Content-Length", fileContent.length.toString());
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Accept-Ranges", "bytes");
  return response;
}
