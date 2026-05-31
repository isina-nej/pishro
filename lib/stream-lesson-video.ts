import { NextResponse } from "next/server";
import {
  generateSignedDownloadUrl,
  downloadFileFromStorage,
} from "@/lib/services/object-storage-service";
import { getAbsoluteStoragePath } from "@/lib/services/storage-adapter";
import { existsSync } from "fs";
import { createReadStream } from "fs";
import { readFile, stat } from "fs/promises";
import { Readable } from "stream";

const STREAM_EXPIRES = 60;

const secureVideoHeaders = {
  "Content-Type": "video/mp4",
  "Accept-Ranges": "bytes",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, private",
  "Pragma": "no-cache",
  "Expires": "0",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Content-Disposition": 'inline; filename="lesson-video.mp4"',
} as const;

/**
 * Server-side proxied MP4 stream for a lesson video (storage path never exposed).
 */
export async function streamLessonVideoByRelativePath(
  relativePath: string,
  req?: Request
): Promise<NextResponse> {
  const absolutePath = getAbsoluteStoragePath(relativePath);

  if (existsSync(absolutePath)) {
    const fileStat = await stat(absolutePath);
    const range = req?.headers.get("range");

    if (range) {
      const match = range.match(/bytes=(\d*)-(\d*)/);
      const start = match?.[1] ? parseInt(match[1], 10) : 0;
      const end = match?.[2]
        ? Math.min(parseInt(match[2], 10), fileStat.size - 1)
        : fileStat.size - 1;

      if (start >= fileStat.size || end >= fileStat.size || start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: {
          ...secureVideoHeaders,
            "Content-Range": `bytes */${fileStat.size}`,
          },
        });
      }

      const stream = createReadStream(absolutePath, { start, end });
      const chunkSize = end - start + 1;

      return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
        status: 206,
        headers: {
          ...secureVideoHeaders,
          "Content-Length": chunkSize.toString(),
          "Content-Range": `bytes ${start}-${end}/${fileStat.size}`,
        },
      });
    }

    const stream = createReadStream(absolutePath);
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      status: 200,
      headers: {
        ...secureVideoHeaders,
        "Content-Length": fileStat.size.toString(),
      },
    });
  }

  let fileContent: Buffer;
  if (process.env.S3_BUCKET_NAME) {
    const signedUrl = await generateSignedDownloadUrl(relativePath, STREAM_EXPIRES);
    const fetchRes = await fetch(signedUrl);
    if (!fetchRes.ok) {
      throw new Error(`Signed fetch failed: ${fetchRes.status}`);
    }
    fileContent = Buffer.from(await fetchRes.arrayBuffer());
  } else {
    fileContent = await downloadFileFromStorage(relativePath);
  }

  const response = new NextResponse(new Uint8Array(fileContent));
  Object.entries(secureVideoHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set("Content-Length", fileContent.length.toString());
  return response;
}
