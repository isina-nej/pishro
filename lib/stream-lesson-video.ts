import { NextResponse } from "next/server";
import { downloadFileFromStorage } from "@/lib/services/object-storage-service";
import { getAbsoluteStoragePath } from "@/lib/services/storage-adapter";
import { getS3ObjectStream } from "@/lib/services/storage-s3";
import { existsSync } from "fs";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";

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

  // فایل روی دیسک محلی نیست → از فضای ابری استریم می‌کنیم.
  // مهم: بدنه به‌صورت استریم پاس داده می‌شود و Range هم منتقل می‌شود،
  // تا هم seek کردن کار کند و هم کل ویدیو وارد حافظه سرور نشود.
  if (process.env.S3_BUCKET_NAME) {
    const range = req?.headers.get("range") || undefined;
    const object = await getS3ObjectStream(relativePath, range);

    if (!object) {
      return new NextResponse(null, { status: 404, headers: secureVideoHeaders });
    }

    const headers: Record<string, string> = { ...secureVideoHeaders };
    if (object.contentLength !== undefined) {
      headers["Content-Length"] = object.contentLength.toString();
    }
    if (object.contentRange) {
      headers["Content-Range"] = object.contentRange;
    }

    return new NextResponse(object.body, {
      status: object.contentRange ? 206 : 200,
      headers,
    });
  }

  const fileContent = await downloadFileFromStorage(relativePath);

  const response = new NextResponse(new Uint8Array(fileContent));
  Object.entries(secureVideoHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set("Content-Length", fileContent.length.toString());
  return response;
}
