import { NextRequest, NextResponse } from 'next/server';
import { stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { extname, join } from 'path';
import { Readable } from 'stream';
import {
  assertSafeStoragePath,
  getStorageConfig,
  getStorageDriver,
} from '@/lib/services/storage-adapter';
import { getS3ObjectStream, isPrivateStoragePath } from '@/lib/services/storage-s3';
import { buildPublicUrl } from '@/lib/services/s3-client';

export const runtime = 'nodejs';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  // '.svg' removed: stored SVG served as image/svg+xml executes inline scripts.
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.html': 'text/html',
};

function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function isProtectedCourseVideoPath(pathParam: string): boolean {
  const normalized = pathParam.replace(/\\/g, '/').replace(/^\/+/, '');
  return /^courses\/[^/]+\/lessons\/[^/]+\/video\/.+\.(mp4|webm)$/i.test(normalized);
}

export async function GET(req: NextRequest) {
  const storageConfig = getStorageConfig();
  const pathParam = decodeURIComponent(req.nextUrl.pathname.replace(/^\/api\/uploads\/?/, ''));

  if (!pathParam) {
    return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 });
  }

  if (isProtectedCourseVideoPath(pathParam)) {
    return NextResponse.json(
      { error: 'Protected video files must be streamed through the lesson player' },
      {
        status: 403,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      }
    );
  }

  // مسیر پیمایش دایرکتوری را حتی در حالت ابری هم مسدود می‌کنیم
  let fullPath: string;
  try {
    fullPath = assertSafeStoragePath(storageConfig.storagePath, pathParam);
  } catch {
    return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 });
  }

  if (getStorageDriver() === 's3') {
    // فایل‌های عمومی: ریدایرکت دائمی به CDN تا مرورگر URL نهایی را کش کند.
    if (!isPrivateStoragePath(pathParam)) {
      return NextResponse.redirect(buildPublicUrl(pathParam), {
        status: 301,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // فایل‌های خصوصی: از داخل اپ استریم می‌شوند تا کنترل دسترسی حفظ شود.
    // تریلر دوره عمومی‌نما است ولی خصوصی ذخیره می‌شود تا هات‌لینک نشود —
    // باید مثل ویدیو range بخورد وگرنه <video> پخش نمی‌کند.
    const range = req.headers.get('range') || undefined;
    const object = await getS3ObjectStream(pathParam, range);

    if (!object) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const isTrailer = /^courses\/[^/]+\/trailer\//i.test(
      pathParam.replace(/\\/g, '/').replace(/^\/+/, '')
    );
    const headers: Record<string, string> = {
      'Content-Type': object.contentType,
      'Cache-Control': isTrailer
        ? 'public, max-age=86400, stale-while-revalidate=604800'
        : 'private, no-store',
      'Accept-Ranges': 'bytes',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    };
    if (object.contentLength !== undefined) {
      headers['Content-Length'] = object.contentLength.toString();
    }
    if (object.contentRange) {
      headers['Content-Range'] = object.contentRange;
    }

    return new NextResponse(object.body, {
      status: object.contentRange ? 206 : 200,
      headers,
    });
  }

  try {
    let resolvedPath = fullPath;
    let fileStat;

    try {
      fileStat = await stat(resolvedPath);
    } catch {
      // Seed records reference generated image paths; return a real local
      // placeholder until those generated assets are uploaded.
      if (pathParam.startsWith('courses/')) {
        resolvedPath = join(process.cwd(), 'public/images/courses/placeholder.png');
      } else if (pathParam.startsWith('news/')) {
        resolvedPath = join(process.cwd(), 'public/images/news/post-1.jpg');
      } else {
        throw new Error('File not found');
      }
      fileStat = await stat(resolvedPath);
    }

    if (!fileStat.isFile()) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const isExact = resolvedPath === fullPath;
    const cacheControl = isExact
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=300, stale-while-revalidate=86400';
    const etag = `"${fileStat.size.toString(16)}-${Math.trunc(fileStat.mtimeMs).toString(16)}"`;
    const ifNoneMatch = req.headers.get('if-none-match');
    if (ifNoneMatch && ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          'Cache-Control': cacheControl,
        },
      });
    }

    // ویدیو باید range بخورد وگرنه <video> seek/play نمی‌کند — کل فایل یکجا هم سنگین است
    const rangeHeader = req.headers.get('range');
    const totalSize = fileStat.size;
    let start = 0;
    let end = totalSize - 1;
    let partial = false;
    if (rangeHeader) {
      const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
      if (match) {
        partial = true;
        if (match[1]) start = Math.min(parseInt(match[1], 10), totalSize - 1);
        if (match[2]) end = Math.min(parseInt(match[2], 10), totalSize - 1);
        if (end < start) {
          return new NextResponse(null, {
            status: 416,
            headers: { 'Content-Range': `bytes */${totalSize}` },
          });
        }
      }
    }
    const chunkSize = end - start + 1;
    const fileStream = createReadStream(resolvedPath, partial ? { start, end } : {});
    const headers: Record<string, string> = {
      'Content-Type': getMimeType(resolvedPath),
      'Content-Length': chunkSize.toString(),
      'Cache-Control': cacheControl,
      ETag: etag,
      'Accept-Ranges': 'bytes',
      // Served bytes are user uploads — never let the browser sniff/execute them.
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': 'inline',
    };
    if (partial) headers['Content-Range'] = `bytes ${start}-${end}/${totalSize}`;
    return new NextResponse(Readable.toWeb(fileStream) as ReadableStream, {
      status: partial ? 206 : 200,
      headers,
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
